import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

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
    navigate("/login");
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <CardTitle className="text-white">Check Your Email</CardTitle>
            <CardDescription className="text-slate-400">
              We've sent a password reset link to {email}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-500/20 bg-green-500/10">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500 ml-2">
                Please check your email and follow the link to reset your password.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-slate-400 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              onClick={handleBackToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader className="space-y-2">
          <CardTitle className="text-white">Forgot Password</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-500/20 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-500 ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-200">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <Button
              onClick={handleBackToLogin}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}