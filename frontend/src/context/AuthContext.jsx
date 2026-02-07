/**
 * Authentication Context
 * 
 * LEARNING: React Context API
 * 
 * Context provides a way to share data across components without
 * passing props through every level (avoiding "prop drilling").
 * 
 * This context manages:
 * - Current user state
 * - Login/logout functions
 * - JWT token storage
 * - API calls for authentication
 */

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create Context
/**
 * LEARNING: createContext
 * 
 * Creates a context object that components can subscribe to.
 */
const AuthContext = createContext(null);

// Custom Hook for using Auth Context
/**
 * LEARNING: Custom Hooks
 * 
 * Custom hooks let you extract component logic into reusable functions.
 * This hook provides easy access to auth context.
 * 
 * Usage in components:
 * const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    /**
     * LEARNING: useEffect for Initial Load
     * 
     * When app loads, check if user was previously logged in
     * by checking for saved token in localStorage.
     */
    useEffect(() => {
        if (token) {
            // Fetch user profile with saved token
            fetchUserProfile(token);
        } else {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch user profile from API
     */
    const fetchUserProfile = async (authToken) => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/profile`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // Token might be expired, clear it
            logout();
        } finally {
            setLoading(false);
        }
    };

    /**
     * Login Function
     * 
     * LEARNING: Async Functions in React
     * 
     * API calls are asynchronous. We use async/await to handle them.
     * 
     * Flow:
     * 1. Send email/password to backend
     * 2. Receive JWT token + user data
     * 3. Save token to localStorage (persists across reloads)
     * 4. Update user state
     */
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });

            const { access_token, user: userData } = response.data;

            // Save token
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(userData);

            toast.success('Logged in successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.detail || 'Login failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    /**
     * Register Function
     */
    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, {
                name,
                email,
                password
            });

            const { access_token, user: userData } = response.data;

            // Auto-login after registration
            localStorage.setItem('token', access_token);
            setToken(access_token);
            setUser(userData);

            toast.success('Account created successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.detail || 'Registration failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    /**
     * Logout Function
     * 
     * Clear token and user data.
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        toast.success('Logged out successfully');
    };

    /**
     * Update Profile Function
     */
    const updateProfile = async (updates) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/auth/profile`,
                updates,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(response.data);
            toast.success('Profile updated successfully!');
            return { success: true };
        } catch (error) {
            const message = error.response?.data?.detail || 'Update failed';
            toast.error(message);
            return { success: false, error: message };
        }
    };

    /**
     * Get Authorization Header
     * 
     * Helper function to get auth header for API calls.
     * 
     * Usage:
     * const headers = getAuthHeader();
     * axios.get('/api/endpoint', { headers });
     */
    const getAuthHeader = () => {
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    // Context value
    /**
     * LEARNING: Context Value
     * 
     * This object contains all the data and functions we want to
     * make available to consuming components.
     */
    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        getAuthHeader,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
