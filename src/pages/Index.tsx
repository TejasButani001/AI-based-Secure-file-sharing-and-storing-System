
import { Link } from "react-router-dom";
import {
  Shield, Lock, Activity, ArrowRight, CheckCircle2, Menu, X, Globe, Server, Database, Key, Brain, FileCheck, Eye, Cloud, Cpu, Wifi, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import React from "react";




export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">SecureVault</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              {['Features', 'Pricing', 'Security'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-3 py-1.5 rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
                >
                  {item}
                </a>
              ))}
              <Link
                to="/faq"
                className="px-3 py-1.5 rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className="px-3 py-1.5 rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
            <div className="h-6 w-px bg-border/50"></div>
            <div className="flex items-center gap-4">
              <ModeToggle />
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-medium hover:bg-secondary/50">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="rounded-full px-6 bg-primary text-white hover:bg-primary/80 transition-colors">
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
            <Link
              to="/faq"
              className="block text-lg font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              className="block text-lg font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center h-12 text-base">Log In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center h-12 text-base bg-gradient-to-r from-primary to-blue-600 text-white hover:bg-secondary/50 transition-colors">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============== HERO SECTION ============== */}
      <section className="relative pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            {/* Left — Text content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Secure File Sharing with Intelligent Defense
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                Safe file storage and sharing powered by AI threat detection.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/register">
                  <Button className="text-base px-8 py-3 h-12">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="text-base px-8 py-3 h-12">Learn More</Button>
                </Link>
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm">
                <div className="rounded-lg bg-card border border-border overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Protected", value: "2,847", icon: Shield },
                        { label: "Threats", value: "0", icon: Activity },
                        { label: "Encrypted", value: "100%", icon: Lock },
                      ].map((stat, i) => (
                        <div key={i} className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center text-xs">
                          <stat.icon className="w-3 h-3 mx-auto mb-1 text-primary" />
                          <div className="font-semibold text-foreground">{stat.value}</div>
                          <div className="text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1 text-xs">
                      <p className="text-muted-foreground">✓ File encrypted: report_2026.pdf</p>
                      <p className="text-muted-foreground">✓ Login verified</p>
                      <p className="text-muted-foreground">✓ AI scan complete</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Simple steps to secure your files</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", icon: Globe, title: "Sign Up", desc: "Create your account" },
              { step: "2", icon: Lock, title: "Upload", desc: "Files auto-encrypted" },
              { step: "3", icon: Brain, title: "AI Monitor", desc: "Real-time detection" },
              { step: "4", icon: Shield, title: "Share Secure", desc: "Controlled access" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-lg bg-card border border-border">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-base text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURES GRID ============== */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Features</h2>
            <p className="text-lg text-muted-foreground">Enterprise-grade protection for your data</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Brain, title: "AI Detection", desc: "Pattern analysis & anomaly detection" },
              { icon: FileCheck, title: "Smart Scanning", desc: "AI-powered malware detection" },
              { icon: Lock, title: "AES-256 Encryption", desc: "Zero-knowledge architecture" },
              { icon: Eye, title: "Audit Trails", desc: "Immutable action logs" },
              { icon: Key, title: "Key Management", desc: "Secure key storage" },
              { icon: Server, title: "Redundant Storage", desc: "100% availability" }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-lg bg-card border border-border">
                <feature.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-base text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MACHINE LEARNING SECTION ============== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">AI-Powered Protection</h2>
            <p className="text-lg text-muted-foreground">Machine learning threats detection pipeline</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Left - ML Pipeline */}
            <div className="space-y-2">
              {[
                { step: "Data Collection", icon: Database },
                { step: "Feature Extraction", icon: Cpu },
                { step: "Model Training", icon: Brain },
                { step: "Real-time Detection", icon: Activity },
                { step: "Alert & Response", icon: Shield },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border text-base">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span>{item.step}</span>
                </div>
              ))}
            </div>

            {/* Right - ML Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "99.7%", label: "Accuracy" },
                  { value: "<50ms", label: "Response" },
                  { value: "24/7", label: "Monitoring" },
                  { value: "0", label: "False Neg" },
                ].map((stat, i) => (
                  <div key={i} className="p-4 rounded-lg bg-card border border-border text-center text-base">
                    <div className="font-bold text-primary text-xl">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-lg bg-card border border-border text-base">
                <h4 className="font-bold mb-3">Detects</h4>
                <ul className="space-y-2">
                  {[
                    "Brute force attempts",
                    "Unusual file access",
                    "Suspicious IPs",
                    "Data downloads",
                    "Account compromises",
                  ].map((item, i) => (
                    <li key={i} className="text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== SECURITY SECTION ============== */}
      <section id="security" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-4xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold mb-6">Security That Never Sleeps</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Continuous AI monitoring detects threats before they impact your data.
              </p>
              <div className="space-y-3 text-base">
                {[
                  "ML anomaly detection",
                  "Real-time behavior analysis",
                  "Automated threat alerts",
                  "Compliance audit trails",
                  "Zero-knowledge encryption",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple security card */}
            <div className="p-8 rounded-lg bg-card border border-border text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Enterprise Protection</h3>
              <p className="text-base text-muted-foreground">Military-grade encryption with AI-powered threat detection</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PRICING SECTION ============== */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">Simple Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left text-base">
            {/* Free */}
            <div className="p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-4">Personal</h3>
              <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 1GB Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Basic Protection</li>
              </ul>
              <Link to="/register"><Button variant="outline" className="w-full text-base h-10">Get Started</Button></Link>
            </div>

            {/* Pro */}
            <div className="p-6 rounded-lg border border-primary bg-primary/5 relative">
              <span className="absolute top-0 right-0 bg-primary text-white text-sm font-bold px-3 py-1 rounded-bl">POPULAR</span>
              <h3 className="text-lg font-bold mb-4">Pro</h3>
              <div className="text-3xl font-bold mb-6">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-2 mb-6">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 100GB Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Advanced AI</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Priority Support</li>
              </ul>
              <Link to="/register"><Button className="w-full text-base h-10">Start Trial</Button></Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold mb-4">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-2 mb-6">
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> 24/7 Support</li>
              </ul>
              <Button variant="outline" className="w-full text-base h-10">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">SecureVault</span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs">
                AI-powered file security protecting your data with intelligence.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-2 text-sm">Product</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><a href="#features" className="hover:text-primary">Features</a></li>
                <li><a href="#security" className="hover:text-primary">Security</a></li>
                <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
                <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-sm">Company</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-sm">Legal</h4>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacy</a></li>
                <li><a href="#" className="hover:text-primary">Terms</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-4 text-xs text-muted-foreground text-center">
            <p>&copy; 2026 SecureVault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
