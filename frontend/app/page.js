'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-400">Welcome to Auth System</h1>
        <p className="text-gray-300 mb-8">
          A secure, production-ready authentication system featuring JWT access/refresh tokens, role-based access control, account verification, and Google OAuth.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-bold transition">
            Login
          </Link>
          <Link href="/signup" className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded font-bold transition">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}