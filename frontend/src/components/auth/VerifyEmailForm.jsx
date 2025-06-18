// pages/verify-email.js
import React, { useState, useEffect } from 'react';
import { MailCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { useRouter } from 'next/router';

const VerifyEmailForm = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    useEffect(() => {
        const verifyToken = async () => {
            const { token } = router.query;

            if (!token) {
                setError('Verification token is missing');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email?token=${token}`
                );

                const data = await response.json();

                if (response.ok) {
                    if (data.redirect) {
                        // Redirect on the client-side
                        window.location.href = data.redirect;
                    } else {
                        setSuccess(data.message || 'Email verified successfully!');
                    }
                } else {
                    setError(data.message || 'Email verification failed');
                }
            } catch (error) {
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (router.isReady) {
            verifyToken();
        }
    }, [router.isReady, router.query]);

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
            <div className="w-full max-w-md">
                <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-900 dark:border-gray-700">
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <MailCheck className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {loading ? 'Verifying your email...' : 'Email verification complete'}
                        </p>
                    </div>

                    {/* Alerts */}
                    {error && (
                        <Alert variant="error" className="mb-6">
                            <AlertDescription>
                                {error}
                                {error.includes('expired') && (
                                    <div className="mt-2">
                                        <Link href="/resend-verification" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                            Request a new verification email
                                        </Link>
                                    </div>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                    {success && (
                        <Alert variant="success" className="mb-6">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {!loading && (
                        <div className="mt-6 text-center">
                            <Link href="/login">
                                <button className="w-full px-4 py-3 mb-4 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200">
                                    Continue to Login
                                </button>
                            </Link>

                            <p className="text-gray-600 dark:text-gray-400">
                                Didn't receive the email?{' '}
                                <Link href="/resend-verification" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    Resend verification
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailForm;