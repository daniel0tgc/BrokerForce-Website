import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Property } from '@/data/properties';

interface LikeButtonProps {
  property: Property;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LikeButton({ property, size = 'md', className = '' }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);

  // Get size classes
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  // Check if property is liked on component mount
  useEffect(() => {
    const likedHouses = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setIsLiked(likedHouses.some((house: Property) => house.id === property.id));
  }, [property.id]);

  const toggleLike = () => {
    const likedHouses = JSON.parse(localStorage.getItem('likedHouses') || '[]');

    if (isLiked) {
      // Remove from liked houses
      const updatedLikedHouses = likedHouses.filter((house: Property) => house.id !== property.id);
      localStorage.setItem('likedHouses', JSON.stringify(updatedLikedHouses));
      setIsLiked(false);
    } else {
      // Add to liked houses (with duplicate prevention)
      const isAlreadyLiked = likedHouses.some((house: Property) => house.id === property.id);
      if (!isAlreadyLiked) {
        const updatedLikedHouses = [...likedHouses, property];
        localStorage.setItem('likedHouses', JSON.stringify(updatedLikedHouses));
        setIsLiked(true);
      }
    }

    // Dispatch custom event to update cart count
    window.dispatchEvent(new CustomEvent('likedHousesChanged'));
  };

  return (
    <button
      onClick={toggleLike}
      className={`${className} transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full`}
      aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`${sizeClasses[size]} ${
          isLiked
            ? 'fill-red-500 text-red-500'
            : 'text-gray-400 hover:text-red-400'
        } transition-colors duration-200`}
      />
    </button>
  );
}
