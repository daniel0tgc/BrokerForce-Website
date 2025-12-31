import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { ArrowRight, Home } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Dynamic background gradient */}
        <div className="absolute inset-0 gradient-bg-alt opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 floating-element rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 floating-element-alt rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 floating-element-blue rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 floating-element rounded-full blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Building the future of real estate
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            We're creating a new standard for home buying and selling through
            AI-powered insights and seamless technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 shadow-cluely-lg hover:shadow-cluely-xl transition-all duration-200"
              >
                Browse Homes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="shadow-cluely hover:shadow-cluely-lg transition-all duration-200"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 bg-gray-50">
        {/* Background floating elements */}
        <div className="absolute top-10 right-20 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 left-20 w-16 h-16 bg-gray-200 rounded-full opacity-25 blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To simplify the real estate experience by combining cutting-edge
              AI technology with human expertise, making home buying and selling
              accessible, transparent, and enjoyable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative py-20">
        {/* Background floating elements */}
        <div className="absolute top-20 left-10 w-28 h-28 bg-blue-100 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-10 blur-lg"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What drives us
            </h2>
            <p className="text-lg text-gray-600">
              The principles that guide our work
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Customer First
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every decision we make starts with our customers' needs and
                happiness.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Innovation
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We constantly push boundaries to create better experiences
                through technology.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We strive for excellence in every interaction and every feature
                we build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gray-50">
        {/* Background floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gray-200 rounded-full opacity-25 blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-15 blur-md"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join us in building the future of real estate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-shadow"
              >
                Browse Homes
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                Get in Touch
              </Button>
            </Link>
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
                <li>
                  <a href="#" className="hover:text-white">
                    Homes for sale
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Open houses
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    New homes
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Rent</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Rental listings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Rental tools
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Apartments
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help/FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-400">
              <p>&copy; 2024 BrokerForce. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/terms" className="hover:text-white">
                  Terms of Service
                </Link>
                <Link to="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
