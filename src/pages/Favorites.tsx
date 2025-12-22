import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/properties";
import { Home, Trash2, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { favoritesService } from "@/services/favoritesService";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";

export default function Favorites() {
  const [likedHouses, setLikedHouses] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Load liked houses from API
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favorites = await favoritesService.getFavorites();
        // Extract property data from favorites
        const properties = favorites
          .map((fav: any) => {
            if (fav.property_data && typeof fav.property_data === "object") {
              return fav.property_data;
            }
            // Fallback if property_data is a string
            try {
              return typeof fav.property_data === "string"
                ? JSON.parse(fav.property_data)
                : null;
            } catch {
              return null;
            }
          })
          .filter((p: Property | null) => p !== null);
        setLikedHouses(properties);
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast({
          title: "Error",
          description: "Failed to load favorites",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, navigate]);

  // Listen for changes to liked houses
  useEffect(() => {
    const handleLikedHousesChanged = async () => {
      if (!isAuthenticated) return;
      try {
        const favorites = await favoritesService.getFavorites();
        const properties = favorites
          .map((fav: any) => {
            if (fav.property_data && typeof fav.property_data === "object") {
              return fav.property_data;
            }
            try {
              return typeof fav.property_data === "string"
                ? JSON.parse(fav.property_data)
                : null;
            } catch {
              return null;
            }
          })
          .filter((p: Property | null) => p !== null);
        setLikedHouses(properties);
      } catch (error) {
        console.error("Error refreshing favorites:", error);
      }
    };

    window.addEventListener("likedHousesChanged", handleLikedHousesChanged);
    return () => {
      window.removeEventListener(
        "likedHousesChanged",
        handleLikedHousesChanged
      );
    };
  }, [isAuthenticated]);

  const removeHouse = async (houseId: string) => {
    try {
      await favoritesService.removeFavorite(houseId);
      setLikedHouses(likedHouses.filter((house) => house.id !== houseId));
      window.dispatchEvent(new CustomEvent("likedHousesChanged"));
      toast({
        title: "House removed",
        description: "House removed from your favorites",
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    }
  };

  const clearAll = async () => {
    try {
      for (const house of likedHouses) {
        await favoritesService.removeFavorite(house.id);
      }
      setLikedHouses([]);
      window.dispatchEvent(new CustomEvent("likedHousesChanged"));
      toast({
        title: "All favorites cleared",
        description: "All houses have been removed from your favorites",
      });
    } catch (error) {
      console.error("Error clearing favorites:", error);
      toast({
        title: "Error",
        description: "Failed to clear favorites",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 bg-white">
        <Header variant="minimal" className="border-b" />
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/")}
                  className="mr-2"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Home
                </Button>
                <div className="flex items-center">
                  <Heart className="h-6 w-6 text-red-500 mr-2" />
                  <span className="text-xl font-bold text-gray-900">
                    My Favorites
                  </span>
                </div>
              </div>

              {likedHouses.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorite Houses
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Loading favorites..."
              : likedHouses.length === 0
              ? "You haven't liked any houses yet."
              : `You have ${likedHouses.length} favorite house${
                  likedHouses.length !== 1 ? "s" : ""
                }.`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : likedHouses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Heart size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No favorite houses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start browsing houses and click the heart icon to add them to your
              favorites.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Browse Houses
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedHouses.map((house) => (
              <div
                key={house.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/property/${house.id}`)}
              >
                <div className="flex gap-4">
                  {/* House Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={house.image}
                      alt={house.address}
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* House Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xl font-bold text-blue-600 mb-1">
                          {formatPrice(house.price)}
                        </div>

                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <span>{house.beds} beds</span>
                          <span className="mx-2">•</span>
                          <span>{house.baths} baths</span>
                          <span className="mx-2">•</span>
                          <span>{house.sqft.toLocaleString()} sqft</span>
                        </div>

                        <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {house.address}
                        </h3>
                        <p className="text-gray-600 text-xs">
                          {house.city}, {house.state} {house.zipCode}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHouse(house.id);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-4"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
