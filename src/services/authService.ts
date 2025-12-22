// src/services/authService.ts

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
  createdAt?: string;
}

export interface AuthResponse {
  user: User | null;
  message?: string;
}

export interface SessionResponse {
  authenticated: boolean;
  user: User | null;
}

class AuthService {
  // Use environment variable for production, fallback to localhost for development
  private baseUrl =
    import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";

  // Check if user is authenticated
  async checkAuth(): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if response is actually JSON (not HTML error page)
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Auth check failed: Received non-JSON response", {
          status: response.status,
          statusText: response.statusText,
          url: `${this.baseUrl}/api/me`,
          contentType,
        });
        return { user: null, message: "Invalid response from server" };
      }

      if (!response.ok) {
        return { user: null, message: "Not authenticated" };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Auth check failed:", error);
      console.error("Backend URL:", this.baseUrl);
      return { user: null, message: "Authentication check failed" };
    }
  }

  // Get session status
  async getSessionStatus(): Promise<SessionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/session`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return { authenticated: false, user: null };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Session check failed:", error);
      return { authenticated: false, user: null };
    }
  }

  // Initiate Google OAuth login
  initiateGoogleLogin(): void {
    window.location.href = `${this.baseUrl}/auth/google`;
  }

  // Logout user
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Logout failed:", error);
      return { success: false, message: "Logout failed" };
    }
  }

  // Check if auth server is running
  async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error("Auth server health check failed:", error);
      return false;
    }
  }

  // Get the current base URL (useful for debugging)
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

export const authService = new AuthService();
