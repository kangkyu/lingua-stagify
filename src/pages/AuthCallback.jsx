import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      // Check for error in query params or URL fragment
      if (error || window.location.hash.includes('error=')) {
        setStatus('error');
        setError('Authentication was cancelled or failed');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      // Check for ID token in URL fragment
      const hasTokenInFragment = window.location.hash.includes('id_token=');

      if (!hasTokenInFragment) {
        setStatus('error');
        setError('No ID token received from Google');
        setTimeout(() => navigate('/'), 3000);
        return;
      }

      try {
        const result = await handleAuthCallback();
        if (result.success) {
          setStatus('success');
          setTimeout(() => navigate('/feed'), 1500);
        } else {
          setStatus('error');
          setError(result.error || 'Authentication failed');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        setStatus('error');
        setError('An unexpected error occurred');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleAuthCallback]);

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Completing sign in...
            </h2>
            <p className="text-slate-600">Please wait while we verify your account.</p>
          </div>
        );
      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Successfully signed in!
            </h2>
            <p className="text-slate-600">Redirecting you to the app...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Sign in failed
            </h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <p className="text-sm text-slate-500">You will be redirected to the homepage shortly.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
