import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGoogleAuthUrl, handleGoogleCallback } from '@/lib/auth.js';

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
  const [sessionToken, setSessionToken] = useState(null);
  const [idToken, setIdToken] = useState(null);

  // Initialize user and session from localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedSessionToken = localStorage.getItem('sessionToken');
    const savedIdToken = localStorage.getItem('idToken');

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        if (savedSessionToken) {
          setSessionToken(savedSessionToken);
        }
        if (savedIdToken) {
          setIdToken(savedIdToken);
        }
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('idToken');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const authUrl = await getGoogleAuthUrl();
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error('Sign-in failed:', error);
      alert(`Sign-in failed: ${error.message}`);
      setLoading(false);
    }
  };

  const handleAuthCallback = async () => {
    try {
      setLoading(true);
      const result = await handleGoogleCallback();

      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));

        // Store session token if provided by backend
        if (result.sessionToken) {
          setSessionToken(result.sessionToken);
          localStorage.setItem('sessionToken', result.sessionToken);
        }

        // Store ID token for authenticated API calls
        if (result.idToken) {
          setIdToken(result.idToken);
          localStorage.setItem('idToken', result.idToken);
        }

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Auth callback failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setSessionToken(null);
      setIdToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('idToken');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const value = {
    user,
    loading,
    sessionToken,
    idToken,
    signInWithGoogle,
    signOut,
    handleAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
