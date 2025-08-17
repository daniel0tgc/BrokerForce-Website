import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Property } from '@/data/properties';
import { Bed, Bath, Square, Heart, X, ChevronLeft, ChevronRight } from 'lucide-react';
import LikeButton from '@/components/LikeButton';

interface SwipeCardProps {
  property: Property;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export default function SwipeCard({ property, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSqft = (sqft: number) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <Card className="w-full max-w-sm mx-auto h-[600px] flex flex-col shadow-xl">
      <div className="relative flex-1">
        <img
          src={property.images[currentImageIndex]}
          alt={property.address}
          className="w-full h-full object-cover rounded-t-lg"
        />

        {/* Image navigation */}
        {property.images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              onClick={prevImage}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
              onClick={nextImage}
            >
              <ChevronRight size={16} />
            </Button>

            {/* Image dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <Badge className="absolute top-2 left-2 bg-white text-black hover:bg-white">
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </Badge>
        {/* Like Button positioned in top-right corner */}
        <div className="absolute top-2 right-2">
          <LikeButton property={property} size="sm" />
        </div>
      </div>

      <CardContent className="p-4 flex-shrink-0">
        <div className="mb-3">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatPrice(property.price)}
          </div>
          <div className="text-gray-800 font-medium">
            {property.address}
          </div>
          <div className="text-gray-600 text-sm">
            {property.city}, {property.state} {property.zipCode}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{property.beds}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{property.baths}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={16} />
            <span>{formatSqft(property.sqft)}</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Swipe buttons */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
            onClick={onSwipeLeft}
          >
            <X size={20} className="mr-2" />
            Pass
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => {
              // Add to favorites and then swipe right
              const likedHouses = JSON.parse(localStorage.getItem('likedHouses') || '[]');
              const isAlreadyLiked = likedHouses.some((house: Property) => house.id === property.id);
              if (!isAlreadyLiked) {
                const updatedLikedHouses = [...likedHouses, property];
                localStorage.setItem('likedHouses', JSON.stringify(updatedLikedHouses));
                // Dispatch custom event to update cart count
                window.dispatchEvent(new CustomEvent('likedHousesChanged'));
              }
              onSwipeRight();
            }}
          >
            <Heart size={20} className="mr-2" />
            Like
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
