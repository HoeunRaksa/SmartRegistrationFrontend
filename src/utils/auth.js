/**
 * Authentication Utility Functions
 */

/**
 * Logout user - clear all auth data and redirect to login
 */
/**
 * Logout user - clear all auth data and redirect to login
 */
export const logout = () => {
  localStorage.removeItem('token'); // clear just in case
  localStorage.removeItem('user');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 * (Relies on HttpOnly cookie + user object presence)
 */
export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return !!user;
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
 * Token is stored in HttpOnly cookie by backend (secure)
 */
export const saveAuthData = (token, user) => {
  // Only store user info, token is in HttpOnly cookie
  localStorage.setItem('user', JSON.stringify(user));
};