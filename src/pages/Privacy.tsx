import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { ArrowRight, Home } from "lucide-react";

export default function Privacy() {
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
            Privacy Policy
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
                1. Introduction
              </h2>
              <p className="text-gray-700 mb-4">
                BrokerForce ("we," "our," or "us") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our
                website or use our real estate services.
              </p>
              <p className="text-gray-700 mb-4">
                By using our service, you consent to the data practices
                described in this policy.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                2. Information We Collect
              </h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <p className="text-gray-700 mb-4">
                We may collect personal information that you voluntarily provide
                to us, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>
                  Name and contact information (email, phone number, address)
                </li>
                <li>Account credentials and profile information</li>
                <li>Real estate preferences and search criteria</li>
                <li>Communication preferences and feedback</li>
                <li>
                  Financial information for transactions (processed securely)
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Automatically Collected Information
              </h3>
              <p className="text-gray-700 mb-4">
                When you visit our website, we automatically collect certain
                information, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>
                  Device information (IP address, browser type, operating
                  system)
                </li>
                <li>Usage data (pages visited, time spent, search queries)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your consent)</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for various purposes,
                including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Providing and improving our real estate services</li>
                <li>Personalizing your experience and recommendations</li>
                <li>Processing transactions and payments</li>
                <li>Communicating with you about services and updates</li>
                <li>Analyzing usage patterns to enhance our platform</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                4. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>
                  <strong>Service Providers:</strong> We may share information
                  with trusted third-party service providers who assist us in
                  operating our website and providing services
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose
                  information when required by law or to protect our rights and
                  safety
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger,
                  acquisition, or sale of assets, your information may be
                  transferred
                </li>
                <li>
                  <strong>Consent:</strong> We may share information with your
                  explicit consent
                </li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                5. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. These measures
                include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection practices</li>
              </ul>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your
                browsing experience, analyze website traffic, and understand
                where our visitors are coming from.
              </p>
              <p className="text-gray-700 mb-4">
                You can control cookie settings through your browser
                preferences. However, disabling cookies may affect the
                functionality of our website.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                7. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                You have certain rights regarding your personal information,
                including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>
                  <strong>Access:</strong> Request access to your personal
                  information
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information
                </li>
                <li>
                  <strong>Portability:</strong> Request a copy of your data in a
                  portable format
                </li>
                <li>
                  <strong>Opt-out:</strong> Opt out of marketing communications
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us using the
                information provided below.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                8. Children's Privacy
              </h2>
              <p className="text-gray-700 mb-4">
                Our service is not intended for children under the age of 13. We
                do not knowingly collect personal information from children
                under 13. If you believe we have collected information from a
                child under 13, please contact us immediately.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                9. Third-Party Links
              </h2>
              <p className="text-gray-700 mb-4">
                Our website may contain links to third-party websites. We are
                not responsible for the privacy practices or content of these
                external sites. We encourage you to review the privacy policies
                of any third-party sites you visit.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                10. International Data Transfers
              </h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in
                countries other than your own. We ensure that such transfers
                comply with applicable data protection laws and implement
                appropriate safeguards.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                11. Changes to This Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date.
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                12. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> privacy@brokerforce.ai
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
