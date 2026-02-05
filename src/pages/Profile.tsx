
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Calendar, Hash, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserProfile {
    user_id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
    last_login: string | null;
    status: string;
}

export default function Profile() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("No session found");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!res.ok) throw new Error("Failed to fetch profile");

                const data = await res.json();
                setProfile(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-10 max-w-5xl mx-auto min-h-[calc(100vh-4rem)] flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        My Profile
                    </h1>
                    <p className="text-muted-foreground text-lg mt-2">
                        Manage your account settings and preferences
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="p-6 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20">
                        Error: {error}
                    </div>
                ) : profile ? (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {/* Hero Card */}
                        <motion.div variants={item} className="md:col-span-1">
                            <div className="h-full p-8 rounded-3xl bg-card border border-border/50 shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-blue-600 p-1 mb-6 shadow-2xl shadow-primary/20">
                                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                            {/* Placeholder Avatar - could connect to real image if implemented */}
                                            <span className="text-4xl font-bold text-primary">
                                                {profile.username.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-1">{profile.username}</h2>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                        <Shield className="w-3 h-3 mr-1.5" />
                                        {profile.role.toUpperCase()}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl border-destructive/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-colors"
                                        onClick={logout}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Details Grid */}
                        <motion.div variants={item} className="md:col-span-2 space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { label: "Email Address", value: profile.email, icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
                                    { label: "User ID", value: `#${profile.user_id.toString().padStart(4, '0')}`, icon: Hash, color: "text-purple-500", bg: "bg-purple-500/10" },
                                    { label: "Member Since", value: formatDate(profile.created_at), icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                    { label: "Last Login", value: profile.last_login ? formatDate(profile.last_login) : "First Session", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -2, transition: { duration: 0.2 } }}
                                        className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all"
                                    >
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                                                <stat.icon className="w-5 h-5" />
                                            </div>
                                            <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                                        </div>
                                        <div className="text-lg font-semibold truncate" title={stat.value}>
                                            {stat.value}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Account Status */}
                            <motion.div
                                variants={item}
                                className="p-8 rounded-3xl bg-gradient-to-br from-card to-secondary/30 border border-border/50"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-lg">Account Status</h3>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-xs font-semibold capitalize",
                                        profile.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                    )}>
                                        {profile.status}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Verification Level</span>
                                        <span className="font-medium">Level 2 (Verified)</span>
                                    </div>
                                    <div className="w-full bg-secondary/50 h-2 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-full rounded-full" />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Your account is fully verified and has access to all standard features.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </div>
        </DashboardLayout>
    );
}
