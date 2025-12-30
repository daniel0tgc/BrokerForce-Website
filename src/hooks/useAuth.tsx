// src/hooks/useAuth.tsx
import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { authService, User, AuthResponse } from "@/services/authService";
import { favoritesService } from "@/services/favoritesService";

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

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Checking authentication...");
      const response: AuthResponse = await authService.checkAuth();
      console.log("Auth check response:", response);

      if (response.user) {
        console.log("User authenticated:", response.user.email);
        setUser(response.user);
        // Migrate localStorage favorites to database when user signs in
        try {
          await favoritesService.migrateLocalStorageToDatabase();
        } catch (err) {
          console.error("Error migrating favorites:", err);
          // Don't fail auth if migration fails
        }
      } else {
        console.log("No user found in auth response");
        setUser(null);
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
      setError("Failed to check authentication status");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = () => {
    authService.initiateGoogleLogin();
  };

  const logout = async () => {
    try {
      const result = await authService.logout();
      if (result.success) {
        setUser(null);
        setError(null);
        // Clear localStorage favorites on logout (optional - you might want to keep them)
        // localStorageFavoritesService.clear();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed");
    }
  };

  // Check authentication on mount and when URL changes
  useEffect(() => {
    // Check for auth success in URL params first
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get("auth");

    if (authStatus === "success") {
      console.log("OAuth redirect detected, checking authentication...");
      // Remove the auth parameter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("auth");
      window.history.replaceState({}, "", newUrl.toString());

      // Retry logic to check authentication after OAuth redirect
      // This helps with cross-origin cookie handling where cookies may take time to be set
      let retryCount = 0;
      const maxRetries = 10; // Increased retries
      const baseDelay = 300; // Initial delay

      const attemptAuthCheck = async () => {
        retryCount++;
        console.log(`Auth check attempt ${retryCount}/${maxRetries}`);
        
        try {
          // Call authService directly to get the response
          const response: AuthResponse = await authService.checkAuth();
          
          if (response.user) {
            // Success! User is authenticated - use checkAuth to update state properly
            console.log("User found, updating state...");
            await checkAuth(); // This will handle state updates and favorites migration
            return; // Stop retrying
          }
          
          // No user yet, retry if we haven't exceeded max retries
          console.log(`No user found, will retry... (attempt ${retryCount}/${maxRetries})`);
          if (retryCount < maxRetries) {
            // Exponential backoff with jitter
            const delay = baseDelay * Math.pow(1.5, retryCount - 1);
            console.log(`Retrying auth check in ${delay}ms...`);
            setTimeout(() => {
              attemptAuthCheck();
            }, delay);
          } else {
            // Max retries reached
            console.error("Max auth check retries reached, giving up");
            setIsLoading(false);
            setUser(null);
          }
        } catch (error) {
          console.error(`Auth check attempt ${retryCount} failed:`, error);
          if (retryCount < maxRetries) {
            const delay = baseDelay * Math.pow(1.5, retryCount - 1);
            setTimeout(() => {
              attemptAuthCheck();
            }, delay);
          } else {
            console.error("Max auth check retries reached after error");
            setIsLoading(false);
            setUser(null);
          }
        }
      };

      // Start with initial delay, then retry
      setTimeout(() => {
        attemptAuthCheck();
      }, baseDelay);
    } else {
      // Normal auth check on mount
      checkAuth();
    }
  }, [checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
