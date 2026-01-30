import { Link } from "react-router-dom";
import {
  Shield, Lock, Activity, ArrowRight, Zap, Globe, Users,
  CheckCircle2, ChevronDown, ChevronUp, Server, Database, Key
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">SecureVault</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left z-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 mb-8 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-medium text-muted-foreground">AI-Powered Security 2.0 is live</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Secure Data.</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Enterprise-grade encryption meets active machine learning defense.
                Storage that doesn't just store, but <span className="text-foreground font-medium">protects</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-sm text-muted-foreground px-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-zinc-800" />
                    ))}
                  </div>
                  <span>Trusted by 10k+ teams</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
              <div className="relative z-10 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-lg shadow-2xl p-2 transform rotate-y-12 rotate-x-6 perspective-1000 transition-transform hover:rotate-0 duration-700">
                <div className="rounded-xl overflow-hidden border border-border/50 bg-card">
                  {/* Mock UI Header */}
                  <div className="h-10 bg-muted/50 border-b border-border/50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="ml-4 h-4 w-40 bg-muted rounded-full" />
                  </div>
                  {/* Mock UI Body */}
                  <div className="p-6 grid gap-6">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-32 bg-muted rounded-lg" />
                      <div className="h-8 w-24 bg-primary/20 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-square rounded-xl bg-muted/30 border border-border/50 p-4 flex flex-col justify-between">
                          <div className="w-10 h-10 rounded-lg bg-primary/10" />
                          <div className="space-y-2">
                            <div className="h-2 w-16 bg-muted rounded" />
                            <div className="h-2 w-10 bg-muted rounded" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-32 rounded-xl bg-muted/20 border border-border/50 flex items-center justify-center">
                      <Activity className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-12 -right-12 p-4 bg-card rounded-xl border border-border shadow-xl animate-bounce duration-[3000ms]">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-8 -left-8 p-4 bg-card rounded-xl border border-border shadow-xl animate-bounce duration-[4000ms]">
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-border/40 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-8">Trusted by security-first companies worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for logos */}
            {["Acme Corp", "GlobalBank", "Nebula", "CyberDyne", "Massive Dynamic"].map((name) => (
              <div key={name} className="bg-card w-40 h-12 rounded flex items-center justify-center font-bold text-lg text-foreground/80 border border-border/50 shadow-sm">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Security without compromise</h2>
            <p className="text-xl text-muted-foreground">
              We've reimagined cloud storage from the ground up, placing zero-trust architecture at the core of every file interaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Lock, title: "End-to-End Encryption", desc: "Client-side AES-256 encryption means we never see your data. Not even our admins.", color: "text-blue-500" },
              { icon: Activity, title: "AI Threat Analysis", desc: "Behavioral models analyze access patterns in real-time to detect anomalous activity.", color: "text-red-500" },
              { icon: Globe, title: "Global Edge Network", desc: "Files are cached on edge nodes worldwide for lightning-fast access anywhere.", color: "text-green-500" },
              { icon: Users, title: "Granular Access", desc: "Manage permissions down to the individual file level with time-based revocations.", color: "text-yellow-500" },
              { icon: Database, title: "Immutable Backups", desc: "Point-in-time recovery ensures you never lose critical data to ransomware.", color: "text-purple-500" },
              { icon: Key, title: "Hardware Keys", desc: "Support for YubiKey and biometric authentication for maximum account security.", color: "text-orange-500" }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors">
                <div className={`w-14 h-14 rounded-2xl bg-background flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the plan that fits your security needs.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Starter */}
            <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-lg">
              <h3 className="text-xl font-medium text-muted-foreground mb-4">Starter</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["5GB Secure Storage", "Basic Encryption", "2 Devices", "Email Support"].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full">Sign Up Free</Button>
            </div>

            {/* Pro - Highlighted */}
            <div className="relative p-10 rounded-3xl bg-card border-2 border-primary shadow-2xl scale-105 z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary px-4 py-1 rounded-full text-xs font-bold text-primary-foreground uppercase tracking-wide">Most Popular</div>
              <h3 className="text-xl font-medium text-primary mb-4">Pro Security</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["1TB Secure Storage", "Advanced AI Protection", "Unlimited Devices", "Priority 24/7 Support", "Audit Logs"].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary fill-primary/10" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full h-12 rounded-full shadow-lg shadow-primary/25">Get Started</Button>
            </div>

            {/* Enterprise */}
            <div className="p-8 rounded-3xl bg-card border border-border/50 shadow-lg">
              <h3 className="text-xl font-medium text-muted-foreground mb-4">Enterprise</h3>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {["Unlimited Storage", "Dedicated Instance", "SAML/SSO", "Custom SLA", "Account Manager"].map(item => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full rounded-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: "How does the encryption work?", a: "We use client-side AES-256 encryption. Your files are encrypted on your device before they ever reach our servers, meaning we technically cannot see your data." },
              { q: "Is there a file size limit?", a: "For Pro users, we support individual files up to 50GB. Enterprise users have no limits." },
              { q: "Can I share files with non-users?", a: "Yes, you can generate secure, time-bombed links that expire automatically. Optional password protection is available." },
              { q: "What happens if I lose my password?", a: "Because we have zero-knowledge architecture, we cannot reset your password. You must use your recovery key generated at sign-up to restore access." }
            ].map((item, i) => (
              <div key={i} className="border border-border rounded-xl bg-card overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-lg">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-20 text-center">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6">Ready to secure your future?</h2>
              <p className="text-primary-foreground/80 text-xl mb-10">Join over 10,000 security professionals today.</p>
              <Link to="/register">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg rounded-full shadow-2xl">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">SecureVault</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                The most advanced AI-powered secure storage solution for the modern web. Built for privacy, designed for speed.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer">
                    <Globe className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Features</a></li>
                <li><a href="#" className="hover:text-primary">Pricing</a></li>
                <li><a href="#" className="hover:text-primary">Security</a></li>
                <li><a href="#" className="hover:text-primary">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Careers</a></li>
                <li><a href="#" className="hover:text-primary">Blog</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div>© 2024 SecureVault Inc. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
