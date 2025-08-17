import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import LikeButton from '@/components/LikeButton';
import CartButton from '@/components/CartButton';
import { Home, TrendingUp, MapPin, Users } from 'lucide-react';
import { Property } from '@/data/properties';
import { PropertyService } from '@/services/propertyService';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('random');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(true);
  const [propertiesError, setPropertiesError] = useState<string | null>(null);

  // Calculate responsive slide width and total slides
  const [slideWidth, setSlideWidth] = useState(320); // Default for mobile
  const [totalSlides, setTotalSlides] = useState(0);

    const handleSearch = (query: string) => {
    // Navigate to search results with just the query
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSortChange = (sortType: string) => {
    setCurrentSort(sortType);
    setIsSortDropdownOpen(false);
    // For now, only random is implemented
    if (sortType === 'random') {
      // Shuffle the properties randomly
      const shuffled = [...featuredProperties].sort(() => Math.random() - 0.5);
      setFeaturedProperties(shuffled);
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : totalSlides - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide(prev => prev < totalSlides - 1 ? prev + 1 : 0);
  };

  // Fetch featured properties on component mount
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      setIsLoadingProperties(true);
      setPropertiesError(null);

      try {
        // Get properties from your SimplyRETS API
        const properties = await PropertyService.getProperties({ limit: 12 });
        setFeaturedProperties(properties);
      } catch (error) {
        console.error('Error fetching featured properties:', error);
        // Fallback to dummy properties if API fails
        try {
          const dummyProperties = await PropertyService.searchProperties('Houston');
          setFeaturedProperties(dummyProperties.slice(0, 12));
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
          setPropertiesError('Unable to load featured properties');
          setFeaturedProperties([]);
        }
      } finally {
        setIsLoadingProperties(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  // Update slide width and total slides based on screen size
  useEffect(() => {
    const updateSlideWidth = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setSlideWidth(width * 0.8); // 80% of screen width
        setTotalSlides(Math.ceil(featuredProperties.length / 1));
      } else if (width < 1024) { // Tablet
        setSlideWidth(280);
        setTotalSlides(Math.ceil(featuredProperties.length / 2));
      } else { // Desktop
        setSlideWidth(320);
        setTotalSlides(Math.ceil(featuredProperties.length / 3));
      }
    };

    updateSlideWidth();
    window.addEventListener('resize', updateSlideWidth);
    return () => window.removeEventListener('resize', updateSlideWidth);
  }, [featuredProperties.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSortDropdownOpen && !(event.target as Element).closest('.sort-dropdown')) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortDropdownOpen]);



  return (
    <div className="min-h-screen">
      {/* Large Banner Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
                         <div className="flex items-center">
               <Home className="h-10 w-10 text-blue-600 mr-3" />
               <span className="text-4xl font-bold text-gray-900">brokerforce.ai</span>
             </div>
            <div className="flex items-center space-x-4">
              <CartButton />
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600 text-lg font-medium">
                Sign in
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg font-medium px-8 py-3">
                Join
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search Bar */}
      <section
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.9), rgba(67, 56, 202, 0.9)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-12">
              Find Your Dream Home
            </h1>

            {/* Prominent Search Bar */}
            <div className="max-w-5xl mx-auto">
              <SearchBar
                onSearch={handleSearch}
                className="bg-white rounded-xl p-3 shadow-2xl"
                placeholder="Enter an address, city, or ZIP code"
                showFilters={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Homes Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Featured Homes
            </h2>

            {/* Sorting Dropdown */}
            <div className="relative sort-dropdown">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="text-sm text-gray-700">Sorted by:</span>
                <span className="text-sm font-medium text-gray-900">{currentSort}</span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isSortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleSortChange('curated')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Curated
                    </button>
                    <button
                      onClick={() => handleSortChange('promoted')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Promoted
                    </button>
                    <button
                      onClick={() => handleSortChange('random')}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Random
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Featured Homes Carousel */}
          <div className="relative">
            {/* Loading State */}
            {isLoadingProperties && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading featured homes...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {propertiesError && !isLoadingProperties && (
              <div className="text-center py-16">
                <div className="text-red-500 mb-4">
                  <Home size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Unable to load featured homes
                </h3>
                <p className="text-gray-600 mb-4">{propertiesError}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Carousel Content */}
            {!isLoadingProperties && !propertiesError && featuredProperties.length > 0 && (
              <>
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Carousel Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * slideWidth}px)` }}
                  >
                    {featuredProperties.map((property) => (
                                              <div
                          key={property.id}
                          className="flex-shrink-0 px-2"
                          style={{ width: slideWidth }}
                        >
                          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative">
                              <img
                                src={property.image}
                                alt={property.address}
                                className="w-full h-48 object-cover"
                              />
                              {/* Like Button positioned in top-right corner */}
                              <div className="absolute top-3 right-3">
                                <LikeButton property={property} size="md" />
                              </div>
                            </div>
                            <div className="p-4">
                              {/* Price - Bold and on its own line */}
                              <div className="text-xl font-bold text-blue-600 mb-2">
                                ${property.price.toLocaleString()}
                              </div>

                              {/* Beds, Baths, Sqft - on one line */}
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <span>{property.beds} beds</span>
                                <span className="mx-2">•</span>
                                <span>{property.baths} baths</span>
                                <span className="mx-2">•</span>
                                <span>{property.sqft.toLocaleString()} sqft</span>
                              </div>

                              {/* Address - below the stats */}
                              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                                {property.address}
                              </h3>
                              <p className="text-gray-600 text-xs mt-1">
                                {property.city}, {property.state} {property.zipCode}
                              </p>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Dots */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* No Properties State */}
            {!isLoadingProperties && !propertiesError && featuredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Home size={64} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No featured homes available
                </h3>
                <p className="text-gray-600">
                  Check back later for new listings.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BrokerForce?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make finding your perfect home simple, fast, and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local Insights</h3>
              <p className="text-gray-600">
                Get detailed neighborhood information, school ratings, and local amenities
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Trends</h3>
              <p className="text-gray-600">
                Stay updated with real-time market data and price trends
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Connect with local real estate experts who know the market
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join millions of users who trust BrokerForce to help them find the perfect place
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-100">
              Browse Homes
            </Button>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="h-8 w-8 text-blue-400 mr-2" />
                <span className="text-xl font-bold">BrokerForce</span>
              </div>
              <p className="text-gray-400">
                Making home buying and selling simple and transparent.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Buy</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Homes for sale</a></li>
                <li><a href="#" className="hover:text-white">Open houses</a></li>
                <li><a href="#" className="hover:text-white">New homes</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Rent</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Rental listings</a></li>
                <li><a href="#" className="hover:text-white">Rental tools</a></li>
                <li><a href="#" className="hover:text-white">Apartments</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BrokerForce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
