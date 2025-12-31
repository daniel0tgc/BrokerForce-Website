import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/services/authService";
import Header from "@/components/Header";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function SignIn() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Sign In form state
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Register form state
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const result = await authService.checkUsername(username);
      setUsernameAvailable(result.available);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Handle username/password sign in
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authService.loginWithPassword({
        username: signInUsername,
        password: signInPassword,
      });

      if (result.success && result.user) {
        await checkAuth(); // Refresh auth state
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${result.user.name}!`,
        });
        navigate("/");
      } else {
        toast({
          title: "Sign in failed",
          description: result.error || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: "Sign in failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    authService.initiateGoogleLogin();
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (registerPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    if (usernameAvailable === false) {
      toast({
        title: "Username unavailable",
        description: "Please choose a different username.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Validate email is provided
      if (!registerEmail || registerEmail.trim().length === 0) {
        toast({
          title: "Email required",
          description: "Please enter your email address.",
          variant: "destructive",
        });
        return;
      }

      const result = await authService.register({
        username: registerUsername,
        password: registerPassword,
        name: registerName,
        email: registerEmail,
      });

      if (result.success && result.user) {
        await checkAuth(); // Refresh auth state

        // Show different message if accounts were linked
        if (result.linked) {
          toast({
            title: "Account linked successfully",
            description: result.message || "Your username and password have been linked to your existing Google account. You can now sign in with either method.",
          });
        } else {
          toast({
            title: "Account created successfully",
            description: `Welcome, ${result.user.name}!`,
          });
        }
        navigate("/");
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Failed to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Welcome to BrokerForce</CardTitle>
            <CardDescription className="text-center">
              Sign in or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="register">Create Account</TabsTrigger>
              </TabsList>

              {/* Sign In Tab */}
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-4">
                  {/* Google Sign In Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  {/* Username/Password Sign In Form */}
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-username">Username</Label>
                      <Input
                        id="signin-username"
                        type="text"
                        placeholder="Enter your username"
                        value={signInUsername}
                        onChange={(e) => setSignInUsername(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="space-y-4">
                <div className="space-y-4">
                  {/* Google Register Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign up with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  {/* Registration Form */}
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username (3-20 characters)"
                        value={registerUsername}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "");
                          setRegisterUsername(value);
                          checkUsernameAvailability(value);
                        }}
                        required
                        disabled={loading}
                        minLength={3}
                        maxLength={20}
                      />
                      {checkingUsername && (
                        <p className="text-xs text-muted-foreground">Checking availability...</p>
                      )}
                      {usernameAvailable === false && registerUsername.length >= 3 && !checkingUsername && (
                        <p className="text-xs text-red-600">Username is already taken</p>
                      )}
                      {usernameAvailable === true && registerUsername.length >= 3 && !checkingUsername && (
                        <p className="text-xs text-green-600">Username is available</p>
                      )}
                      {registerUsername.length > 0 && registerUsername.length < 3 && (
                        <p className="text-xs text-muted-foreground">
                          Username must be at least 3 characters
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={8}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={8}
                      />
                      {registerConfirmPassword &&
                        registerPassword !== registerConfirmPassword && (
                          <p className="text-xs text-red-600">Passwords don't match</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || usernameAvailable === false}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
