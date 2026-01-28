import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (!email) {
        setError("Please enter your email address");
        setIsLoading(false);
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }
      setSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center animate-glow">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SecureVault</span>
          </div>

          <div className="glass-card p-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2 text-center">Check Your Email</h2>
            <p className="text-muted-foreground text-center mb-6">
              We've sent a password reset link to {email}
            </p>

            <Alert className="border-primary/20 bg-primary/10 mb-4">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground ml-2">
                Please check your email and follow the link to reset your password.
              </AlertDescription>
            </Alert>

            <p className="text-sm text-muted-foreground text-center mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <Button
              onClick={handleBackToLogin}
              variant="glow"
              className="w-full"
            >
              Back to Login
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
            <Mail className="w-3 h-3" />
            Check your inbox for reset instructions
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center animate-glow">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">SecureVault</span>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">Reset Password</h2>
          <p className="text-muted-foreground mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500 ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="translate-y-2 w-full text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Remember your password?{" "}
            <Link to="/" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
          <Mail className="w-3 h-3" />
          Your email is secure with us
        </p>
      </div>
    </div>
  );
}