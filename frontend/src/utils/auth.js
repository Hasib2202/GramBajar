// Store token in cookie
export const storeToken = (token) => {
  document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`;
};

// Remove token
export const removeToken = () => {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// Get token
export const getToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};

// Check authentication status
export const isAuthenticated = () => {
  return !!getToken();
};

// Get user role (requires token decoding)
export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (e) {
    return null;
  }
};