import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/data/properties';
import { Bed, Bath, Square } from 'lucide-react';
import LikeButton from '@/components/LikeButton';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

export default function PropertyCard({ property, onClick }: PropertyCardProps) {
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

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={onClick}>
      <div className="relative">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <Badge className="absolute top-2 left-2 bg-white text-black hover:bg-white">
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </Badge>
        {/* Like Button positioned in top-right corner */}
        <div className="absolute top-2 right-2">
          <LikeButton property={property} size="sm" />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatPrice(property.price)}
          </div>
          <div className="text-gray-600 text-sm">
            {property.address}
          </div>
          <div className="text-gray-600 text-sm">
            {property.city}, {property.state} {property.zipCode}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed size={16} />
            <span>{property.beds} bed{property.beds !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={16} />
            <span>{property.baths} bath{property.baths !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Square size={16} />
            <span>{formatSqft(property.sqft)} sqft</span>
          </div>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">
          {property.description}
        </p>
      </CardContent>
    </Card>
  );
}
