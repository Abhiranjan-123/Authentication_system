'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      // Agar URL me token hai (Google Login ke baad), toh use localStorage me save kar lo
      localStorage.setItem('accessToken', tokenFromUrl);
      // URL clean karne ke liye token hata do
      router.replace('/dashboard');
    }

    // Token check with localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    }
  }, [searchParams, router]);

  // Logout handler to clear token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition duration-200"
        >
          Logout
        </button>
      </div>
      <p className="text-gray-400 mt-2">You have successfully logged in.</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}