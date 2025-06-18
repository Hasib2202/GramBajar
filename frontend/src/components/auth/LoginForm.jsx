import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/auth/login', data);
      
      // Redirect based on role
      if (response.data.role === 'Admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-dark">Email</Label>
          <Input 
            id="email"
            type="email"
            {...register('email', { required: 'Email is required' })}
            className="mt-1 border-secondary"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
        </div>
        
        <div>
          <Label htmlFor="password" className="text-dark">Password</Label>
          <Input 
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="mt-1 border-secondary"
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
        </div>
        
        <Button type="submit" className="w-full py-2 btn-primary">
          Login
        </Button>
      </form>
      
      <div className="mt-4 text-center">
        <a 
          href="/forgot-password" 
          className="underline text-secondary hover:text-accent"
        >
          Forgot Password?
        </a>
      </div>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-secondary"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-light text-secondary">Or continue with</span>
        </div>
      </div>
      
      <Button 
        type="button" 
        className="w-full py-2 btn-secondary"
      >
        Sign in with Google
      </Button>
      
      <div className="mt-6 text-center">
        <p className="text-dark">
          Don't have an account?{' '}
          <a href="/register" className="font-medium text-accent hover:text-secondary">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}