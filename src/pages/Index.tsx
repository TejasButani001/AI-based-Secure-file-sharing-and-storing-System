
import { Link } from "react-router-dom";
import {
  Shield, Lock, Activity, ArrowRight, CheckCircle2, Menu, X, Globe, Server, Database, Key, Brain, FileCheck, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors duration-300">SecureVault</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-8 text-sm font-medium text-muted-foreground">
              {['Features', 'Pricing', 'Security'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative hover:text-foreground transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full py-1"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="h-6 w-px bg-border/50"></div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-medium hover:bg-secondary/50">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ModeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden fixed inset-x-0 top-20 bg-background/95 backdrop-blur-2xl border-b border-border/40 transition-all duration-300 ease-in-out overflow-hidden",
          mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="p-6 space-y-4">
            {['Features', 'Pricing', 'Security'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-lg font-medium py-2 hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center h-12 text-base">Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center h-12 text-base bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            AI Threat Detection Active
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Secure File Sharing with <br className="hidden md:block" />
            <span className="text-primary">Intelligent Defense</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            The safe way to store and share data. Powered by machine learning to detect intrusion attempts in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 h-12 text-base">
                Start Securing Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful, and secure. Everything you need to keep your data safe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "AI Intrusion Detection", desc: "ML models analyze patterns to flag suspicious access instantly." },
              { icon: FileCheck, title: "Smart Scanning", desc: "Every file is scanned by AI upon upload to prevent malware." },
              { icon: Lock, title: "End-to-End Encryption", desc: "Files encrypted with AES-256 GCM. We can't read your data." },
              { icon: Eye, title: "Audit Trails", desc: "Immutable logs of every action for compliance." },
              { icon: Key, title: "Key Management", desc: "Secure key storage integration for maximum protection." },
              { icon: Server, title: "Redundant Storage", desc: "Data replicated to ensure 100% availability." }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-6 rounded-xl border border-border shadow-sm">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Free */}
            <div className="p-8 rounded-2xl border border-border">
              <h3 className="font-bold text-lg mb-2">Personal</h3>
              <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 1GB Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic Protection</li>
              </ul>
              <Link to="/register"><Button variant="outline" className="w-full">Get Started</Button></Link>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl border border-primary bg-primary/5 relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
              <h3 className="font-bold text-lg mb-2 text-primary">Pro</h3>
              <div className="text-3xl font-bold mb-6">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 100GB Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced AI</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Priority Support</li>
              </ul>
              <Link to="/register"><Button className="w-full">Start Free Trial</Button></Link>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-2xl border border-border">
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 24/7 Support</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-12 border-t border-border bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight">SecureVault</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Next-generation file security powered by artificial intelligence. Protect your data from tomorrow's threats, today.
              </p>
              <div className="flex gap-4">
                {/* Social Placeholders */}
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer">
                    <Globe className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-6">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to our newsletter for the latest security insights.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full h-10 px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                />
                <Button className="w-full h-10">Subscribe</Button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 SecureVault Inc. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
