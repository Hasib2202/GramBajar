// src/components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { verifyAuth } from '../utils/auth';

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await verifyAuth();

      if (authenticated) {
        setIsAuth(true);
      } else {
        // Store redirect path and cart data
        const cartItems = localStorage.getItem('cart');
        const redirectData = {
          path: router.asPath,
          ...(cartItems && { cartItems: JSON.parse(cartItems) })
        };

        localStorage.setItem('redirectAfterLogin', JSON.stringify(redirectData));

        // Redirect to login
        router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return isAuth ? children : null;
};

export default ProtectedRoute;