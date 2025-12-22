import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import SignInButton from "./SignInButton";
import CartButton from "./CartButton";

interface HeaderProps {
  variant?: "default" | "minimal";
  showCart?: boolean;
  showSignIn?: boolean;
  className?: string;
}

export default function Header({
  variant = "default",
  showCart = true,
  showSignIn = true,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`bg-white border-b border-gray-100 ${
        variant === "minimal" ? "shadow-sm" : ""
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - always links to home */}
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
            aria-label="BrokerForce Home"
          >
            <Home className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">
              brokerforce.ai
            </span>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {showCart && <CartButton />}
            {showSignIn && <SignInButton />}
          </div>
        </div>
      </div>
    </header>
  );
}
