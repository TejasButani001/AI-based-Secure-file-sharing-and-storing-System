
import { Link } from "react-router-dom";
import {
  Shield, Lock, Activity, ArrowRight, Zap, Globe, Users,
  CheckCircle2, ChevronDown, ChevronUp, Server, Database, Key, Brain,
  FileCheck, Eye, Star, Quote, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";

export default function Index() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax background
  const yBg = useTransform(scrollY, [0, 1000], [0, 200]);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } }
  };

  const menuVariants: Variants = {
    closed: { opacity: 0, x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 font-sans">
      {/* Search Engine Optimization Meta Tags (Conceptual) */}

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out flex justify-center",
          scrolled ? "pt-4" : "pt-0"
        )}
      >
        <div
          className={cn(
            "transition-all duration-500 ease-in-out flex items-center justify-between px-6",
            scrolled
              ? "w-[95%] max-w-5xl rounded-full bg-background/60 backdrop-blur-2xl border border-white/10 shadow-lg shadow-black/5 h-16"
              : "w-full max-w-7xl h-20 bg-transparent border-transparent"
          )}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block group-hover:text-primary transition-colors">SecureVault</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              {['Capabilities', 'Security', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative group hover:text-primary transition-colors py-2"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="h-6 w-px bg-border/50" /> {/* Divider */}

            <div className="flex items-center gap-3">
              <ModeToggle />
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">
                Log in
              </Link>
              <Link to="/register">
                <Button size="sm" className="rounded-full px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95">
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
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl md:hidden flex flex-col pt-32 px-6"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              {['Capabilities', 'Security', 'Pricing'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-between items-center border-b border-border/50 pb-4 hover:text-primary"
                >
                  {item}
                  <ArrowRight className="w-4 h-4 opacity-50" />
                </motion.a>
              ))}
              <div className="flex flex-col gap-4 mt-8">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 text-base rounded-xl">Log In</Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full h-12 text-base rounded-xl shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-primary-foreground">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
        <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        </motion.div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex-1 text-center lg:text-left z-20"
            >
              <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 border border-border/50 mb-8 backdrop-blur-sm hover:bg-secondary/80 transition-colors cursor-default">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">AI Threat Detection Active</span>
              </motion.div>

              <motion.h1 variants={item} className="text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Secure Storage with <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-primary background-animate">
                  Intelligent Defense.
                </span>
              </motion.h1>

              <motion.p variants={item} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The first file sharing platform that uses machine learning to detect intrusion attempts in real-time.
                <span className="text-foreground font-medium block mt-2">AES-256 Encryption. Zero Knowledge. Total Privacy.</span>
              </motion.p>

              <motion.div variants={item} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform bg-gradient-to-r from-primary to-blue-600 border-0 group">
                    Secure Your Files Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base rounded-full border-2 hover:bg-secondary/50">
                    View Demo
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={item} className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground/60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2"><Shield className="w-5 h-5" /><span className="font-semibold">SOC2 Type II</span></div>
                <div className="flex items-center gap-2"><Lock className="w-5 h-5" /><span className="font-semibold">ISO 27001</span></div>
                <div className="flex items-center gap-2"><Globe className="w-5 h-5" /><span className="font-semibold">GDPR Ready</span></div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full max-w-[600px] lg:max-w-none perspective-1000"
            >
              <div className="relative z-10 rounded-2xl border border-white/10 bg-background/50 backdrop-blur-xl shadow-2xl p-2 ring-1 ring-white/20 transform hover:rotate-y-0 transition-transform duration-700 ease-out-back">
                <div className="rounded-xl overflow-hidden border border-white/5 bg-card/80 relative">
                  {/* Mock Dashboard UI */}
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-border/40 pb-4">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-primary animate-pulse" />
                        <span className="font-semibold">Live Threat Monitor</span>
                      </div>
                      <div className="text-xs font-mono text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded">
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
                        <motion.div
                          key={i}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 1 + i * 0.2 }}
                          className="flex items-center gap-4 text-sm p-3 rounded-lg bg-muted/40 border border-border/20 font-mono hover:bg-muted/60 transition-colors"
                        >
                          <span className="text-muted-foreground text-xs">{log.time}</span>
                          <span className="flex-1 truncate">{log.event}</span>
                          <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px]", log.status === 'success' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-amber-500 shadow-amber-500/50')} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="h-32 bg-muted/20 rounded-lg border border-border/30 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 flex items-end justify-center gap-1 px-8 pb-4">
                        {[40, 65, 34, 78, 45, 23, 89, 56, 43, 67, 34, 55].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 1.5 + i * 0.05, duration: 0.5, type: "spring" }}
                            className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary/40 transition-colors"
                          />
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badges */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 p-4 bg-background/80 backdrop-blur-md rounded-2xl border border-primary/20 shadow-2xl flex items-center gap-3 z-20"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">AI Engine</div>
                  <div className="font-bold">Active Learning</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-8 -left-8 p-4 bg-background/80 backdrop-blur-md rounded-2xl border border-emerald-500/20 shadow-2xl flex items-center gap-3 z-20"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Lock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase text-muted-foreground">Encryption</div>
                  <div className="font-bold">AES-256 GCM</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Enterprise-Grade Security Architecture
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform combines traditional cryptographic security with modern behavioral analysis to provide a fortress for your data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Intrusion Detection",
                desc: "Our ML models analyze user behavior patterns to instantly flag and block suspicious access attempts.",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
                border: "group-hover:border-purple-500/50"
              },
              {
                icon: FileCheck,
                title: "Smart Malware Scanning",
                desc: "Every file is scanned by our heuristic AI engine upon upload to prevent zero-day attacks.",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
                border: "group-hover:border-blue-500/50"
              },
              {
                icon: Lock,
                title: "End-to-End Encryption",
                desc: "Files are encrypted on your device using AES-256 before transmission. We hold no keys.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
                border: "group-hover:border-emerald-500/50"
              },
              {
                icon: Eye,
                title: "Audit Trails",
                desc: "Immutable logs of every file access, download, and modification for compliance and transparency.",
                color: "text-amber-500",
                bg: "bg-amber-500/10",
                border: "group-hover:border-amber-500/50"
              },
              {
                icon: Key,
                title: "Secure Key Management",
                desc: "Hardware-backed key storage integration for maximum protection of your encryption keys.",
                color: "text-red-500",
                bg: "bg-red-500/10",
                border: "group-hover:border-red-500/50"
              },
              {
                icon: Server,
                title: "Redundant Storage",
                desc: "Data is sharded and replicated across multiple secure headers to ensure 100% availability.",
                color: "text-cyan-500",
                bg: "bg-cyan-500/10",
                border: "group-hover:border-cyan-500/50"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={cn(
                  "p-8 rounded-2xl bg-background border border-border/50 transition-all duration-300 shadow-sm hover:shadow-xl group",
                  feature.border
                )}
              >
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300", feature.bg, feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Testimonials */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Trusted by Security Professionals</h2>
            <p className="text-muted-foreground">Don't just take our word for it.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The AI detection caught a breach attempt that our firewall missed completely. Incredbile tech.",
                author: "Sarah Jenkins",
                role: "CISO, TechFlow",
                rating: 5
              },
              {
                quote: "Finally, secure storage that doesn't feel like a chore to use. The UI is stunning and fast.",
                author: "Michael Chen",
                role: "Lead DevOps",
                rating: 5
              },
              {
                quote: "Compliance made easy. The audit trails are exactly what our auditors needed to see.",
                author: "Emily Ross",
                role: "Security Analyst",
                rating: 5
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-secondary/10 p-8 rounded-2xl relative"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg italic mb-6 text-foreground/80">"{t.quote}"</p>
                <div>
                  <div className="font-bold">{t.author}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-muted-foreground">Start securing your files today. Upgrade as you grow.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-shadow"
            >
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
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-primary/5 border border-primary relative shadow-2xl scale-105"
            >
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
                <Button className="w-full shadow-lg shadow-primary/25">Start Free Trial</Button>
              </Link>
            </motion.div>

            {/* Enterprise Tier */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-background border border-border shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-4 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Dedicated Infrastructure</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 24/7 Security Operations</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Custom SLA</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">SecureVault Inc.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Security Whitepaper</a>
          </div>
          <div className="mt-4 md:mt-0">
            © 2024 All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
