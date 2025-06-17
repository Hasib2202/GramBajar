// src/pages/verify-email.js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { token } = router.query;
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setMessage('Missing verification token. Please check your email for the correct link.');
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      if (response.data.success) {
        setMessage('Email verified successfully! You can now login.');
      } else {
        setMessage('Failed to verify email. Please try again.');
      }
    } catch (error) {
      setMessage('Failed to verify email. The link may have expired or is invalid.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-accent">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-dark">Email Verification</h1>
          <p className="text-secondary mt-4">{message}</p>
          
          {message.includes('successfully') && (
            <Button 
              onClick={() => router.push('/login')}
              className="mt-6 btn-primary"
            >
              Go to Login
            </Button>
          )}
          
          {message.includes('Failed') && (
            <Button 
              onClick={() => router.push('/register')}
              className="mt-6 btn-secondary"
            >
              Register Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}