import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Google Auth
    initializeGoogleAuth();
  }, []);

  const initializeGoogleAuth = async () => {
    try {
      // Load Google Auth library
      await loadGoogleAuthLibrary();
      
      // Check if user is already signed in
      const auth = window.google.accounts.oauth2;
      // Implementation will be added here
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
      setLoading(false);
    }
  };

  const loadGoogleAuthLibrary = () => {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Google OAuth implementation will be added here
      // For now, we'll simulate a successful login
      const mockUser = {
        id: '123',
        email: 'user@example.com',
        name: 'John Doe',
        picture: 'https://via.placeholder.com/40'
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
    } catch (error) {
      console.error('Google sign-in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      
      // Clear Google Auth session
      if (window.google) {
        // Implementation will be added here
      }
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  // Check for existing user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};