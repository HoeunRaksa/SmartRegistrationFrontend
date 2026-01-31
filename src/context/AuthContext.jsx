import { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, logoutApi } from '../api/auth.jsx';
import API from '../api/index.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage (only user, not token)
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // Update API interceptor when token changes
    useEffect(() => {
        if (token) {
            // Add token to all requests
            API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete API.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await loginApi({ email, password });
        const { token: newToken, user: newUser } = response.data;

        // Store token in memory only (secure)
        setToken(newToken);
        setUser(newUser);

        // Store only user info in localStorage (not sensitive)
        localStorage.setItem('user', JSON.stringify(newUser));

        return newUser;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            // Ignore errors on logout
        }

        // Clear everything
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // Clean up if exists
        delete API.defaults.headers.common['Authorization'];
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
