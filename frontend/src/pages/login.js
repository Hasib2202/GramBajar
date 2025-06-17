import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-accent">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">GramBajar</h1>
          <p className="text-secondary mt-2">Login to your account</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}