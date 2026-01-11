/**
 * Authentication Utility Functions
 */

/**
 * Logout user - clear all auth data and redirect to login
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

/**
 * Check if user has required role
 */
export const hasRole = (requiredRoles) => {
  const user = getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
};

/**
 * Get auth token
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Save auth data after login
 */
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};