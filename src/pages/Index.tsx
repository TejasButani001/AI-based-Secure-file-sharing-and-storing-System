
import { Link } from "react-router-dom";
import {
  Shield, Lock, Activity, ArrowRight, CheckCircle2, Menu, X, Globe, Server, Database, Key, Brain, FileCheck, Eye, Cloud, Cpu, Wifi, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Animated floating particles for cyber background
function CyberParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: 0,
          }}
          animate={{
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%"],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// Animated Shield Lock visual
function AnimatedShieldLock() {
  return (
    <motion.div
      className="relative w-32 h-32 md:w-40 md:h-40"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/20"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border border-blue-500/20"
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      />
      {/* Shield body */}
      <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-2xl shadow-primary/20">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <Lock className="w-12 h-12 md:w-16 md:h-16 text-primary" />
        </motion.div>
      </div>
      {/* Orbiting dots */}
      <motion.div
        className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "0 64px" }}
      />
      <motion.div
        className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "0 72px" }}
      />
    </motion.div>
  );
}

// Animated Cloud Shield visual
function AnimatedCloudShield() {
  return (
    <motion.div
      className="relative w-36 h-36 md:w-44 md:h-44"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    >
      {/* Cloud body */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <motion.div
            className="w-28 h-20 md:w-36 md:h-24 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-500/15 backdrop-blur-sm border border-blue-500/20 shadow-xl shadow-blue-500/10"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Cloud bumps */}
          <div className="absolute -top-6 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/15" />
          <div className="absolute -top-3 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/15" />
          {/* Shield inside cloud */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Shield className="w-10 h-10 text-blue-400" />
            </motion.div>
          </div>
        </div>
      </div>
      {/* Upload/download data lines */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 h-8 w-px bg-gradient-to-t from-transparent to-blue-400/50"
          style={{ left: `${30 + i * 20}%` }}
          animate={{ opacity: [0, 1, 0], y: [0, -20, -40] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
        />
      ))}
    </motion.div>
  );
}

// Animated Cybersecurity Dashboard mock
function AnimatedDashboard() {
  return (
    <motion.div
      className="relative w-full max-w-lg"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative rounded-2xl bg-gradient-to-br from-card/80 to-secondary/40 border border-border/50 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs text-muted-foreground font-mono">SecureVault — Threat Monitor</span>
        </div>

        {/* Dashboard content */}
        <div className="p-5 space-y-4">
          {/* Top stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Protected", value: "2,847", color: "text-emerald-400", icon: Shield },
              { label: "Threats", value: "0", color: "text-red-400", icon: Activity },
              { label: "Encrypted", value: "100%", color: "text-blue-400", icon: Lock },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.2 }}
                className="p-3 rounded-xl bg-background/50 border border-border/30"
              >
                <stat.icon className={cn("w-4 h-4 mb-2", stat.color)} />
                <div className={cn("text-lg font-bold", stat.color)}>{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Animated threat graph */}
          <div className="rounded-xl bg-background/30 border border-border/30 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">Network Activity</span>
              <motion.div
                className="flex items-center gap-1 text-[10px] text-emerald-400"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Live
              </motion.div>
            </div>
            {/* SVG line chart animation */}
            <svg viewBox="0 0 300 60" className="w-full h-16">
              <motion.path
                d="M0,40 Q20,35 40,38 T80,30 T120,35 T160,20 T200,28 T240,15 T280,25 T300,18"
                fill="none"
                stroke="currentColor"
                className="text-primary/50"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M0,45 Q20,42 40,44 T80,38 T120,40 T160,32 T200,36 T240,28 T280,34 T300,30"
                fill="none"
                stroke="currentColor"
                className="text-blue-500/30"
                strokeWidth="1.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>
          </div>

          {/* Log entries */}
          <div className="space-y-2">
            {[
              { text: "File encrypted: report_2026.pdf", icon: Lock, time: "Just now", color: "text-blue-400" },
              { text: "Login verified: tejas@gmail.com", icon: CheckCircle2, time: "2m ago", color: "text-emerald-400" },
              { text: "AI scan complete — 0 threats", icon: Shield, time: "5m ago", color: "text-primary" },
            ].map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + i * 0.3 }}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-background/30 border border-border/20 text-xs"
              >
                <log.icon className={cn("w-3.5 h-3.5 shrink-0", log.color)} />
                <span className="text-muted-foreground flex-1 truncate">{log.text}</span>
                <span className="text-muted-foreground/50 shrink-0">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Animated connection lines between icons
function FloatingIcons() {
  const icons = [
    { Icon: Cloud, x: "10%", y: "20%", delay: 0, color: "text-blue-400/40" },
    { Icon: Cpu, x: "85%", y: "15%", delay: 1, color: "text-purple-400/40" },
    { Icon: Wifi, x: "75%", y: "70%", delay: 2, color: "text-cyan-400/40" },
    { Icon: Database, x: "15%", y: "75%", delay: 0.5, color: "text-emerald-400/40" },
    { Icon: Zap, x: "50%", y: "85%", delay: 1.5, color: "text-amber-400/40" },
    { Icon: Key, x: "90%", y: "45%", delay: 2.5, color: "text-pink-400/40" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, x, y, delay, color }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: x, top: y }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon className={cn("w-6 h-6", color)} />
        </motion.div>
      ))}
    </div>
  );
}

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
    }),
  };

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
                to="/ml-info"
                className="px-3 py-1.5 rounded-md hover:bg-secondary/50 hover:text-foreground transition-colors"
              >
                ML Info
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
              to="/ml-info"
              className="block text-lg font-medium py-2 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              ML Info
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
          <CyberParticles />
          <FloatingIcons />
        </div>

        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Text content */}
            <div className="text-center lg:text-left">
              <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6"
              >
                <motion.span
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                AI Threat Detection Active
              </motion.div>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
              >
                Secure File Sharing with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-cyan-500">
                  Intelligent Defense
                </span>
              </motion.h1>

              <motion.p
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0"
              >
                The safe way to store and share data. Powered by machine learning to detect intrusion attempts in real-time.
              </motion.p>

              <motion.div
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-8 h-13 text-base bg-gradient-to-r from-primary to-blue-600 text-white hover:bg-secondary/50 transition-colors">
                    Start Securing Now <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="rounded-full px-8 h-13 text-base hover:bg-secondary/50 transition-colors">
                    View Demo
                  </Button>
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="flex items-center justify-center lg:justify-start gap-6 mt-10 text-sm text-muted-foreground"
              >
                {[
                  { icon: Shield, text: "AES-256 Encrypted" },
                  { icon: Brain, text: "AI-Powered" },
                  { icon: Activity, text: "Real-time Monitor" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <badge.icon className="w-4 h-4 text-primary/70" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Animated visuals */}
            <div className="relative flex flex-col items-center justify-center">
              {/* Floating security visuals */}
              <div className="flex items-center gap-6 mb-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                >
                  <AnimatedShieldLock />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <AnimatedCloudShield />
                </motion.div>
              </div>

              {/* Cybersecurity dashboard mockup */}
              <AnimatedDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes. Secure your files in four simple steps.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: "1", icon: Globe, title: "Sign Up", desc: "Create your free account with email and a secure password." },
              { step: "2", icon: Lock, title: "Upload Files", desc: "Upload your files. They are automatically encrypted with AES-256." },
              { step: "3", icon: Brain, title: "AI Protection", desc: "Our ML models continuously monitor for intrusion attempts and threats." },
              { step: "4", icon: Shield, title: "Share Securely", desc: "Share files with specific users or generate secure access links." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative mx-auto mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURES GRID ============== */}
      <section id="features" className="py-20 bg-secondary/20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, powerful, and secure. Everything you need to keep your data safe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: "AI Intrusion Detection", desc: "ML models analyze patterns to flag suspicious access instantly.", color: "from-purple-500/20 to-purple-600/10" },
              { icon: FileCheck, title: "Smart Scanning", desc: "Every file is scanned by AI upon upload to prevent malware.", color: "from-emerald-500/20 to-emerald-600/10" },
              { icon: Lock, title: "End-to-End Encryption", desc: "Files encrypted with AES-256 GCM. We can't read your data.", color: "from-blue-500/20 to-blue-600/10" },
              { icon: Eye, title: "Audit Trails", desc: "Immutable logs of every action for compliance.", color: "from-amber-500/20 to-amber-600/10" },
              { icon: Key, title: "Key Management", desc: "Secure key storage integration for maximum protection.", color: "from-pink-500/20 to-pink-600/10" },
              { icon: Server, title: "Redundant Storage", desc: "Data replicated to ensure 100% availability.", color: "from-cyan-500/20 to-cyan-600/10" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ opacity: 0.85, transition: { duration: 0.2 } }}
                className="group bg-background p-6 rounded-xl border border-border/50 shadow-sm hover:border-primary/30 transition-colors duration-200"
              >
                <div className={cn("w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4 text-primary", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== MACHINE LEARNING SECTION ============== */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Powered by Machine Learning</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI engine learns from every interaction to keep your data safe.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left - ML Pipeline visual */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { step: "Data Collection", desc: "System collects login patterns, file access logs, and network activity data.", icon: Database },
                { step: "Feature Extraction", desc: "Key behavioral features like access frequency, time patterns, and IP locations are extracted.", icon: Cpu },
                { step: "Model Training", desc: "ML models (Random Forest, SVM) are trained on normal vs. malicious behavior patterns.", icon: Brain },
                { step: "Real-time Detection", desc: "The trained model analyzes live activity and flags anomalies instantly.", icon: Activity },
                { step: "Alert & Response", desc: "Suspicious actions trigger alerts to admins and automated security responses.", icon: Shield },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/30"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.step}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right - ML Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "99.7%", label: "Detection Accuracy" },
                  { value: "<50ms", label: "Response Time" },
                  { value: "24/7", label: "Monitoring" },
                  { value: "0", label: "False Negatives" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="p-5 rounded-xl bg-secondary/20 border border-border/30 text-center"
                  >
                    <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-secondary/20 border border-border/30">
                <h4 className="font-semibold mb-3">ML Algorithms Used</h4>
                <div className="flex flex-wrap gap-2">
                  {["Random Forest", "SVM", "Neural Networks", "Anomaly Detection", "Behavior Analysis", "Pattern Recognition"].map((algo, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary"
                    >
                      {algo}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-secondary/20 border border-border/30">
                <h4 className="font-semibold mb-3">What It Detects</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {[
                    "Brute force login attempts",
                    "Unusual file access patterns",
                    "Suspicious IP addresses & locations",
                    "Unauthorized data downloads",
                    "Account compromise indicators",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== SECURITY SECTION ============== */}
      <section id="security" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
        </div>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Security That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                  Never Sleeps
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Our AI continuously monitors your files and user activity, detecting anomalies before they become threats.
              </p>
              <div className="space-y-4">
                {[
                  "Machine learning anomaly detection",
                  "Real-time user behavior analysis",
                  "Automated threat response & alerting",
                  "Complete audit trail for compliance",
                  "Zero-knowledge encryption architecture",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Animated security visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <div className="relative w-80 h-80">
                {/* Central shield */}
                <motion.div
                  className="absolute inset-12 rounded-3xl bg-gradient-to-br from-primary/10 to-blue-600/10 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Shield className="w-20 h-20 text-primary/60" />
                </motion.div>
                {/* Orbiting security icons */}
                {[
                  { Icon: Lock, angle: 0 },
                  { Icon: Key, angle: 72 },
                  { Icon: Eye, angle: 144 },
                  { Icon: Brain, angle: 216 },
                  { Icon: Database, angle: 288 },
                ].map(({ Icon, angle }, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-10 h-10 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-lg"
                    style={{
                      top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                      left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  >
                    <Icon className="w-5 h-5 text-primary/70" />
                  </motion.div>
                ))}
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                  <motion.circle
                    cx="160" cy="160" r="120"
                    fill="none"
                    stroke="currentColor"
                    className="text-primary/10"
                    strokeWidth="1"
                    strokeDasharray="8 8"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: "center" }}
                  />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== PRICING SECTION ============== */}
      <section id="pricing" className="py-20 bg-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-12"
          >
            Simple Pricing
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ opacity: 0.9 }}
              className="p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">Personal</h3>
              <div className="text-3xl font-bold mb-6">$0<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 1GB Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic Protection</li>
              </ul>
              <Link to="/register"><Button variant="outline" className="w-full">Get Started</Button></Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ opacity: 0.9 }}
              className="p-8 rounded-2xl border border-primary bg-primary/5 relative"
            >
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">POPULAR</div>
              <h3 className="font-bold text-lg mb-2 text-primary">Pro</h3>
              <div className="text-3xl font-bold mb-6">$12<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 100GB Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced AI</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Priority Support</li>
              </ul>
              <Link to="/register"><Button className="w-full">Start Free Trial</Button></Link>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ opacity: 0.9 }}
              className="p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 text-sm mb-8">
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Storage</li>
                <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> 24/7 Support</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
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
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#security" className="hover:text-primary transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Enterprise</a></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
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
