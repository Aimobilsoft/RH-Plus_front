import { useEffect, useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userType: 'admin' | 'candidato' | null;
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userType: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check localStorage first for immediate access
      const localAuth = localStorage.getItem('admin_authenticated');
      if (localAuth === 'true') {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          userType: 'admin',
        });
        return;
      }

      const response = await fetch('/api/auth/status');
      const data = await response.json();
      
      if (data.authenticated) {
        localStorage.setItem('admin_authenticated', 'true');
      }
      
      setAuthState({
        isAuthenticated: data.authenticated || false,
        isLoading: false,
        userType: data.userType || null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userType: null,
      });
    }
  };

  return authState;
}