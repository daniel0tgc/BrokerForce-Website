import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { ArrowRight, Home } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 bg-gray-50">
        {/* Background floating elements */}
        <div className="absolute top-10 right-20 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 left-20 w-16 h-16 bg-gray-200 rounded-full opacity-25 blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">Last updated: December 2024</p>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-16">
        {/* Background floating elements */}
        <div className="absolute top-20 left-10 w-28 h-28 bg-blue-100 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-blue-200 rounded-full opacity-10 blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 mb-4">
                By accessing and using BrokerForce ("we," "our," or "us"), you
                accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do
                not use this service.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                2. Description of Service
              </h2>
              <p className="text-gray-700 mb-4">
                BrokerForce provides an online platform for real estate
                services, including but not limited to property listings, search
                tools, and real estate transaction services. Our services are
                designed to facilitate the buying, selling, and renting of real
                estate properties.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                3. User Accounts
              </h2>
              <p className="text-gray-700 mb-4">
                To access certain features of our service, you may be required
                to create an account. You are responsible for maintaining the
                confidentiality of your account information and for all
                activities that occur under your account.
              </p>
              <p className="text-gray-700 mb-4">
                You agree to provide accurate, current, and complete information
                during the registration process and to update such information
                to keep it accurate, current, and complete.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                4. Acceptable Use
              </h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the service to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the service</li>
                <li>
                  Use the service for any commercial purpose without our express
                  written consent
                </li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                5. Real Estate Services
              </h2>
              <p className="text-gray-700 mb-4">
                BrokerForce provides real estate services through licensed
                professionals. We do not guarantee the accuracy of property
                information, and all property details should be verified
                independently.
              </p>
              <p className="text-gray-700 mb-4">
                Our commission structure and fees are clearly disclosed before
                any transaction. You agree to pay all applicable fees for
                services rendered.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                6. Privacy and Data
              </h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the service, to
                understand our practices regarding the collection and use of
                your information.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                7. Intellectual Property
              </h2>
              <p className="text-gray-700 mb-4">
                The service and its original content, features, and
                functionality are and will remain the exclusive property of
                BrokerForce and its licensors. The service is protected by
                copyright, trademark, and other laws.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                8. Disclaimers
              </h2>
              <p className="text-gray-700 mb-4">
                The service is provided on an "as is" and "as available" basis.
                BrokerForce makes no warranties, expressed or implied, and
                hereby disclaims all warranties, including without limitation,
                implied warranties of merchantability and fitness for a
                particular purpose.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                9. Limitation of Liability
              </h2>
              <p className="text-gray-700 mb-4">
                In no event shall BrokerForce, nor its directors, employees,
                partners, agents, suppliers, or affiliates, be liable for any
                indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data,
                use, goodwill, or other intangible losses.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                10. Termination
              </h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the
                service immediately, without prior notice or liability, under
                our sole discretion, for any reason whatsoever and without
                limitation, including but not limited to a breach of the Terms.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                11. Changes to Terms
              </h2>
              <p className="text-gray-700 mb-4">
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will provide at least 30 days notice prior to any new terms
                taking effect.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                12. Governing Law
              </h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be interpreted and governed by the laws of the
                State of California, without regard to its conflict of law
                provisions.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                13. Contact Information
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> legal@brokerforce.ai
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Address:</strong> 260 Newport Center Drive, Newport
                  Beach, CA 92660
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> 1-800-BROKER
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gray-50">
        {/* Background floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gray-200 rounded-full opacity-25 blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-15 blur-md"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
                Contact Us
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

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BrokerForce. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
