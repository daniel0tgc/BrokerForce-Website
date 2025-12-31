import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { dashboardService, DashboardData } from "@/services/dashboardService";
import {
  Home,
  ShoppingCart,
  FileText,
  CreditCard,
  Heart,
  TrendingUp,
  Calendar,
  Loader2,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthenticated]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <Header variant="minimal" className="border-b shadow-sm" />
      {/* Dashboard Title Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name || "User"}
              </p>
            </div>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowRight className="h-4 w-4 mr-2" />
              Browse Properties
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Favorites */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Homes</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favorites}</div>
              <p className="text-xs text-muted-foreground">Properties saved</p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2"
                onClick={() => navigate("/favorites")}
              >
                View all
              </Button>
            </CardContent>
          </Card>

          {/* Purchases */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.purchases.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.purchases.completed} completed
              </p>
            </CardContent>
          </Card>

          {/* Offers */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/dashboard/offers")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Offers</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.offers.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.offers.submitted} submitted
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dashboard/offers");
                }}
              >
                View all
              </Button>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.documents}</div>
              <p className="text-xs text-muted-foreground">Signed documents</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/favorites")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Saved Homes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View and manage your favorite properties
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/dashboard/documents")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                Signed Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Access your signed agreements and forms
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.documents} documents available
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dashboard/documents");
                }}
              >
                View all
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/dashboard/payments")}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-500" />
                Payment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                View your transaction history
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {stats.payments.total} transactions
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/dashboard/payments");
                }}
              >
                View all
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Purchases */}
        {dashboardData.recentPurchases.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/property/${purchase.property_id}`)
                    }
                  >
                    <div className="flex items-center space-x-4">
                      <Home className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium">
                          Property ID: {purchase.property_id}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          Status: {purchase.status.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        {new Date(purchase.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
