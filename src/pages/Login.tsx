import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo login - navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        
        <div className="relative z-10 flex flex-col justify-center p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-glow">
              <Shield className="w-7 h-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">SecureVault</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            AI-Powered Security<br />
            <span className="text-primary">File Protection</span>
          </h1>
          
          <p className="text-muted-foreground text-lg max-w-md">
            Enterprise-grade encryption and machine learning intrusion detection 
            to keep your files safe from unauthorized access.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <p className="text-2xl font-bold text-primary">AES-256</p>
              <p className="text-sm text-muted-foreground">Encryption</p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <p className="text-2xl font-bold text-success">99.9%</p>
              <p className="text-sm text-muted-foreground">Threat Detection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SecureVault</span>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground mb-6">
              Sign in to access your secure files
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button variant="glow" className="w-full" type="submit">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Create account
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Protected by AES-256 encryption
          </p>
        </div>
      </div>
    </div>
  );
}
