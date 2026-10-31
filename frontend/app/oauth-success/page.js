'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function OAuthSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // Token ko localStorage me save kar lo
      localStorage.setItem('accessToken', token);
      // Dashboard par bhej do
      router.push('/dashboard');
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Google Authentication Successful!</h2>
        <p className="text-gray-400 mt-2">Logging you in...</p>
      </div>
    </div>
  );
}

export default function OAuthSuccess() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>}>
      <OAuthSuccessContent />
    </Suspense>
  );
}