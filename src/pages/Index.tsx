import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { Home, TrendingUp, MapPin, Users } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 mr-2" />
<<<<<<< HEAD
              <span className="text-2xl font-bold text-gray-900">BrokerForce</span>
=======
              <span className="text-2xl font-bold text-gray-900">PropertyFinder</span>
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Buy</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Rent</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Sell</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Agent finder</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Sign in</Button>
              <Button>Join</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
<<<<<<< HEAD
      <section
=======
      <section 
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
        className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.8), rgba(67, 56, 202, 0.8)), url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Search millions of homes, get local insights, and find the perfect place to call home
            </p>
<<<<<<< HEAD

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <SearchBar
=======
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <SearchBar 
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
                onSearch={handleSearch}
                className="bg-white rounded-lg p-2 shadow-xl"
                placeholder="Enter an address, city, or ZIP code"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1M+</div>
              <div className="text-gray-600">Homes Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Happy Families</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
<<<<<<< HEAD
              Why Choose BrokerForce?
=======
              Why Choose PropertyFinder?
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
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
<<<<<<< HEAD

=======
            
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Market Trends</h3>
              <p className="text-gray-600">
                Stay updated with real-time market data and price trends
              </p>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
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
<<<<<<< HEAD
            Join millions of users who trust BrokerForce to help them find the perfect place
=======
            Join millions of users who trust PropertyFinder to help them find the perfect place
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
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
<<<<<<< HEAD
                <span className="text-xl font-bold">BrokerForce</span>
=======
                <span className="text-xl font-bold">PropertyFinder</span>
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
              </div>
              <p className="text-gray-400">
                Making home buying and selling simple and transparent.
              </p>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
            <div>
              <h3 className="text-lg font-semibold mb-4">Buy</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Homes for sale</a></li>
                <li><a href="#" className="hover:text-white">Open houses</a></li>
                <li><a href="#" className="hover:text-white">New homes</a></li>
              </ul>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
            <div>
              <h3 className="text-lg font-semibold mb-4">Rent</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Rental listings</a></li>
                <li><a href="#" className="hover:text-white">Rental tools</a></li>
                <li><a href="#" className="hover:text-white">Apartments</a></li>
              </ul>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
<<<<<<< HEAD

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BrokerForce. All rights reserved.</p>
=======
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PropertyFinder. All rights reserved.</p>
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
          </div>
        </div>
      </footer>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 66ff85f98f7fbec0367ae82f0d4719ec136469e5
