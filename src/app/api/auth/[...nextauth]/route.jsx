import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;;
      }

      if (account?.provider === "github") {
        if (!profile?.email) {
          try {
            // Fetch the email from GitHub's API if it's not in the profile
            const res = await fetch("https://api.github.com/user/emails", {
              headers: {
                Authorization: `token ${account.access_token}`,
              },
            });
            const emails = await res.json();
            if (emails?.length > 0) {
              token.email = emails.find((email) => email.primary)?.email || profile?.email;
            }
          } catch (error) {
            console.error("Error fetching email from GitHub:", error);
          }
        } else {
          token.email = profile.email;
        }
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url === baseUrl || url.includes("/auth/login")) {
        return baseUrl;  
      }
      return url;
    },
  },
  pages: {
    signIn: "/auth/login",  
    error: "/auth/login",   
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,  
};

export const POST = NextAuth(authOptions);
export const GET = NextAuth(authOptions);
