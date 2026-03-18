import { Link } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
                href={`/#${item.toLowerCase()}`}
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
              href={`/#${item.toLowerCase()}`}
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
  );
}
