// src/pages/reset-password.js
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  return (

    <ResetPasswordForm token={token} />

  );
}