import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { Property } from "@/data/properties";
import { PropertyService } from "@/services/propertyService";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  FileText,
  Signature,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function RepresentationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    hasAgent: false,
    currentAgentName: "",
    currentAgentCompany: "",
    financingPreApproved: false,
    financingLender: "",
    preApprovalAmount: "",
    downPaymentAmount: "",
    preferredClosingDate: "",
    additionalNotes: "",
    agreeToTerms: false,
    agreeToPrivacy: false,
  });

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

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      toast({
        title: "Agreement Required",
        description:
          "Please agree to the terms and privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would save to backend and integrate with eSignature
      console.log("Representation form submitted:", {
        propertyId: property?.id,
        userId: user?.id,
        formData,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Form Submitted Successfully",
        description:
          "Your representation agreement has been submitted. You will be redirected to the payment page.",
      });

      // Redirect to payment page
      navigate(`/property/${property?.id}/payment`);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading representation form...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="mx-auto text-red-400 mb-4" />
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
                  onClick={() => navigate(`/property/${property.id}`)}
                  className="mr-2"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Property
                </Button>
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">
                    Representation Agreement
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Property Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home size={20} className="mr-2 text-blue-600" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {property.address}
                </h3>
                <p className="text-gray-600">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                <div className="flex items-center mt-2">
                  <MapPin size={16} className="mr-1 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {property.beds} beds • {property.baths} baths •{" "}
                    {property.sqft.toLocaleString()} sqft
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(property.price)}
                </div>
                <p className="text-sm text-gray-600 capitalize">
                  {property.type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Representation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Signature size={20} className="mr-2 text-blue-600" />
              Buyer Representation Agreement
            </CardTitle>
            <p className="text-gray-600">
              Please fill out the following information to proceed with your
              property purchase.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Current Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Enter your current address"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Enter your city"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="Enter your state"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      placeholder="Enter your ZIP code"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Agent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Current Agent Information
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasAgent"
                    checked={formData.hasAgent}
                    onCheckedChange={(checked) =>
                      handleInputChange("hasAgent", checked as boolean)
                    }
                  />
                  <Label htmlFor="hasAgent">
                    I currently have a real estate agent
                  </Label>
                </div>

                {formData.hasAgent && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currentAgentName">
                        Current Agent Name
                      </Label>
                      <Input
                        id="currentAgentName"
                        value={formData.currentAgentName}
                        onChange={(e) =>
                          handleInputChange("currentAgentName", e.target.value)
                        }
                        placeholder="Enter agent name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currentAgentCompany">Agent Company</Label>
                      <Input
                        id="currentAgentCompany"
                        value={formData.currentAgentCompany}
                        onChange={(e) =>
                          handleInputChange(
                            "currentAgentCompany",
                            e.target.value
                          )
                        }
                        placeholder="Enter company name"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Financing Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Financing Information
                </h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financingPreApproved"
                    checked={formData.financingPreApproved}
                    onCheckedChange={(checked) =>
                      handleInputChange(
                        "financingPreApproved",
                        checked as boolean
                      )
                    }
                  />
                  <Label htmlFor="financingPreApproved">
                    I have pre-approval for financing
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="financingLender">Lender Name</Label>
                    <Input
                      id="financingLender"
                      value={formData.financingLender}
                      onChange={(e) =>
                        handleInputChange("financingLender", e.target.value)
                      }
                      placeholder="Enter lender name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preApprovalAmount">
                      Pre-approval Amount
                    </Label>
                    <Input
                      id="preApprovalAmount"
                      type="number"
                      value={formData.preApprovalAmount}
                      onChange={(e) =>
                        handleInputChange("preApprovalAmount", e.target.value)
                      }
                      placeholder="Enter pre-approval amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="downPaymentAmount">
                      Down Payment Amount
                    </Label>
                    <Input
                      id="downPaymentAmount"
                      type="number"
                      value={formData.downPaymentAmount}
                      onChange={(e) =>
                        handleInputChange("downPaymentAmount", e.target.value)
                      }
                      placeholder="Enter down payment amount"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredClosingDate">
                      Preferred Closing Date
                    </Label>
                    <Input
                      id="preferredClosingDate"
                      type="date"
                      value={formData.preferredClosingDate}
                      onChange={(e) =>
                        handleInputChange(
                          "preferredClosingDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Additional Information
                </h3>
                <div>
                  <Label htmlFor="additionalNotes">
                    Additional Notes or Requirements
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) =>
                      handleInputChange("additionalNotes", e.target.value)
                    }
                    placeholder="Any additional information or special requirements..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Terms and Agreements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Terms and Agreements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToTerms", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                      >
                        Terms of Service
                      </a>{" "}
                      and understand that this representation agreement is
                      legally binding.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeToPrivacy", checked as boolean)
                      }
                      className="mt-1"
                    />
                    <Label htmlFor="agreeToPrivacy" className="text-sm">
                      I agree to the{" "}
                      <a
                        href="/privacy"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </a>{" "}
                      and consent to the processing of my personal information.
                    </Label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-lg font-semibold px-8 py-3"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} className="mr-2" />
                      Sign and Continue to Payment
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
