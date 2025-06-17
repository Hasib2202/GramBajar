import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      router.push('/verify-email');
    } catch (error) {
      console.error('Registration failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-dark">Full Name</Label>
          <Input 
            id="name"
            type="text"
            {...register('name', { required: 'Name is required' })}
            className="border-secondary mt-1"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="email" className="text-dark">Email</Label>
          <Input 
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="border-secondary mt-1"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="password" className="text-dark">Password</Label>
          <Input 
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
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
              validate: value => value === document.getElementById('password').value || "Passwords don't match"
            })}
            className="border-secondary mt-1"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        
        <Button type="submit" className="w-full btn-primary py-2">
          Register
        </Button>
      </form>
      
      <div className="text-center mt-6">
        <p className="text-dark">
          Already have an account?{' '}
          <a href="/login" className="text-accent hover:text-secondary font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}