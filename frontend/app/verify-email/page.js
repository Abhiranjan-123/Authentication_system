'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [status, setStatus] = useState('Verifying...');

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    if (token && email) {
      axios.get(`${API_URL}/api/auth/verify-email?token=${token}&email=${email}`)
        .then(res => {
          setStatus('Email verified successfully! You can now log in.');
        })
        .catch(err => {
          setStatus('Verification failed or link expired.');
        });
    }
  }, [token, email]);

  return (
    <div className="p-8 bg-gray-800 rounded-xl shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
      <p>{status}</p>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
