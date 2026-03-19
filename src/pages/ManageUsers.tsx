import { Search, Plus, MoreVertical, Shield, UserCheck, UserX } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { authFetch } from "@/lib/authFetch";
import { useToast } from "@/hooks/use-toast";

interface User {
    user_id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

export default function ManageUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Dialog states
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [showActivateDialog, setShowActivateDialog] = useState(false);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [newRole, setNewRole] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await authFetch('/api/users');
            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();
            setUsers(data || []);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to fetch users",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async () => {
        if (!selectedUser || !newRole) return;

        try {
            const response = await authFetch(`/api/admin/user/${selectedUser.user_id}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });

            if (!response.ok) throw new Error("Failed to update role");

            setUsers(users.map(u =>
                u.user_id === selectedUser.user_id ? { ...u, role: newRole } : u
            ));

            toast({
                title: "Success",
                description: `User role updated to ${newRole}`,
            });

            setShowRoleDialog(false);
            setSelectedUser(null);
            setNewRole("");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update role",
                variant: "destructive",
            });
        }
    };

    const activateUser = async () => {
        if (!selectedUser) return;

        try {
            console.log('[ACTIVATE] Calling activate endpoint for user:', selectedUser.user_id);
            
            const response = await authFetch(
                `/api/admin/user/${selectedUser.user_id}/activate`,
                { 
                    method: "PUT",
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log('[ACTIVATE] Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('[ACTIVATE] Error response:', errorData);
                throw new Error(errorData.details || errorData.error || "Failed to activate user");
            }

            const result = await response.json();
            console.log('[ACTIVATE] Success response:', result);

            setUsers(users.map(u =>
                u.user_id === selectedUser.user_id ? { ...u, status: 'active' } : u
            ));

            toast({
                title: "Success",
                description: `${selectedUser.username} has been activated`,
            });

            setShowActivateDialog(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('[ACTIVATE] Exception:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to activate user",
                variant: "destructive",
            });
        }
    };

    const suspendUser = async () => {
        if (!selectedUser) return;

        try {
            console.log('[SUSPEND] Calling suspend endpoint for user:', selectedUser.user_id);
            
            const response = await authFetch(
                `/api/admin/user/${selectedUser.user_id}/suspend`,
                { 
                    method: "PUT",
                    headers: { "Content-Type": "application/json" }
                }
            );

            console.log('[SUSPEND] Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('[SUSPEND] Error response:', errorData);
                throw new Error(errorData.details || errorData.error || "Failed to suspend user");
            }

            const result = await response.json();
            console.log('[SUSPEND] Success response:', result);

            setUsers(users.map(u =>
                u.user_id === selectedUser.user_id ? { ...u, status: 'suspended' } : u
            ));

            toast({
                title: "Success",
                description: `${selectedUser.username} has been suspended`,
            });

            setShowSuspendDialog(false);
            setSelectedUser(null);
        } catch (error) {
            console.error('[SUSPEND] Exception:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to suspend user",
                variant: "destructive",
            });
        }
    };

    const getRoleColor = (role: string) => {
        return role === "admin" ? "destructive" : "secondary";
    };

    const getStatusColor = (status: string) => {
        if (status === "active") return "default";
        if (status === "suspended") return "destructive";
        return "secondary";
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
                        <p className="text-muted-foreground">
                            Manage user accounts, roles, and permissions
                        </p>
                    </div>
                    <Button variant="glow">
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>

                {/* Search and Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by username or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
                        <CardDescription>All registered users and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin">
                                    <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                                </div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No users found
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user.user_id}
                                        className="glass-card p-4 hover:border-primary/30 transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3 flex-1">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarFallback className="bg-primary/20 text-primary">
                                                        {user.email.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-foreground truncate">{user.username}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-popover border-border">
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setNewRole(user.role);
                                                            setShowRoleDialog(true);
                                                        }}
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        Edit Permissions
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer"
                                                        disabled={user.status === "active"}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowActivateDialog(true);
                                                        }}
                                                    >
                                                        <UserCheck className="w-4 h-4 mr-2" />
                                                        Activate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="cursor-pointer text-destructive"
                                                        disabled={user.status === "suspended"}
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowSuspendDialog(true);
                                                        }}
                                                    >
                                                        <UserX className="w-4 h-4 mr-2" />
                                                        Suspend
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <Badge variant={getRoleColor(user.role)}>
                                                {user.role}
                                            </Badge>
                                            <Badge variant={getStatusColor(user.status)}>
                                                {user.status}
                                            </Badge>
                                        </div>

                                        <p className="text-xs text-muted-foreground">
                                            Created: {new Date(user.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Permissions Dialog */}
                <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                    {showRoleDialog && selectedUser && (
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit User Permissions</DialogTitle>
                                <DialogDescription>
                                    Change role for {selectedUser.username}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Role</label>
                                    <Select value={newRole} onValueChange={setNewRole}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowRoleDialog(false);
                                            setSelectedUser(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={updateUserRole}>
                                        Update Permissions
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    )}
                </Dialog>

                {/* Activate Dialog */}
                <AlertDialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                    {showActivateDialog && selectedUser && (
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Activate User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to activate {selectedUser.username}? This user will regain access to the system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2 justify-end">
                                <AlertDialogCancel
                                    onClick={() => {
                                        setShowActivateDialog(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={activateUser}>
                                    Activate User
                                </AlertDialogAction>
                            </div>
                        </AlertDialogContent>
                    )}
                </AlertDialog>

                {/* Suspend Dialog */}
                <AlertDialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                    {showSuspendDialog && selectedUser && (
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Suspend User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to suspend {selectedUser.username}? This user will lose access to the system.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2 justify-end">
                                <AlertDialogCancel
                                    onClick={() => {
                                        setShowSuspendDialog(false);
                                        setSelectedUser(null);
                                    }}
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={suspendUser}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Suspend User
                                </AlertDialogAction>
                            </div>
                        </AlertDialogContent>
                    )}
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
}
