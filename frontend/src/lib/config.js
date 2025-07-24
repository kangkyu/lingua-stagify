// Shared configuration for the application

// API Configuration
// In local dev: VITE_API_URL='http://localhost:3001'
// In production: VITE_API_URL is unset, uses relative paths
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

export const API_ROOT_URL = import.meta.env.VITE_API_URL || '';

// Authentication Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const REDIRECT_URI = `${window.location.origin}/auth/callback`;
