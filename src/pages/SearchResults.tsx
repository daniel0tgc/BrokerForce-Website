import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PropertyCard from '@/components/PropertyCard';
import SwipeCard from '@/components/SwipeCard';
import SearchBar from '@/components/SearchBar';
import { useProperties, usePropertySearch } from '@/hooks/useProperties';
import { PropertySearchParams } from '@/types/simplyrets';
import { PropertyService } from '@/services/propertyService';
import { Home, Filter, Grid, Layers, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [viewMode, setViewMode] = useState<'list' | 'swipe'>('list');
  const [userSelectedView, setUserSelectedView] = useState<'list' | 'swipe' | null>(null);
  const [sortBy, setSortBy] = useState('price-low');
  const [filterType, setFilterType] = useState('all');

  const query = searchParams.get('q') || '';

  // Build search parameters for API
  const searchParamsForAPI: PropertySearchParams = {
    propertyType: filterType !== 'all' ? filterType : undefined,
    limit: 50, // Limit results for better performance
  };

  // Use React Query hooks for data fetching
  const {
    data: properties = [],
    isLoading,
    error
  } = query ? usePropertySearch(query) : useProperties(searchParamsForAPI);

  // Sort properties based on user selection
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'beds':
        return b.beds - a.beds;
      case 'sqft':
        return b.sqft - a.sqft;
      default:
        return 0;
    }
  });

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);

      // Only auto-switch if user hasn't manually selected a view mode
      if (userSelectedView === null) {
        if (newIsMobile && viewMode === 'list') {
          setViewMode('swipe');
        } else if (!newIsMobile && viewMode === 'swipe') {
          setViewMode('list');
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, viewMode, userSelectedView]);

  // Reset swipe index when properties change
  useEffect(() => {
    setCurrentSwipeIndex(0);
  }, [properties]);

  // Test SimplyRETS API on component mount
  useEffect(() => {
    // Test SimplyRETS API connectivity
    PropertyService.testSimplyRETS();
  }, []);

  // Handle view mode selection
  const handleViewModeChange = (mode: 'list' | 'swipe') => {
    setViewMode(mode);
    setUserSelectedView(mode);
  };

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery });
  };

  const handleSwipeLeft = () => {
    toast({
      title: "Property passed",
      description: "Property removed from your list",
    });
    if (currentSwipeIndex < sortedProperties.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else {
      toast({
        title: "No more properties",
        description: "You've viewed all available properties",
      });
    }
  };

  const handleSwipeRight = () => {
    toast({
      title: "Property liked!",
      description: "Property saved to your favorites",
    });
    if (currentSwipeIndex < sortedProperties.length - 1) {
      setCurrentSwipeIndex(currentSwipeIndex + 1);
    } else {
      toast({
        title: "No more properties",
        description: "You've viewed all available properties",
      });
    }
  };

  const currentProperty = sortedProperties[currentSwipeIndex];

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Home size={64} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading properties
          </h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                Back
              </Button>
              <div className="flex items-center">
                <Home className="h-6 w-6 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">BrokerForce</span>
              </div>
            </div>

            {!isMobile && (
              <div className="flex items-center space-x-4">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => handleViewModeChange('list')}
                  size="sm"
                >
                  <Grid size={16} className="mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === 'swipe' ? 'default' : 'outline'}
                  onClick={() => handleViewModeChange('swipe')}
                  size="sm"
                >
                  <Layers size={16} className="mr-2" />
                  Swipe
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by address, city, or ZIP code"
          />
        </div>

        {/* Results Header with Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {sortedProperties.length} homes {query && `in "${query}"`}
            </h1>
            <p className="text-gray-600">
              {viewMode === 'swipe' && isMobile ? 'Swipe to browse properties' : 'Browse available properties'}
            </p>
          </div>

          {viewMode === 'list' && (
            <div className="flex gap-3">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <Filter size={16} className="mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="beds">Most Bedrooms</SelectItem>
                  <SelectItem value="sqft">Largest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Results Display */}
        {sortedProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Home size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse all available properties.
            </p>
          </div>
        ) : viewMode === 'swipe' ? (
          /* Swipe Mode */
          <div className="flex justify-center">
            <div className="w-full max-w-sm">
              {currentProperty ? (
                <div className="relative">
                  <SwipeCard
                    property={currentProperty}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />

                  <div className="mt-4 text-center text-sm text-gray-600">
                    {currentSwipeIndex + 1} of {sortedProperties.length}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${((currentSwipeIndex + 1) / sortedProperties.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No more properties
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You've viewed all available properties.
                  </p>
                  <Button onClick={() => setCurrentSwipeIndex(0)}>
                    Start Over
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* List Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onClick={() => {
                  toast({
                    title: "Property Details",
                    description: `Viewing details for ${property.address}`,
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
