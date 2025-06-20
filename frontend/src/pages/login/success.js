import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginSuccess = () => {
  const router = useRouter();
  
// pages/login/success.js
useEffect(() => {
  const { token, id, name, email, profilePicture } = router.query;
  
  if (token && id) {
    // Decode URI components
    const decodedName = decodeURIComponent(name);
    const decodedProfilePicture = decodeURIComponent(profilePicture || '');
    
    // Store user data in localStorage
    localStorage.setItem('user', JSON.stringify({
      id,
      name: decodedName,
      email,
      profilePicture: decodedProfilePicture,
      token
    }));
    
    // Redirect to home
    setTimeout(() => {
      router.push('/');
    }, 500);
  } else {
    router.push('/login');
  }
}, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
        <h2 className="text-xl font-medium text-gray-900 dark:text-white">
          Logging you in...
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Please wait while we complete your login
        </p>
      </div>
    </div>
  );
};

export default LoginSuccess;