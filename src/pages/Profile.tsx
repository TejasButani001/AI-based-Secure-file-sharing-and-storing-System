import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { User, Mail, Save } from "lucide-react";

export default function Profile() {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setEmail(data.email);
                    setRole(data.role);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const token = localStorage.getItem("token");
            const res = await fetch("/api/auth/me", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setMessage("Profile updated successfully");
            } else {
                setMessage("Failed to update profile");
            }
        } catch (error) {
            setMessage("Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>

                <div className="max-w-md bg-card rounded-lg border border-border p-6 shadow-sm">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm text-muted-foreground mb-1.5 block">Role</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        value={role}
                                        disabled
                                        className="pl-10 bg-muted/50"
                                    />
                                </div>
                            </div>

                            {message && (
                                <p className={`text-sm ${message.includes("success") ? "text-green-500" : "text-destructive"}`}>
                                    {message}
                                </p>
                            )}

                            <Button type="submit" variant="glow" className="w-full" disabled={saving}>
                                <Save className="w-4 h-4 mr-2" />
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
