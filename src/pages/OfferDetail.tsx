import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { offerService, Offer } from "@/services/offerService";
import { PropertyService } from "@/services/propertyService";
import { Property } from "@/data/properties";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Calendar,
  FileText,
  Home,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import Header from "@/components/Header";

export default function OfferDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadOffer = async () => {
      if (!id || !isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);

        // Load offer
        const offerData = await offerService.getOfferById(id);
        setOffer(offerData);

        // Load property if we have property_id
        if (offerData.property_id) {
          try {
            const propertyData = await PropertyService.getPropertyById(
              offerData.property_id
            );
            setProperty(propertyData);
          } catch (err) {
            console.error("Error loading property:", err);
            // Property not found is not critical
          }
        }
      } catch (err) {
        console.error("Error loading offer:", err);
        setError("Failed to load offer details");
        toast({
          title: "Error",
          description: "Failed to load offer details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && id) {
      loadOffer();
    }
  }, [id, isAuthenticated]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Offer["status"]) => {
    const statusConfig = {
      submitted: {
        label: "Submitted",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      accepted: {
        label: "Accepted",
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      },
      withdrawn: {
        label: "Withdrawn",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: XCircle,
      },
      draft: {
        label: "Draft",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: FileText,
      },
    };

    const config = statusConfig[status] || statusConfig.submitted;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading offer details...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600 mb-4">{error || "Offer not found"}</p>
              <Button onClick={() => navigate("/dashboard/offers")}>
                Back to Offers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="sticky top-0 z-50 bg-white">
        <Header variant="minimal" className="border-b" />
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard/offers")}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Offers
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">
                Offer Details
              </h1>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Offer Status
                </h2>
                <p className="text-gray-600">
                  Current status of your offer submission
                </p>
              </div>
              {getStatusBadge(offer.status)}
            </div>
          </CardContent>
        </Card>

        {/* Property Information */}
        {property && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Property Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.address}
                </h3>
                <p className="text-gray-600">
                  {property.city}, {property.state} {property.zipCode}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  List Price: {formatPrice(property.price)}
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate(`/property/${property.id}`)}
              >
                View Property Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Offer Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Offer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-gray-500">Offer Amount</Label>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {formatPrice(offer.offer_amount)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Financing Type</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">
                  {offer.financing_type
                    ? offer.financing_type.replace("_", " ")
                    : "Not specified"}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Submitted Date</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(offer.created_at)}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Last Updated</Label>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(offer.updated_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agent Response */}
        {offer.agent_response && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                Agent Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {offer.agent_response}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        {offer.status === "submitted" && !offer.agent_response && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>What's Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">
                  Your offer has been submitted and is being reviewed by the
                  listing agent.
                </p>
                <p className="text-gray-700">
                  You will receive an update once the agent responds. This
                  typically takes 24-48 hours.
                </p>
                <p className="text-gray-700">
                  Check back here or your dashboard for status updates.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate("/dashboard/offers")}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Offers
          </Button>
          {property && (
            <Button
              onClick={() => navigate(`/property/${property.id}`)}
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              View Property
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
