// src/pages/reset-password.js
import { useRouter } from 'next/router';
import ResendVerificationForm from '../components/auth/ResendVerificationForm';

export default function ResetPasswordPage() {
    const router = useRouter();
    const { token } = router.query;

    return (

        <ResendVerificationForm />
    );
}