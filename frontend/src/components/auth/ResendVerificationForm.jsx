// pages/resend-verification.js
import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

const ResendVerificationForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-verification`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Verification email sent! Check your inbox.');
      } else {
        setError(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="w-full max-w-md">
        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-900 dark:border-gray-700">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resend Verification Email</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your email to resend account verification
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="error" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Resend Verification'}
            </button>

            <div className="mt-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Already verified?{' '}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationForm;