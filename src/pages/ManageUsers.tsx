import { Search, Plus, MoreVertical, Shield, UserCheck, UserX } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

export default function ManageUsers() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/users')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch");
            })
            .then(data => setUsers(data))
            .catch(err => console.error("Failed to fetch users", err));
    }, []);

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage user accounts and permissions
                        </p>
                    </div>
                    <Button variant="glow">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>

                {/* Search */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input placeholder="Search users..." className="pl-10" />
                    </div>
                </div>

                {/* Users Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map((user) => (
                        <div key={user.id} className="glass-card p-4 hover:border-primary/30 transition-all duration-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-10 h-10">
                                        <AvatarFallback className="bg-primary/20 text-primary">
                                            {user.email.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium text-foreground">{user.name || "User"}</p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border-border">
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Shield className="w-4 h-4 mr-2" />
                                            Edit Permissions
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <UserCheck className="w-4 h-4 mr-2" />
                                            Activate
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer text-destructive">
                                            <UserX className="w-4 h-4 mr-2" />
                                            Suspend
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span
                                    className={
                                        user.role === "admin"
                                            ? "secure-badge"
                                            : "px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs"
                                    }
                                >
                                    {user.role}
                                </span>
                                <span
                                    className="text-success"
                                >
                                    Active
                                </span>
                            </div>

                            <p className="text-xs text-muted-foreground mt-3">
                                Created: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
