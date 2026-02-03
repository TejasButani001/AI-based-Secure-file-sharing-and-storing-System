
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"admin" | "user">("user"); // Included for API compatibility, though UI is removed
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name, email, password, role }), // Include role and username
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server returned non-JSON response: ${res.status} ${res.statusText}`);
      }

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      console.log("Registration success:", data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      <div className="absolute top-4 left-4 z-50">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <Home className="w-4 h-4" />
            Home
          </Button>
        </Link>
      </div>
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

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
            Join the Secure<br />
            <span className="text-primary">Network</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-md">
            Create an account to start sharing files with enterprise-grade encryption
            and AI-powered security monitoring.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <p className="text-2xl font-bold text-primary">Secure</p>
              <p className="text-sm text-muted-foreground">Storage</p>
            </div>
            <div className="p-4 rounded-xl bg-card/50 border border-border">
              <p className="text-2xl font-bold text-success">Fast</p>
              <p className="text-sm text-muted-foreground">Transfer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SecureVault</span>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground mb-6">
              Enter your details to get started
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

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

              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button variant="glow" className="w-full" type="submit">
                Create Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Your data is encrypted with AES-256
          </p>
        </div>
      </div>
    </div>
  );
}
