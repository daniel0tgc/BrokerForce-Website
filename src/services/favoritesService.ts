// Favorites service - API integration with localStorage fallback
import { Property } from "@/data/properties";
import { localStorageFavoritesService } from "./localStorageFavorites";

const baseUrl = import.meta.env.VITE_AUTH_SERVER_URL || "http://localhost:3001";

export interface Favorite {
  id: number;
  property_id: string;
  property_data: Property | null;
  created_at: string;
}

class FavoritesService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${baseUrl}/api/favorites${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json();
  }

  // Check if user is authenticated (by attempting to fetch favorites)
  private async checkAuthentication(): Promise<boolean> {
    try {
      const response = await fetch(`${baseUrl}/api/me`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async getFavorites(isAuthenticated?: boolean): Promise<Favorite[]> {
    // If explicitly passed as false, use localStorage
    if (isAuthenticated === false) {
      const localFavorites = localStorageFavoritesService.getAll();
      // Convert to Favorite[] format for compatibility
      return localFavorites.map((fav, index) => ({
        id: index,
        property_id: fav.propertyId,
        property_data: fav.propertyData,
        created_at: fav.addedAt,
      }));
    }

    // Check authentication if not explicitly provided
    const authenticated = isAuthenticated ?? (await this.checkAuthentication());

    if (!authenticated) {
      // Use localStorage for non-authenticated users
      const localFavorites = localStorageFavoritesService.getAll();
      return localFavorites.map((fav, index) => ({
        id: index,
        property_id: fav.propertyId,
        property_data: fav.propertyData,
        created_at: fav.addedAt,
      }));
    }

    // Use API for authenticated users
    const data = await this.request("/");
    return data.favorites || [];
  }

  async addFavorite(
    propertyId: string,
    propertyData?: Property,
    isAuthenticated?: boolean
  ): Promise<Favorite | null> {
    // If explicitly passed as false, use localStorage
    if (isAuthenticated === false) {
      if (propertyData) {
        localStorageFavoritesService.add(propertyId, propertyData);
      }
      const localFavorites = localStorageFavoritesService.getAll();
      const fav = localFavorites.find((f) => f.propertyId === propertyId);
      return fav
        ? {
            id: 0,
            property_id: fav.propertyId,
            property_data: fav.propertyData,
            created_at: fav.addedAt,
          }
        : null;
    }

    // Check authentication if not explicitly provided
    const authenticated = isAuthenticated ?? (await this.checkAuthentication());

    if (!authenticated) {
      // Use localStorage for non-authenticated users
      if (propertyData) {
        localStorageFavoritesService.add(propertyId, propertyData);
      }
      const localFavorites = localStorageFavoritesService.getAll();
      const fav = localFavorites.find((f) => f.propertyId === propertyId);
      return fav
        ? {
            id: 0,
            property_id: fav.propertyId,
            property_data: fav.propertyData,
            created_at: fav.addedAt,
          }
        : null;
    }

    // Use API for authenticated users
    const data = await this.request("/", {
      method: "POST",
      body: JSON.stringify({ propertyId, propertyData }),
    });
    return data.favorite;
  }

  async removeFavorite(
    propertyId: string,
    isAuthenticated?: boolean
  ): Promise<void> {
    // If explicitly passed as false, use localStorage
    if (isAuthenticated === false) {
      localStorageFavoritesService.remove(propertyId);
      return;
    }

    // Check authentication if not explicitly provided
    const authenticated = isAuthenticated ?? (await this.checkAuthentication());

    if (!authenticated) {
      // Use localStorage for non-authenticated users
      localStorageFavoritesService.remove(propertyId);
      return;
    }

    // Use API for authenticated users
    await this.request(`/${propertyId}`, {
      method: "DELETE",
    });
  }

  async isFavorite(
    propertyId: string,
    isAuthenticated?: boolean
  ): Promise<boolean> {
    // If explicitly passed as false, use localStorage
    if (isAuthenticated === false) {
      return localStorageFavoritesService.isFavorite(propertyId);
    }

    // Check authentication if not explicitly provided
    const authenticated = isAuthenticated ?? (await this.checkAuthentication());

    if (!authenticated) {
      // Use localStorage for non-authenticated users
      return localStorageFavoritesService.isFavorite(propertyId);
    }

    // Use API for authenticated users
    const data = await this.request(`/check/${propertyId}`);
    return data.isFavorite;
  }

  // Migrate localStorage favorites to database when user signs in
  async migrateLocalStorageToDatabase(): Promise<void> {
    const localFavorites = localStorageFavoritesService.getAll();
    if (localFavorites.length === 0) return;

    try {
      // Add each localStorage favorite to the database
      for (const fav of localFavorites) {
        try {
          await this.request("/", {
            method: "POST",
            body: JSON.stringify({
              propertyId: fav.propertyId,
              propertyData: fav.propertyData,
            }),
          });
        } catch (error) {
          // If favorite already exists in database, that's fine, continue
          console.log(`Favorite ${fav.propertyId} might already exist, skipping`);
        }
      }

      // Clear localStorage after successful migration
      localStorageFavoritesService.clear();
    } catch (error) {
      console.error("Error migrating favorites to database:", error);
      // Don't clear localStorage if migration fails
    }
  }
}

export const favoritesService = new FavoritesService();
