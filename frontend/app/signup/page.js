'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Dynamic Backend URL for Google OAuth link
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      setMessage(res.data.message);
      setTimeout(() => router.push('/login'), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSignup} className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
        {error && <p className="mb-4 text-red-400 text-sm">{error}</p>}
        {message && <p className="mb-4 text-emerald-400 text-sm">{message}</p>}
        
        <input 
          type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none" required 
        />
        <input 
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none" required 
        />
        <input 
          type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded border border-gray-600 focus:outline-none" required 
        />
        
        <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-bold transition">
          Sign Up
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        {/* Google OAuth Button */}
        <a 
          href={`${API_URL}/api/auth/google`} 
          className="w-full flex items-center justify-center gap-3 py-3 bg-white text-gray-900 rounded font-semibold hover:bg-gray-100 transition duration-200 shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </a>

        <p className="mt-4 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-indigo-400 underline">Login here</a>
        </p>
      </form>
    </div>
  );
}
