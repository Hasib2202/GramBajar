// src/pages/reset-password.js
import { useRouter } from 'next/router';
import VerifyEmailForm from '../components/auth/VerifyEmailForm';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  return (
    <VerifyEmailForm token={token} />
  );
}