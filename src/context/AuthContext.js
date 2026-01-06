// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const AuthContext = createContext();

// ✅ Keep REACT_APP_API_URL as DOMAIN only:
//   Local:  http://localhost:5000
//   Prod:   https://carelink-60s8.onrender.com
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const AUTH_URL = `${API_BASE_URL}/api/auth`;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ helper: always read token the same way
  const getToken = () => localStorage.getItem('carelink_token');

  // ✅ helper: build auth headers for protected routes
  const authHeaders = (token) => ({
    'Content-Type': 'application/json',
    'x-auth-token': token
    // If you ever switch to Bearer, you can also add:
    // authorization: `Bearer ${token}`
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${AUTH_URL}/user`, {
          headers: { 'x-auth-token': token }
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data);
        } else {
          localStorage.removeItem('carelink_token');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('carelink_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${AUTH_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('carelink_token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');

      localStorage.setItem('carelink_token', data.token);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const toggleFavorite = async (resourceId) => {
    const token = getToken();
    if (!user || !token) return;

    try {
      const response = await fetch(`${AUTH_URL}/toggle-favorite`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ resourceId: String(resourceId) })
      });

      const data = await response.json();

      if (!response.ok) {
        // token invalid/expired etc.
        if (response.status === 401) {
          localStorage.removeItem('carelink_token');
          setUser(null);
        }
        return;
      }

      setUser((prev) => ({ ...prev, savedItems: data.savedItems }));
    } catch (error) {
      console.error('Network error while toggling favorite:', error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carelink_token');
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
      toggleFavorite,
      isAuthenticated: !!user
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
