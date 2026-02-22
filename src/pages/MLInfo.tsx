import { Link } from "react-router-dom";
import {
    Shield, ArrowLeft, Brain, Database, Cpu, Activity, CheckCircle2, Lock, Eye, Server, Zap, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";

export default function MLInfo() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors">SecureVault</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Link to="/">
                            <Button variant="ghost" className="text-sm font-medium">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                            <Brain className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Machine Learning in SecureVault
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our AI-powered intrusion detection system uses machine learning to analyze user behavior, detect anomalies, and protect your data in real-time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Stats */}
            <section className="pb-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { value: "99.7%", label: "Detection Accuracy" },
                            { value: "<50ms", label: "Response Time" },
                            { value: "24/7", label: "Continuous Monitoring" },
                            { value: "0", label: "False Negatives" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                                className="p-5 rounded-xl bg-secondary/20 border border-border/30 text-center"
                            >
                                <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                                <div className="text-xs text-muted-foreground">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How ML Works - Pipeline */}
            <section className="py-16 px-4 bg-secondary/10">
                <div className="container mx-auto max-w-4xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-8 text-center"
                    >
                        How Our ML Pipeline Works
                    </motion.h2>

                    <div className="space-y-4">
                        {[
                            { step: "1", title: "Data Collection", desc: "The system continuously collects login patterns, file access logs, network activity data, and user behavior metrics to build a comprehensive dataset.", icon: Database },
                            { step: "2", title: "Feature Extraction", desc: "Key behavioral features are extracted including access frequency, time patterns, IP geolocation, session duration, and file operation types.", icon: Cpu },
                            { step: "3", title: "Model Training", desc: "ML models including Random Forest, Support Vector Machine (SVM), and Neural Networks are trained on labeled datasets of normal vs. malicious behavior patterns.", icon: Brain },
                            { step: "4", title: "Real-time Detection", desc: "The trained model analyzes every live user action in real-time, comparing it against learned patterns to identify anomalies and flag suspicious behavior instantly.", icon: Activity },
                            { step: "5", title: "Alert & Response", desc: "When suspicious activity is detected, the system generates intrusion alerts, notifies administrators, logs the event, and can automatically restrict access.", icon: Shield },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-4 p-5 rounded-xl bg-background border border-border/30"
                            >
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                                        {item.step}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Algorithms Used */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-8 text-center"
                    >
                        ML Algorithms & Techniques
                    </motion.h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: "Random Forest", desc: "Ensemble learning method that builds multiple decision trees to classify user actions as normal or suspicious.", icon: BarChart3 },
                            { title: "Support Vector Machine", desc: "Finds the optimal boundary between normal and malicious behavior in high-dimensional feature space.", icon: Zap },
                            { title: "Neural Networks", desc: "Deep learning models that recognize complex patterns in user behavior and network traffic.", icon: Brain },
                            { title: "Anomaly Detection", desc: "Identifies unusual deviations from established baselines of normal system usage.", icon: Eye },
                            { title: "Behavior Analysis", desc: "Profiles individual user behavior patterns to detect compromised accounts.", icon: Activity },
                            { title: "Pattern Recognition", desc: "Identifies known attack signatures and threat patterns across all system interactions.", icon: Lock },
                        ].map((algo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-xl bg-secondary/20 border border-border/30"
                            >
                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
                                    <algo.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">{algo.title}</h3>
                                <p className="text-sm text-muted-foreground">{algo.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What It Detects */}
            <section className="py-16 px-4 bg-secondary/10">
                <div className="container mx-auto max-w-4xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-8 text-center"
                    >
                        What Our ML System Detects
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "Brute force login attempts",
                            "Unusual file access patterns",
                            "Suspicious IP addresses & locations",
                            "Unauthorized data downloads",
                            "Account compromise indicators",
                            "Multiple failed authentication attempts",
                            "Abnormal session durations",
                            "Privilege escalation attempts",
                            "Data exfiltration patterns",
                            "Unauthorized sharing or access",
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -15 : 15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border/30"
                            >
                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies Used */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-8 text-center"
                    >
                        Technologies & Stack
                    </motion.h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { name: "Python", desc: "ML model training" },
                            { name: "Scikit-learn", desc: "ML algorithms" },
                            { name: "TensorFlow", desc: "Deep learning" },
                            { name: "Node.js", desc: "Backend runtime" },
                            { name: "React", desc: "Frontend UI" },
                            { name: "TypeScript", desc: "Type safety" },
                            { name: "PostgreSQL", desc: "Data storage" },
                            { name: "AES-256", desc: "Encryption" },
                        ].map((tech, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="p-4 rounded-xl bg-secondary/20 border border-border/30 text-center"
                            >
                                <div className="font-semibold mb-1">{tech.name}</div>
                                <div className="text-xs text-muted-foreground">{tech.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center p-8 rounded-2xl bg-secondary/20 border border-border/50"
                    >
                        <h2 className="text-2xl font-bold mb-3">Experience AI-Powered Security</h2>
                        <p className="text-muted-foreground mb-6">Sign up to protect your files with intelligent threat detection.</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/register">
                                <Button className="rounded-full px-6">Get Started</Button>
                            </Link>
                            <Link to="/faq">
                                <Button variant="outline" className="rounded-full px-6">View FAQ</Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-border">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    © 2024 SecureVault Inc. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
