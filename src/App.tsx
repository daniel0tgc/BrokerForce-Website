import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "@/pages/Index";
import SearchResults from "@/pages/SearchResults";
import Favorites from "@/pages/Favorites";
import Dashboard from "@/pages/Dashboard";
import DashboardOffers from "@/pages/DashboardOffers";
import OfferDetail from "@/pages/OfferDetail";
import DashboardDocuments from "@/pages/DashboardDocuments";
import DashboardPayments from "@/pages/DashboardPayments";
import PropertyDetail from "@/pages/PropertyDetail";
import RepresentationForm from "@/pages/RepresentationForm";
import PaymentPage from "@/pages/PaymentPage";
import PaymentConfirmation from "@/pages/PaymentConfirmation";
import FinancingSelection from "@/pages/FinancingSelection";
import OfferAgreementForm from "@/pages/OfferAgreementForm";
import OfferConfirmation from "@/pages/OfferConfirmation";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Help from "@/pages/Help";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import SignIn from "@/pages/SignIn";
import NotFound from "@/pages/NotFound";
import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes("4")) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/offers" element={<DashboardOffers />} />
              <Route path="/dashboard/offers/:id" element={<OfferDetail />} />
              <Route
                path="/dashboard/documents"
                element={<DashboardDocuments />}
              />
              <Route
                path="/dashboard/payments"
                element={<DashboardPayments />}
              />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route
                path="/property/:id/representation"
                element={<RepresentationForm />}
              />
              <Route path="/property/:id/payment" element={<PaymentPage />} />
              <Route
                path="/property/:id/confirmation"
                element={<PaymentConfirmation />}
              />
              <Route
                path="/property/:id/financing"
                element={<FinancingSelection />}
              />
              <Route
                path="/property/:id/offer"
                element={<OfferAgreementForm />}
              />
              <Route
                path="/property/:id/offer/confirmation"
                element={<OfferConfirmation />}
              />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
