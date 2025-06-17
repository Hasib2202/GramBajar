// src/components/auth/ResetPasswordForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/router';

export default function ResetPasswordForm({ token }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password
      });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setMessage('Failed to reset password. The token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${
          message.includes('Failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {message}
        </div>
      )}
      
      {token ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="password" className="text-dark">New Password</Label>
            <Input 
              id="password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
              className="border-secondary mt-1"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="confirmPassword" className="text-dark">Confirm Password</Label>
            <Input 
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || "Passwords don't match"
              })}
              className="border-secondary mt-1"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full btn-primary py-2"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      ) : (
        <div className="text-center py-8">
          <p className="text-red-500">Invalid reset token. Please check your reset link.</p>
          <Button 
            onClick={() => router.push('/forgot-password')}
            className="mt-4 btn-secondary"
          >
            Request New Reset Link
          </Button>
        </div>
      )}
    </div>
  );
}