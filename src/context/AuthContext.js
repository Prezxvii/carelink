import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Context object
const AuthContext = createContext();

// Base URL for your backend - ensure this matches your server port
const API_URL = 'http://localhost:5000/api/auth';

/**
 * Custom hook to use the AuthContext
 * This must be used within an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * The Provider component that wraps your app
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token and fetch user data on load to persist session
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
          // If token is invalid or expired, clear it from storage
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

  // --- LOGIN ---
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

  // --- SIGNUP ---
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

  // --- TOGGLE FAVORITE (Syncs with Backend Database) ---
  const toggleFavorite = async (resourceId) => {
    const token = localStorage.getItem('carelink_token');
    
    // Safety check: User must be logged in to save favorites
    if (!user || !token) {
      console.warn("User session not found. Please log in to save favorites.");
      return;
    }

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
        // Sync local React state with the updated array from the database
        setUser(prev => ({ 
          ...prev, 
          savedItems: data.savedItems 
        }));
      } else {
        console.error("Failed to update favorites in database:", data.message);
      }
    } catch (error) {
      console.error("Network error while toggling favorite:", error);
    }
  };

  // --- UPDATE PROFILE ---
  const updateProfileData = async (newData) => {
    const token = localStorage.getItem('carelink_token');
    try {
      const response = await fetch(`${API_URL}/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(newData)
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  };

  // --- DELETE ACCOUNT ---
  const deleteAccount = async () => {
    const token = localStorage.getItem('carelink_token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_URL}/delete-account`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token }
      });

      if (response.ok) {
        logout(); 
        return true;
      }
      return false;
    } catch (error) {
      console.error("Delete account error:", error);
      return false;
    }
  };

  // --- LOGOUT ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem('carelink_token');
  };

  // Context values to be shared across the app
  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    toggleFavorite,
    updateProfileData,
    deleteAccount,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Prevents routes from rendering until we verify the user's 
        session status (isLoading), which stops "flashing" login screens.
      */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// No default export used to prevent "undefined" import errors in other files.