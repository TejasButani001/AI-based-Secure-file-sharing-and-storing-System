import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

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


    return (
        <DashboardLayout>
            <div className="p-4 lg:p-6 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">
                        My Profile
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your account settings
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : error ? (
                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm">
                        Error: {error}
                    </div>
                ) : profile ? (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Hero Card */}
                        <div className="md:col-span-1">
                            <div className="h-full p-4 rounded-lg bg-card border border-border shadow-sm">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 p-1 mb-4 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-primary">
                                            {profile.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-bold mb-1">{profile.username}</h2>
                                    <div className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                                        <Shield className="w-3 h-3 mr-1" />
                                        {profile.role.toUpperCase()}
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full rounded-lg text-xs"
                                        onClick={logout}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-3">
                                {[
                                    { label: "Email Address", value: profile.email, icon: Mail, color: "text-blue-500", bg: "bg-blue-500/10" },
                                    { label: "User ID", value: `#${profile.user_id.toString().padStart(4, '0')}`, icon: Hash, color: "text-purple-500", bg: "bg-purple-500/10" },
                                    { label: "Member Since", value: formatDate(profile.created_at), icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                    { label: "Last Login", value: profile.last_login ? formatDate(profile.last_login) : "First Session", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
                                ].map((stat, i) => (
                                    <div
                                        key={i}
                                        className="p-3 rounded-lg bg-card border border-border shadow-sm"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={cn("p-1.5 rounded", stat.bg, stat.color)}>
                                                <stat.icon className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</span>
                                        </div>
                                        <div className="text-sm font-semibold truncate" title={stat.value}>
                                            {stat.value}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Account Status */}
                            <div className="p-4 rounded-lg bg-card border border-border">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-sm">Account Status</h3>
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-semibold capitalize",
                                        profile.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                                    )}>
                                        {profile.status}
                                    </span>
                                </div>
                                <div className="space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Verification Level</span>
                                        <span className="font-medium">Level 2 (Verified)</span>
                                    </div>
                                    <div className="w-full bg-secondary/50 h-1 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-full rounded-full" />
                                    </div>
                                    <p className="text-muted-foreground">
                                        Your account is fully verified and has access to all standard features.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </DashboardLayout>
    );
}
