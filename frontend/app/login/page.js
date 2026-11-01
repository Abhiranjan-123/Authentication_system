'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  //const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  // ❌ Purana line:
// const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

// ✅ Naya aur 100% Working Line:
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://authentication-system-47z5.onrender.com';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      const token = res.data.token || res.data.accessToken;

      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        console.error("Token missing in response!");
        setError("Login failed: No token received.");
        return;
      }

      router.push('/dashboard1');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md rounded-xl bg-gray-800 p-8 shadow-md">

        <h2 className="mb-6 text-center text-2xl font-bold">
          Login to Your Account
        </h2>

        {error && (
          <div className="mb-4 rounded border border-red-500 bg-red-500/20 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-gray-600 bg-gray-700 p-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-600 bg-gray-700 p-2.5 focus:border-indigo-500 focus:outline-none"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between text-sm mb-4">
            <label className="flex items-center text-gray-400"></label>
            <a href="/forgot-password" className="text-indigo-400 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-600 py-2.5 font-semibold transition duration-200 hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-600"></div>
          <span className="text-sm text-gray-400">OR</span>
          <div className="h-px flex-1 bg-gray-600"></div>
        </div>

        <a
          href={`${API_URL}/api/auth/google`}
          className="flex w-full items-center justify-center gap-3 rounded border border-gray-300 bg-white py-2.5 font-semibold text-gray-900 shadow-sm transition duration-200 hover:bg-gray-100"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="h-5 w-5"
            alt="Google"
          />
          Continue with Google
        </a>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-indigo-400 hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
}
