import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '@/data/properties';

export default function CartButton() {
  const [likedCount, setLikedCount] = useState(0);
  const navigate = useNavigate();

  // Get liked houses count from localStorage
  const updateLikedCount = () => {
    const likedHouses = JSON.parse(localStorage.getItem('likedHouses') || '[]');
    setLikedCount(likedHouses.length);
  };

  // Update count on component mount and when liked houses change
  useEffect(() => {
    updateLikedCount();

    // Listen for custom event when liked houses change
    const handleLikedHousesChanged = () => {
      updateLikedCount();
    };

    window.addEventListener('likedHousesChanged', handleLikedHousesChanged);
    return () => {
      window.removeEventListener('likedHousesChanged', handleLikedHousesChanged);
    };
  }, []);

  const handleClick = () => {
    navigate('/favorites');
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex items-center justify-center w-14 h-12 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      aria-label={`${likedCount} liked houses`}
    >
      {/* Custom SVG Heart with circular cutout for number */}
      <svg
        className="w-8 h-8 text-red-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* Heart shape */}
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />

        {/* Circular cutout for number */}
        <circle
          cx="12"
          cy="12"
          r="4"
          fill="white"
        />

        {/* Number text */}
        <text
          x="12"
          y="15"
          textAnchor="middle"
          className="text-xs font-semibold fill-red-500"
          style={{ fontSize: '12px', fontWeight: 'bold' }}
        >
          {likedCount}
        </text>
      </svg>
    </button>
  );
}
