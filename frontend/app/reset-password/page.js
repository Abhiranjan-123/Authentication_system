'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/utils/api';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        token,
        email,
        newPassword
      });
      setMessage(res.data.message || 'Password reset successful!');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

      {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500 text-red-300 rounded text-sm">{error}</div>}
      {message && <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded text-sm">{message}</div>}

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required
            placeholder="Enter new password"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
            placeholder="Confirm new password"
            className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500 text-white"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded font-semibold transition duration-200 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}