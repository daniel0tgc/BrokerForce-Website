import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ArrowRight,
  Home,
} from "lucide-react";
import { useState } from "react";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      icon: "🚀",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "Click the 'Get Started' button in the top right corner of any page. You'll be guided through a simple registration process.",
        },
        {
          question: "How do I start searching for homes?",
          answer:
            "Use the search bar on our homepage to enter your desired location, budget, and preferences. You can also browse featured listings.",
        },
        {
          question: "What information do I need to provide?",
          answer:
            "We'll need basic contact information, your home buying preferences, and any specific requirements you have.",
        },
      ],
    },
    {
      title: "Buying Process",
      icon: "🏠",
      questions: [
        {
          question: "How does the buying process work?",
          answer:
            "Our process is simple: search for homes, schedule viewings, make an offer, and we'll guide you through closing.",
        },
        {
          question: "What are your service fees?",
          answer:
            "We offer transparent pricing with no hidden fees. Our standard commission is 2.5% of the sale price.",
        },
        {
          question: "How long does the buying process take?",
          answer:
            "The typical home buying process takes 30-45 days from offer to closing, depending on various factors.",
        },
      ],
    },
    {
      title: "Selling Process",
      icon: "📈",
      questions: [
        {
          question: "How do I list my home for sale?",
          answer:
            "Contact us to schedule a consultation. We'll assess your home, discuss pricing strategy, and create a marketing plan.",
        },
        {
          question: "How quickly can you sell my home?",
          answer:
            "We work efficiently to get your home sold quickly. The timeline depends on market conditions and your home's features.",
        },
        {
          question: "What services do you provide for sellers?",
          answer:
            "We provide professional photography, marketing materials, open house coordination, and negotiation support.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Dynamic background gradient */}
        <div className="absolute inset-0 gradient-bg-purple opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 floating-element rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 floating-element-alt rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 floating-element-blue rounded-full blur-lg"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 floating-element rounded-full blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Find answers to your questions and get the support you need
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border border-gray-200 rounded-xl shadow-cluely-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="relative py-20 bg-gray-50">
        {/* Background floating elements */}
        <div className="absolute top-10 right-20 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-lg"></div>
        <div className="absolute bottom-10 left-20 w-16 h-16 bg-gray-200 rounded-full opacity-25 blur-lg"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchQuery ? (
            <div className="mb-16">
              {filteredCategories.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredCategories.map((category, categoryIndex) => (
                    <div key={categoryIndex}>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">{category.icon}</span>
                        {category.title}
                      </h4>
                      {category.questions.map((item, questionIndex) => (
                        <AccordionItem
                          key={questionIndex}
                          value={`${categoryIndex}-${questionIndex}`}
                          className="bg-white rounded-lg border border-gray-200 mb-2"
                        >
                          <AccordionTrigger className="px-6 py-4 text-left">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <p className="text-gray-600">{item.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </div>
                  ))}
                </Accordion>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try searching with different keywords or browse our
                    categories below.
                  </p>
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    Clear Search
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-12">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="flex items-center mb-6">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.title}
                    </h3>
                  </div>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((item, questionIndex) => (
                      <AccordionItem
                        key={questionIndex}
                        value={`${categoryIndex}-${questionIndex}`}
                        className="bg-white rounded-lg border border-gray-200"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <p className="text-gray-600">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still need help?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our support team is here to help you with any questions or
              concerns
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Live Chat
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Get instant help from our support team
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
                Start Chat
              </Button>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Email Support
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Send us a detailed message
              </p>
              <Link to="/contact">
                <Button className="w-full bg-green-600 hover:bg-green-700 shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
                  Send Email
                </Button>
              </Link>
            </div>
            <div className="text-center bg-white p-8 rounded-xl shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
              <h3 className="text-xl font-semibold mb-4 tracking-tight">
                Phone Support
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Call us directly for immediate assistance
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 shadow-cluely hover:shadow-cluely-lg transition-all duration-200">
                Call Now
              </Button>
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
