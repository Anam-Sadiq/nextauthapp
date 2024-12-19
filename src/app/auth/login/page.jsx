'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc"; 
import { FaGithub } from "react-icons/fa"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, 
    });

    if (result?.ok) {
      router.push("/auth/dashboard"); 
    } else {
      setError("Login failed! Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { redirect: true })}
            className="flex items-center justify-center w-full bg-gray-100 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            <FcGoogle className="text-2xl mr-2" />
            <span className="text-gray-700 font-medium">Log In with Google</span>
          </button>
          <button
            onClick={() => signIn("github")}
            className="flex items-center justify-center w-full bg-gray-800 px-4 py-2 rounded-lg text-white hover:bg-gray-900 transition"
          >
            <FaGithub className="text-2xl mr-2" />
            <span className="font-medium">Log In with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}
