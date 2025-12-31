import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  ArrowRight,
  Home,
} from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Dynamic background gradient */}
        <div className="absolute inset-0 gradient-bg-blue opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 floating-element rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 floating-element-alt rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 floating-element-blue rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 floating-element rounded-full blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Get in touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            We're here to help you find your dream home. Reach out to our team
            anytime.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="relative py-20 bg-gray-50">
        {/* Background floating elements */}
        <div className="absolute top-10 right-20 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 left-20 w-16 h-16 bg-gray-200 rounded-full opacity-25 blur-lg"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Call Us
              </h3>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                1-800-BROKER
              </p>
              <p className="text-gray-600 leading-relaxed">
                Mon-Fri: 9AM-6PM PST
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Email Us
              </h3>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                support@brokerforce.ai
              </p>
              <p className="text-gray-600 leading-relaxed">
                We'll respond within 24 hours
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Visit Us
              </h3>
              <p className="text-lg font-semibold text-gray-900 mb-2">
                Newport Beach
              </p>
              <p className="text-gray-600 leading-relaxed">
                260 Newport Center Drive, CA 92660
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a message
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have a question or need assistance? Fill out the form below and
                we'll get back to you as soon as possible.
              </p>
              {isSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-700">
                    Thank you for reaching out. We'll get back to you very soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Office Location */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Visit our office
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stop by our office to meet our team in person.
              </p>
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-start mb-6">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Newport Beach
                    </h3>
                    <p className="text-gray-600 mb-1">
                      260 Newport Center Drive
                    </p>
                    <p className="text-gray-600 mb-4">
                      Newport Beach, CA 92660
                    </p>
                    <p className="text-sm text-gray-500">
                      Mon-Fri: 9AM-6PM PST
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Getting here</h4>
                  <p className="text-gray-600 text-sm">
                    Located in the heart of Newport Beach, our office is easily
                    accessible by car or public transportation. Free parking is
                    available on-site.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        {/* Background floating elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-gray-200 rounded-full opacity-25 blur-lg"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-200 rounded-full opacity-15 blur-md"></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to find your dream home?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team is here to help you every step of the way
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
            <Button
              size="lg"
              variant="outline"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              Schedule a Call
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
