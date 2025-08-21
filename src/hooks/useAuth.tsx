// src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext } from 'react';
import { authService, User, AuthResponse } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: AuthResponse = await authService.checkAuth();
      
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
      setError('Failed to check authentication status');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    authService.initiateGoogleLogin();
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setUser(null);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed');
    }
  };

  // Check authentication on mount and when URL changes
  useEffect(() => {
    checkAuth();

    // Check for auth success in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      // Remove the auth parameter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('auth');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Re-check authentication
      setTimeout(checkAuth, 1000);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
