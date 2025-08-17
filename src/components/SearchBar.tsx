import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { Property } from '@/data/properties';

interface SearchFilters {
  priceRange: [number, number];
  bedrooms: [number, number];
  bathrooms: [number, number];
  homeType: string[];
}

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  className?: string;
  placeholder?: string;
  showFilters?: boolean;
  initialFilters?: SearchFilters;
  compact?: boolean; // New prop for compact mode
  onFilterClick?: () => void; // Callback for filter icon click in compact mode
  filtersOpen?: boolean; // Whether filters are currently open (for compact mode)
}

export default function SearchBar({
  onSearch,
  className = '',
  placeholder = "Enter an address, city, or ZIP code",
  showFilters = true,
  initialFilters,
  compact = false,
  onFilterClick,
  filtersOpen = false
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {
    priceRange: [200000, 1000000],
    bedrooms: [1, 5],
    bathrooms: [1, 4],
    homeType: ['house', 'condo', 'townhouse', 'apartment']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showFilters) {
      onSearch(searchQuery, filters);
    } else {
      onSearch(searchQuery);
    }
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [200000, 1000000],
      bedrooms: [1, 5],
      bathrooms: [1, 4],
      homeType: ['house', 'condo', 'townhouse', 'apartment']
    });
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}k`;
  };

  return (
    <div className={`${className}`}>
      {/* Main Search Input */}
      <form onSubmit={handleSubmit} className={`flex gap-3 ${compact ? 'mb-2' : 'mb-4'}`}>
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-12 text-xl text-gray-900 border-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 ${compact ? 'h-12' : 'h-16'}`}
          />
        </div>

        {/* Filter Toggle Button */}
        {showFilters && (
          <Button
            type="button"
            variant="outline"
            size={compact ? "default" : "lg"}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={`border-gray-300 hover:bg-gray-50 ${compact ? 'h-12 px-3' : 'h-16 px-4'}`}
          >
            <Filter size={compact ? 20 : 24} className="text-gray-600" />
          </Button>
        )}

        {/* Compact mode filter icon (when showFilters is false) */}
        {!showFilters && compact && (
          <Button
            type="button"
            variant={filtersOpen ? "default" : "outline"}
            size="default"
            className={`h-12 px-3 transition-colors duration-200 ${
              filtersOpen
                ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                : "border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
            }`}
            title={filtersOpen ? "Hide Filters" : "Show Filters"}
            onClick={onFilterClick}
          >
            <Filter size={20} className={filtersOpen ? "text-white" : "text-gray-600"} />
            {filtersOpen && (
              <div className="w-1.5 h-1.5 bg-white rounded-full ml-1 opacity-80"></div>
            )}
          </Button>
        )}

        <Button
          type="submit"
          size={compact ? "default" : "lg"}
          className={`px-10 bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg ${compact ? 'h-12' : 'h-16'}`}
        >
          <Search size={compact ? 20 : 24} className="mr-2" />
          Search
        </Button>
      </form>

      {/* Filters Section */}
      {showFilters && isFiltersOpen && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-900">Filters</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-gray-600 hover:text-gray-900"
              >
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFiltersOpen(false)}
                className="text-gray-600 hover:text-gray-900"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  max={2000000}
                  min={100000}
                  step={25000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">{formatPrice(filters.priceRange[0])}</span>
                  <span className="font-medium text-blue-600">{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <div className="px-2">
                <Slider
                  value={filters.bedrooms}
                  onValueChange={(value) => handleFilterChange('bedrooms', value)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">{filters.bedrooms[0]}+</span>
                  <span className="font-medium text-blue-600">{filters.bedrooms[1]}+</span>
                </div>
              </div>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <div className="px-2">
                <Slider
                  value={filters.bathrooms}
                  onValueChange={(value) => handleFilterChange('bathrooms', value)}
                  max={4}
                  min={1}
                  step={0.5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span className="font-medium text-blue-600">{filters.bathrooms[0]}+</span>
                  <span className="font-medium text-blue-600">{filters.bathrooms[1]}+</span>
                </div>
              </div>
            </div>

            {/* Home Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Type
              </label>
              <div className="space-y-2">
                {[
                  { value: 'house', label: 'House' },
                  { value: 'condo', label: 'Condo' },
                  { value: 'townhouse', label: 'Townhouse' },
                  { value: 'apartment', label: 'Apartment' }
                ].map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={type.value}
                      checked={filters.homeType.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          handleFilterChange('homeType', [...filters.homeType, type.value]);
                        } else {
                          handleFilterChange('homeType', filters.homeType.filter(t => t !== type.value));
                        }
                      }}
                    />
                    <label htmlFor={type.value} className="text-sm text-gray-700">
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
