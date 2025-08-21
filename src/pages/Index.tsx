import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import LikeButton from '@/components/LikeButton';
import CartButton from '@/components/CartButton';
import SignInButton from '@/components/SignInButton';
import { Home, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900">brokerforce.ai</span>
            </Link>
            <div className="flex items-center space-x-4">
              <CartButton />
              <SignInButton />
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Dynamic background gradient */}
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 floating-element rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 floating-element-alt rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 floating-element-blue rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 floating-element rounded-full blur-lg"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Find your dream home
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            We make finding your perfect home simple, fast, and enjoyable with AI-powered insights and seamless technology.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar
              onSearch={handleSearch}
              className="bg-white border border-gray-200 rounded-xl shadow-cluely-lg"
              placeholder="Enter an address, city, or ZIP code"
              showFilters={false}
            />
          </div>
        </div>
      </section>

      {/* Featured Homes Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              Featured homes
            </h2>

            {/* Sorting Dropdown */}
            <div className="relative sort-dropdown">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-cluely-xl z-10">
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
                          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-cluely hover:shadow-cluely-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                                        <button
                          onClick={handleNextSlide}
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-cluely hover:shadow-cluely-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
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

          {/* Features Section - Cluely style */}
          <section className="relative py-20 bg-gray-50 overflow-hidden">
            {/* Background floating elements */}
            <div className="absolute top-10 right-20 w-20 h-20 floating-element rounded-full blur-lg"></div>
            <div className="absolute bottom-10 left-20 w-16 h-16 floating-element-alt rounded-full blur-lg"></div>
            
            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">AI-powered insights</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Our advanced AI analyzes market trends, property values, and neighborhood data to help you make informed decisions about your next home.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Seamless experience</h2>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    From search to closing, we streamline every step of the home buying process with intuitive tools and expert support.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
      <section className="relative py-20 bg-gray-50 overflow-hidden">
        {/* Background floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 floating-element rounded-full blur-lg"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 floating-element-alt rounded-full blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 floating-element-blue rounded-full blur-md"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Ready to find your dream home?
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join us in building the future of real estate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-cluely-lg hover:shadow-cluely-xl transition-all duration-200">
                Browse Homes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-lg font-bold">BrokerForce</span>
              </div>
              <p className="text-gray-400">
                Building the future of real estate.
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
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white">Help/FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
              <p>&copy; 2024 BrokerForce. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
