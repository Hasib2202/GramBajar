// src/pages/forgot-password.js
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-accent">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">Password Recovery</h1>
          <p className="text-secondary mt-2">Enter your email to reset your password</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}