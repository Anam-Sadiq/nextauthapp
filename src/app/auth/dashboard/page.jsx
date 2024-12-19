'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/auth/login");
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <p className="text-gray-600">You are not logged in. Redirecting to login page...</p>
      </div>
    );
  }

  const email = session.user?.email || "";
  const firstLetter = email.charAt(0).toUpperCase();
  const firstWord = email.split("@")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
      <div className="max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {firstWord}!
            </h1>
            <p className="text-gray-600 mt-2">
              You are logged in with <span className="font-semibold">{email}</span>.
            </p>
          </div>
          <div className="w-16 h-16 bg-gray-500 text-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold">
              {firstLetter}
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-blue-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-blue-800">Profile</h2>
            <p className="mt-2 text-sm text-blue-600">
              View and update your personal details.
            </p>
          </div>
          <div className="bg-green-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-green-800">Settings</h2>
            <p className="mt-2 text-sm text-green-600">
              Manage your account preferences and settings.
            </p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-yellow-800">Notifications</h2>
            <p className="mt-2 text-sm text-yellow-600">
              Check your latest updates and alerts.
            </p>
          </div>
          <div className="bg-red-100 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-lg font-semibold text-red-800">Support</h2>
            <p className="mt-2 text-sm text-red-600">
              Need help? Contact our support team.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
