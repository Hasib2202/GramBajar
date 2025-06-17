// src/pages/reset-password.js
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-accent">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">Reset Password</h1>
          <p className="text-secondary mt-2">Create a new password for your account</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}