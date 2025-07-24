// Shared configuration for the application

// API Configuration
// Always use current origin for API calls
export const API_BASE_URL = `${window.location.origin}/api`;
export const API_ROOT_URL = window.location.origin;

// Authentication Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const REDIRECT_URI = `${window.location.origin}/auth/callback`;
