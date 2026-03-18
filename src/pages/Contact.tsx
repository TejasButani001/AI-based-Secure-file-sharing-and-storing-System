import { Link } from "react-router-dom";
import { Shield, ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Navbar } from "@/components/layout/Navbar";

import { useState } from "react";

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            <Navbar />

            {/* Content */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-5xl">
                    <div
                        className="text-center mb-12"
                    >

                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Have questions or need help? Reach out to our team.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                                <p className="text-muted-foreground mb-8">
                                    We'd love to hear from you. Whether you have a question about features, pricing, security, or anything else, our team is ready to answer.
                                </p>
                            </div>

                            {[
                                { icon: Mail, label: "Email", value: "support@securevault.com", href: "mailto:support@securevault.com" },
                                { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                                { icon: MapPin, label: "Address", value: "Gujarat, India", href: "#" },
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-secondary/20 border border-border/30 hover:bg-secondary/30 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">{item.label}</div>
                                        <div className="font-medium">{item.value}</div>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Contact Form */}
                        <div>
                            {submitted ? (
                                <div className="flex flex-col items-center justify-center h-full p-8 rounded-2xl bg-secondary/20 border border-border/30 text-center">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Send className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground mb-6">Thank you for reaching out. We'll get back to you soon.</p>
                                    <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-secondary/20 border border-border/30 space-y-5">
                                    <h2 className="text-xl font-bold mb-2">Send a Message</h2>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your name"
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="you@example.com"
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Subject</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="How can we help?"
                                            className="w-full h-10 px-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Message</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Write your message..."
                                            className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        <Send className="w-4 h-4 mr-2" /> Send Message
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
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
