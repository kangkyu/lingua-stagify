// Frontend configuration

// API Configuration - point to backend dev server
export const API_BASE_URL = `http://localhost:3001`;
export const API_ROOT_URL = window.location.origin;

// Authentication Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
export const REDIRECT_URI = `${window.location.origin}/auth/callback`;
