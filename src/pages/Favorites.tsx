import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Property } from '@/data/properties';
import { Home, Trash2, ArrowLeft, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function Favorites() {
  const [likedHouses, setLikedHouses] = useState<Property[]>([]);
  const navigate = useNavigate();

  // Load liked houses from localStorage
  useEffect(() => {
    const houses = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setLikedHouses(houses);
  }, []);

  // Listen for changes to liked houses
  useEffect(() => {
    const handleLikedHousesChanged = () => {
      const houses = JSON.parse(localStorage.getItem('likedHouses') || '[]');
      setLikedHouses(houses);
    };

    window.addEventListener('likedHousesChanged', handleLikedHousesChanged);
    return () => {
      window.removeEventListener('likedHousesChanged', handleLikedHousesChanged);
    };
  }, []);

  const removeHouse = (houseId: string) => {
    const updatedHouses = likedHouses.filter(house => house.id !== houseId);
    localStorage.setItem('likedHouses', JSON.stringify(updatedHouses));
    setLikedHouses(updatedHouses);

    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('likedHousesChanged'));

    toast({
      title: "House removed",
      description: "House removed from your favorites",
    });
  };

  const clearAll = () => {
    localStorage.removeItem('likedHouses');
    setLikedHouses([]);

    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('likedHousesChanged'));

    toast({
      title: "All favorites cleared",
      description: "All houses have been removed from your favorites",
    });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${(price / 1000).toFixed(0)}k`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-2"
              >
                <ArrowLeft size={20} className="mr-2" />
                Back to Home
              </Button>
              <div className="flex items-center">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-xl font-bold text-gray-900">My Favorites</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorite Houses
          </h1>
          <p className="text-gray-600">
            {likedHouses.length === 0
              ? "You haven't liked any houses yet."
              : `You have ${likedHouses.length} favorite house${likedHouses.length !== 1 ? 's' : ''}.`
            }
          </p>
        </div>

        {/* Favorites List */}
        {likedHouses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Heart size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No favorite houses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start browsing houses and click the heart icon to add them to your favorites.
            </p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Browse Houses
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {likedHouses.map((house) => (
              <div
                key={house.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
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
                        onClick={() => removeHouse(house.id)}
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
