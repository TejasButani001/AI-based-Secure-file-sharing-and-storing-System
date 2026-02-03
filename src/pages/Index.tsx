
import { Link } from "react-router-dom";
import {
  Shield, Lock, Activity, ArrowRight, Zap, Globe, Users,
  CheckCircle2, ChevronDown, ChevronUp, Server, Database, Key, Brain,
  FileCheck, Eye
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
              <a href="#features" className="hover:text-foreground transition-colors">Capabilities</a>
              <a href="#security" className="hover:text-foreground transition-colors">Security</a>
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
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
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 text-center lg:text-left z-20">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 mb-8 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">AI Threat Detection Active</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Secure Storage with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary">Intelligent Defense.</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The first file sharing platform that uses machine learning to detect intrusion attempts in real-time.
                <span className="text-foreground font-medium block mt-2">AES-256 Encryption. Zero Knowledge. Total Privacy.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-blue-600 border-0">
                    Secure Your Files Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <div className="flex items-center gap-4 text-sm text-muted-foreground px-4">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span>Bank-Grade Security</span>
                </div>
              </div>
            </div>

            <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
              <div className="relative z-10 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-lg shadow-2xl p-2">
                <div className="rounded-xl overflow-hidden border border-border/50 bg-card/80">
                  {/* Mock Dashboard UI */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Live Threat Monitor</span>
                      </div>
                      <div className="text-xs font-mono text-emerald-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        SYSTEM NORMAL
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { time: "10:42:05", event: "File upload scanned (clean)", status: "success" },
                        { time: "10:41:12", event: "Unusual login attempt blocked", status: "warning" },
                        { time: "10:38:55", event: "Encrypted backup completed", status: "success" },
                      ].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm p-3 rounded-lg bg-muted/30 font-mono">
                          <span className="text-muted-foreground">{log.time}</span>
                          <span className="flex-1">{log.event}</span>
                          <div className={cn("w-2 h-2 rounded-full", log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500')} />
                        </div>
                      ))}
                    </div>

                    <div className="h-32 bg-muted/20 rounded-lg border border-border/30 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end justify-center gap-1 px-8 pb-4">
                        {[40, 65, 34, 78, 45, 23, 89, 56, 43, 67, 34, 55].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="w-full bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors" />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -top-6 -right-6 p-4 bg-background/90 backdrop-blur rounded-2xl border border-primary/20 shadow-2xl animate-bounce delay-100 flex items-center gap-3 z-20">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">AI Engine</div>
                  <div className="font-bold">Active Learning</div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 p-4 bg-background/90 backdrop-blur rounded-2xl border border-emerald-500/20 shadow-2xl animate-bounce delay-700 flex items-center gap-3 z-20">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Lock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Encryption</div>
                  <div className="font-bold">AES-256 GCM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-secondary/30 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security Architecture</h2>
            <p className="text-lg text-muted-foreground">
              Our platform combines traditional cryptographic security with modern behavioral analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Intrusion Detection",
                desc: "Our ML models analyze user behavior patterns to instantly flag and block suspicious access attempts.",
                color: "text-purple-500"
              },
              {
                icon: FileCheck,
                title: "Smart Malware Scanning",
                desc: "Every file is scanned by our heuristic AI engine upon upload to prevent zero-day attacks.",
                color: "text-blue-500"
              },
              {
                icon: Lock,
                title: "End-to-End Encryption",
                desc: "Files are encrypted on your device using AES-256 before transmission. We hold no keys.",
                color: "text-emerald-500"
              },
              {
                icon: Eye,
                title: "Audit Trails",
                desc: "Immutable logs of every file access, download, and modification for compliance and transparency.",
                color: "text-amber-500"
              },
              {
                icon: Key,
                title: "Secure Key Management",
                desc: "Hardware-backed key storage integration for maximum protection of your encryption keys.",
                color: "text-red-500"
              },
              {
                icon: Server,
                title: "Redundant Storage",
                desc: "Data is sharded and replicated across multiple secure headers to ensure 100% availability.",
                color: "text-cyan-500"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-2xl bg-background border border-border hover:border-primary/50 transition-colors shadow-sm hover:shadow-lg group">
                <div className={`w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground">Start securing your files today. Upgrade as you grow.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free Tier */}
            <div className="p-8 rounded-3xl bg-secondary/20 border border-border">
              <h3 className="font-bold text-lg mb-2">Personal</h3>
              <div className="text-3xl font-bold mb-6">$0 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 1GB Encrypted Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic Threat Detection</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 1 Device</li>
              </ul>
              <Link to="/register">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-8 rounded-3xl bg-primary/5 border border-primary relative">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                RECOMMENDED
              </div>
              <h3 className="font-bold text-lg mb-2 text-primary">Pro Security</h3>
              <div className="text-3xl font-bold mb-6">$12 <span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 100GB Encrypted Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced AI Analysis</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Devices</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Priority Support</li>
              </ul>
              <Link to="/register">
                <Button className="w-full">Start Free Trial</Button>
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="p-8 rounded-3xl bg-secondary/20 border border-border">
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Dedicated Infrastructure</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 24/7 Security Operations</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Custom SLA</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">SecureVault Inc.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Service</a>
            <a href="#" className="hover:text-primary">Security Whitepaper</a>
          </div>
          <div className="mt-4 md:mt-0">
            © 2024 All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
