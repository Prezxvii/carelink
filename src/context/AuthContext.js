import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// ✅ UPDATED: Dynamic API URL for Production (Render)
const API_URL = process.env.REACT_APP_API_URL || 'https://carelink-60s8.onrender.com/api/auth';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('carelink_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/user`, {
          headers: { 'x-auth-token': token }
        });
        const data = await response.json();
        
        if (response.ok) {
          setUser(data);
        } else {
          localStorage.removeItem('carelink_token');
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
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
      const response = await fetch(`${API_URL}/register`, {
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
    const token = localStorage.getItem('carelink_token');
    if (!user || !token) return;

    try {
      const response = await fetch(`${API_URL}/toggle-favorite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ resourceId: String(resourceId) })
      });

      const data = await response.json();
      if (response.ok) {
        setUser(prev => ({ ...prev, savedItems: data.savedItems }));
      }
    } catch (error) {
      console.error("Network error while toggling favorite:", error);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('carelink_token');
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    toggleFavorite,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};