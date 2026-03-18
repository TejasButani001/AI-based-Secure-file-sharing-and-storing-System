import { Link } from "react-router-dom";
import { Shield, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";

const faqs = [
    {
        q: "What is this system?",
        a: "This is a secure file sharing platform that uses encryption and AI-based intrusion detection to protect files from unauthorized access and cyber attacks."
    },
    {
        q: "How are my files protected?",
        a: "Your files are protected using AES encryption, secure authentication, and access control. Only authorized users can access them."
    },
    {
        q: "What is AI-based intrusion detection?",
        a: "The system uses Machine Learning to monitor user behavior like login attempts and file access. If suspicious activity is detected, the system generates an alert."
    },
    {
        q: "Can I share files with other users?",
        a: "Yes. You can share files with specific users, generate secure share links, and control access permissions."
    },
    {
        q: "Who can see my shared files?",
        a: "Only users you allow or users with a secure share link (if enabled). Unauthorized users cannot access your files."
    },
    {
        q: "Are files encrypted during upload?",
        a: "Yes. Files are automatically encrypted before storage and decrypted only when accessed by authorized users."
    },
    {
        q: "What happens if suspicious activity is detected?",
        a: "The system will generate an intrusion alert, notify the admin, and log the activity for security monitoring."
    },
    {
        q: "Can the admin monitor system activity?",
        a: "Yes. Admin can view user activity logs, monitor intrusion alerts, and manage users."
    },
    {
        q: "Is my password stored securely?",
        a: "Yes. Passwords are stored using secure hashing (bcrypt / SHA-256) and cannot be viewed by anyone."
    },
    {
        q: "Can I access my files anytime?",
        a: "Yes. You can securely access your files anytime after login."
    },
    {
        q: "What happens if I forget my password?",
        a: "You can reset your password using the Forgot Password option."
    },
    {
        q: "Is this system used in real life?",
        a: "Yes. Similar systems are used in IT Companies, Banks, Hospitals, and Cloud storage platforms."
    },
    {
        q: "What technologies are used in this project?",
        a: "This system uses React, Node.js, TypeScript, Machine Learning, Encryption (AES), and a Supabase PostgreSQL Database."
    },
    {
        q: "Is file sharing secure?",
        a: "Yes. File sharing is protected using encryption, access control, and secure sharing links."
    },
    {
        q: "Why should I use this system?",
        a: "Because it provides secure file storage, AI-based attack detection, safe file sharing, and protection from cyber threats."
    },
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="border border-border/50 rounded-xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
            >
                <span className="font-medium text-foreground pr-4">
                    {index + 1}. {question}
                </span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            </button>
            <>
                {open && (
                    <div
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 text-muted-foreground leading-relaxed">
                            {answer}
                        </div>
                    </div>
                )}
            </>
        </div>
    );
}

export default function FAQ() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Navbar */}
            <Navbar />

            {/* FAQ Content */}
            <section className="pt-32 pb-20 px-4">
                <div className="container mx-auto max-w-3xl">
                    <div
                        className="text-center mb-12"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Everything you need to know about SecureVault's AI-powered secure file sharing system.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} question={faq.q} answer={faq.a} index={i} />
                        ))}
                    </div>

                    {/* CTA */}
                    <div
                        className="text-center mt-16 p-8 rounded-2xl bg-secondary/20 border border-border/50"
                    >
                        <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
                        <p className="text-muted-foreground mb-6">Get started for free and explore the platform yourself.</p>
                        <div className="flex items-center justify-center gap-4">
                            <Link to="/register">
                                <Button className="rounded-full px-6">Get Started</Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="rounded-full px-6">Log In</Button>
                            </Link>
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
