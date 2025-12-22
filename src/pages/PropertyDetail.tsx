import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Home,
  Car,
  TreePine,
  Wifi,
  Shield,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Send,
  LogIn,
  User,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LikeButton from "@/components/LikeButton";
import Header from "@/components/Header";

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, login, isLoading: authLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError("Property ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to get property from service
        const propertyData = await PropertyService.getPropertyById(id);

        if (propertyData) {
          setProperty(propertyData);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  // Check if property is liked
  useEffect(() => {
    if (property) {
      const likedHouses = JSON.parse(
        localStorage.getItem("likedHouses") || "[]"
      );
      setIsLiked(
        likedHouses.some((house: Property) => house.id === property.id)
      );
    }
  }, [property]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSqft = (sqft: number) => {
    return new Intl.NumberFormat("en-US").format(sqft);
  };

  const handleShare = async () => {
    if (navigator.share && property) {
      try {
        await navigator.share({
          title: `${property.address} - ${formatPrice(property.price)}`,
          text: `Check out this property: ${property.address}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Property link has been copied to clipboard",
        });
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Property link has been copied to clipboard",
      });
    }
  };

  const handleBuyNow = () => {
    if (!property) return;

    if (!isAuthenticated) {
      // Show login prompt for unauthenticated users
      toast({
        title: "Sign In Required",
        description: "Please sign in to proceed with purchasing this property.",
        variant: "destructive",
      });

      // Show login dialog or redirect to login
      login();
      return;
    }

    // User is authenticated, proceed to representation form
    navigate(`/property/${property.id}/representation`);
  };

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.comment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would send the form data to a backend service
      console.log("Contact form submitted:", {
        propertyId: property?.id,
        propertyAddress: property?.address,
        ...contactForm,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Message Sent",
        description:
          "Thank you for your interest! Our agent will contact you within 24 hours.",
      });

      // Reset form
      setContactForm({
        name: "",
        email: "",
        comment: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 1) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The property you are looking for does not exist."}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 bg-white">
        <Header variant="minimal" className="border-b" />
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mr-2"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back
                </Button>
                <div className="flex items-center">
                  <Home className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">
                    Property Details
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <LikeButton property={property} size="md" />
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Property Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.address}
              </h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-1" />
                <span>
                  {property.city}, {property.state} {property.zipCode}
                </span>
              </div>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600 mb-1">
                {formatPrice(property.price)}
              </div>
              <div className="text-sm text-gray-600">
                Built in {property.yearBuilt}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.address}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />

                  {/* Image Navigation */}
                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {property.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white bg-opacity-50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Property Details
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed size={24} className="mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.beds}
                    </div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath size={24} className="mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.baths}
                    </div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square size={24} className="mx-auto text-blue-600 mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {formatSqft(property.sqft)}
                    </div>
                    <div className="text-sm text-gray-600">Square Feet</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Calendar
                      size={24}
                      className="mx-auto text-blue-600 mb-2"
                    />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.yearBuilt}
                    </div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Features & Amenities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-700"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <Card>
              <CardContent className="p-6 space-y-3">
                {authLoading ? (
                  <Button
                    disabled
                    className="w-full bg-gray-400 text-lg font-semibold py-3"
                    size="lg"
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleBuyNow}
                      className="w-full bg-green-600 hover:bg-green-700 text-lg font-semibold py-3"
                      size="lg"
                    >
                      {isAuthenticated ? (
                        <>
                          <User size={20} className="mr-2" />
                          Buy Now
                        </>
                      ) : (
                        <>
                          <LogIn size={20} className="mr-2" />
                          Sign In to Buy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Sell Now",
                          description:
                            "Sell functionality coming soon. Contact us to list your property.",
                        });
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold py-3"
                      size="lg"
                      variant="default"
                    >
                      <Home size={20} className="mr-2" />
                      Sell Now
                    </Button>
                    <Button
                      onClick={() => {
                        toast({
                          title: "Swap Now",
                          description:
                            "Property swap functionality coming soon.",
                        });
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-lg font-semibold py-3"
                      size="lg"
                      variant="default"
                    >
                      <Home size={20} className="mr-2" />
                      Swap Now
                    </Button>
                  </>
                )}

                {isAuthenticated && user && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Signed in as {user.name}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Property Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Property Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(property.price)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold text-gray-900 capitalize">
                      {property.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bedrooms</span>
                    <span className="font-semibold text-gray-900">
                      {property.beds}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bathrooms</span>
                    <span className="font-semibold text-gray-900">
                      {property.baths}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Feet</span>
                    <span className="font-semibold text-gray-900">
                      {formatSqft(property.sqft)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Year Built</span>
                    <span className="font-semibold text-gray-900">
                      {property.yearBuilt}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Phone size={16} className="mr-3 text-blue-600" />
                    <span className="text-sm">(555) 123-4567</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Mail size={16} className="mr-3 text-blue-600" />
                    <span className="text-sm">agent@brokerforce.ai</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <MapPin size={16} className="mr-3 text-blue-600" />
                    <span className="text-sm">BrokerForce Real Estate</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Send Message
                </h3>

                <form onSubmit={handleContactFormSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) =>
                        handleContactFormChange("name", e.target.value)
                      }
                      placeholder="Your full name"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        handleContactFormChange("email", e.target.value)
                      }
                      placeholder="your.email@example.com"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="comment"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="comment"
                      value={contactForm.comment}
                      onChange={(e) =>
                        handleContactFormChange("comment", e.target.value)
                      }
                      placeholder="Tell us about your interest in this property..."
                      className="mt-1 min-h-[100px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
