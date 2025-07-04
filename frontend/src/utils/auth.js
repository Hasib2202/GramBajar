// src/utils/auth.js
// Check if running in browser environment
const isBrowser = typeof window !== 'undefined';

// Verify authentication with backend
export const verifyAuth = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return data.isAuthenticated;
    }
    return false;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return false;
  }
};

// Get user data
export const getUser = () => {
  if (isBrowser) {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Logout function
export const logout = async () => {
  try {
    // Call backend logout endpoint
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    // Clear frontend auth state
    localStorage.removeItem('user');

    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    window.location.href = '/login';
  }
};