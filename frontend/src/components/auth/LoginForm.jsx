import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome, Sun, Moon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Theme toggle
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = false;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verification = urlParams.get('verification');
    const loginSuccess = urlParams.get('login');
    const authError = urlParams.get('error');

    if (verification === 'success') {
      setSuccess('Email verified successfully! You can now login.');
    }
    if (loginSuccess === 'success') {
      setSuccess('Login successful!');
    }
    if (authError === 'google-auth-failed') {
      setError('Google authentication failed. Please try again.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        localStorage.setItem('user', JSON.stringify(data));
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Clear existing Google session
    // window.open('https://accounts.google.com/logout', '_blank');

    // Add random state parameter
    const state = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('oauth_state', state);
    
    // Redirect to Google auth with fresh prompt
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google?prompt=select_account`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <div className="relative w-full max-w-md">
        {/* Theme Toggle */}
        {/* <button
          onClick={toggleTheme}
          className="absolute p-2 text-gray-600 rounded-full top-4 right-4 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button> */}

        <div className="p-8 bg-white border border-gray-100 shadow-xl rounded-2xl dark:bg-gray-900 dark:border-gray-700">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account to continue</p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="error" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-6">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-4 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 pl-10 pr-12 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Forgot your password?
              </a>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-4 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full gap-3 px-4 py-3 font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <Chrome className="w-5 h-5" />
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Sign up
              </a>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need to verify your email?{' '}
              <a href="/resend-verification" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Resend verification
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
