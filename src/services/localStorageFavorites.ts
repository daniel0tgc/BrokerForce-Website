// LocalStorage service for favorites when user is not authenticated
import { Property } from "@/data/properties";

const STORAGE_KEY = "brokerforce_favorites";

export interface LocalStorageFavorite {
  propertyId: string;
  propertyData: Property;
  addedAt: string;
}

class LocalStorageFavoritesService {
  // Get all favorites from localStorage
  getAll(): LocalStorageFavorite[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
      return [];
    }
  }

  // Add a favorite to localStorage
  add(propertyId: string, propertyData: Property): void {
    try {
      const favorites = this.getAll();
      // Check if already exists
      if (favorites.some((fav) => fav.propertyId === propertyId)) {
        return; // Already exists
      }
      favorites.push({
        propertyId,
        propertyData,
        addedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      window.dispatchEvent(new CustomEvent("localStorageFavoritesChanged"));
    } catch (error) {
      console.error("Error saving favorite to localStorage:", error);
    }
  }

  // Remove a favorite from localStorage
  remove(propertyId: string): void {
    try {
      const favorites = this.getAll();
      const filtered = favorites.filter((fav) => fav.propertyId !== propertyId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent("localStorageFavoritesChanged"));
    } catch (error) {
      console.error("Error removing favorite from localStorage:", error);
    }
  }

  // Check if a property is favorited
  isFavorite(propertyId: string): boolean {
    const favorites = this.getAll();
    return favorites.some((fav) => fav.propertyId === propertyId);
  }

  // Get favorite count
  getCount(): number {
    return this.getAll().length;
  }

  // Clear all favorites
  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("localStorageFavoritesChanged"));
    } catch (error) {
      console.error("Error clearing favorites from localStorage:", error);
    }
  }

  // Get property IDs array
  getPropertyIds(): string[] {
    return this.getAll().map((fav) => fav.propertyId);
  }

  // Get properties array
  getProperties(): Property[] {
    return this.getAll().map((fav) => fav.propertyData);
  }
}

export const localStorageFavoritesService = new LocalStorageFavoritesService();
