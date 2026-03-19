import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/authFetch";
import { useState, useEffect } from "react";
import { Search, Shield, Plus, Trash2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
    user_id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

interface File {
    file_id: number;
    file_name: string;
    owner_id: number;
    size: number;
    upload_time: string;
}

interface FileAccess {
    permission_id: number;
    file_id: number;
    user_id: number;
    access_type: string;
}

export default function AccessControl() {
    const [users, setUsers] = useState<User[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [fileAccess, setFileAccess] = useState<FileAccess[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleDialog, setShowRoleDialog] = useState(false);
    const [showAccessDialog, setShowAccessDialog] = useState(false);
    const [newRole, setNewRole] = useState("");
    const [selectedFile, setSelectedFile] = useState<number | null>(null);
    const [selectedAccessType, setSelectedAccessType] = useState("read");
    const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await authFetch("/api/admin/access-control");
            if (!response.ok) {
                throw new Error("Failed to fetch access control data");
            }
            const data = await response.json();
            setUsers(data.users || []);
            setFiles(data.files || []);
            setFileAccess(data.fileAccess || []);
            toast({
                title: "Success",
                description: "Access control data loaded",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to load data",
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

    const grantFileAccess = async () => {
        if (!selectedUser || !selectedFile || !selectedAccessType) return;

        try {
            const response = await authFetch("/api/admin/file-access", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileId: selectedFile,
                    userId: selectedUser.user_id,
                    accessType: selectedAccessType,
                }),
            });

            if (!response.ok) throw new Error("Failed to grant access");

            const newAccess = await response.json();
            setFileAccess([...fileAccess, newAccess.data]);

            toast({
                title: "Success",
                description: `Granted ${selectedAccessType} access to file`,
            });

            setShowAccessDialog(false);
            setSelectedUser(null);
            setSelectedFile(null);
            setSelectedAccessType("read");
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to grant access",
                variant: "destructive",
            });
        }
    };

    const revokeFileAccess = async (permissionId: number) => {
        try {
            const response = await authFetch(`/api/admin/file-access/${permissionId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to revoke access");

            setFileAccess(fileAccess.filter(fa => fa.permission_id !== permissionId));

            toast({
                title: "Success",
                description: "File access revoked",
            });

            setPermissionToDelete(null);
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to revoke access",
                variant: "destructive",
            });
        }
    };

    const getRoleColor = (role: string) => {
        return role === "admin" ? "destructive" : "secondary";
    };

    const getAccessColor = (access: string) => {
        if (access === "admin") return "destructive";
        if (access === "write") return "default";
        return "secondary";
    };

    const getStatusColor = (status: string) => {
        return status === "active" ? "default" : "secondary";
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getUserFileAccess = (userId: number) => {
        return fileAccess.filter(fa => fa.user_id === userId);
    };

    const getFileOwnerName = (ownerId: number) => {
        return users.find(u => u.user_id === ownerId)?.username || "Unknown";
    };

    return (
        <DashboardLayout>
            <div className="p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Access Control</h1>
                        <p className="text-muted-foreground">
                            Manage user roles and file permissions
                        </p>
                    </div>
                    <Button onClick={fetchData} disabled={loading} variant="outline">
                        Refresh Data
                    </Button>
                </div>

                {/* Info Alert */}
                <Alert className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Total Users: {users.length} | Admins: {users.filter(u => u.role === "admin").length} | Files: {files.length}
                    </AlertDescription>
                </Alert>

                {/* Tabs */}
                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="users">User Management</TabsTrigger>
                        <TabsTrigger value="permissions">File Permissions</TabsTrigger>
                    </TabsList>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        {/* Search */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Search Users</CardTitle>
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

                        {/* Users Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Users ({filteredUsers.length})</CardTitle>
                                <CardDescription>View and manage user roles</CardDescription>
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
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Username</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead>Created</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredUsers.map((user) => (
                                                    <TableRow key={user.user_id}>
                                                        <TableCell className="font-medium">
                                                            {user.username}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {user.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getRoleColor(user.role)}>
                                                                <Shield className="w-3 h-3 mr-1" />
                                                                {user.role}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={getStatusColor(user.status)}>
                                                                {user.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            {new Date(user.created_at).toLocaleDateString()}
                                                        </TableCell>
                                                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                            <Dialog 
                                                                open={showRoleDialog && selectedUser?.user_id === user.user_id} 
                                                                onOpenChange={(open) => {
                                                                    if (!open) {
                                                                        setShowRoleDialog(false);
                                                                        setSelectedUser(null);
                                                                    }
                                                                }}
                                                            >
                                                                <DialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedUser(user);
                                                                            setNewRole(user.role);
                                                                            setShowRoleDialog(true);
                                                                        }}
                                                                    >
                                                                        Change Role
                                                                    </Button>
                                                                </DialogTrigger>
                                                                {showRoleDialog && selectedUser?.user_id === user.user_id && (
                                                                    <DialogContent>
                                                                        <DialogHeader>
                                                                            <DialogTitle>Change User Role</DialogTitle>
                                                                            <DialogDescription>
                                                                                Update role for {selectedUser?.username}
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="space-y-4">
                                                                            <div>
                                                                                <label className="text-sm font-medium">New Role</label>
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
                                                                                <Button variant="outline" onClick={() => {
                                                                                    setShowRoleDialog(false);
                                                                                    setSelectedUser(null);
                                                                                }}>
                                                                                    Cancel
                                                                                </Button>
                                                                                <Button onClick={updateUserRole}>
                                                                                    Update Role
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </DialogContent>
                                                                )}
                                                            </Dialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Permissions Tab */}
                    <TabsContent value="permissions" className="space-y-6">
                        {/* Grant Access Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5" />
                                    Grant File Access
                                </CardTitle>
                                <CardDescription>Give users access to specific files</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Dialog 
                                    open={showAccessDialog} 
                                    onOpenChange={(open) => {
                                        if (!open) {
                                            setShowAccessDialog(false);
                                            setSelectedFile(null);
                                            setSelectedAccessType("read");
                                        }
                                    }}
                                >
                                    <DialogTrigger asChild>
                                        <Button 
                                            variant="default"
                                            onClick={() => setShowAccessDialog(true)}
                                        >
                                            Grant New Access
                                        </Button>
                                    </DialogTrigger>
                                    {showAccessDialog && (
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Grant File Access</DialogTitle>
                                                <DialogDescription>
                                                    Select a user and file to grant access
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-sm font-medium">User</label>
                                                    <Select
                                                        value={selectedUser?.user_id?.toString() || ""}
                                                        onValueChange={(value) => {
                                                            const user = users.find(u => u.user_id === parseInt(value));
                                                            setSelectedUser(user || null);
                                                        }}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a user" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {users.map(user => (
                                                                <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                                                    {user.username} ({user.email})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">File</label>
                                                    <Select
                                                        value={selectedFile?.toString() || ""}
                                                        onValueChange={(value) => setSelectedFile(parseInt(value))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a file" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {files.map(file => (
                                                                <SelectItem key={file.file_id} value={file.file_id.toString()}>
                                                                    {file.file_name} (by {getFileOwnerName(file.owner_id)})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium">Access Type</label>
                                                    <Select value={selectedAccessType} onValueChange={setSelectedAccessType}>
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="read">Read Only</SelectItem>
                                                            <SelectItem value="write">Read & Write</SelectItem>
                                                            <SelectItem value="admin">Admin</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="flex gap-2 justify-end">
                                                    <Button 
                                                        variant="outline" 
                                                        onClick={() => {
                                                            setShowAccessDialog(false);
                                                            setSelectedFile(null);
                                                            setSelectedAccessType("read");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={grantFileAccess} disabled={!selectedUser || !selectedFile}>
                                                        Grant Access
                                                    </Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    )}
                                </Dialog>
                            </CardContent>
                        </Card>

                        {/* Current Permissions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">File Access Permissions ({fileAccess.length})</CardTitle>
                                <CardDescription>Current user file access permissions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin">
                                            <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
                                        </div>
                                    </div>
                                ) : fileAccess.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No file access permissions set
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User</TableHead>
                                                    <TableHead>File</TableHead>
                                                    <TableHead>Access Type</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {fileAccess.map((access) => {
                                                    const user = users.find(u => u.user_id === access.user_id);
                                                    const file = files.find(f => f.file_id === access.file_id);
                                                    return (
                                                        <TableRow key={access.permission_id}>
                                                            <TableCell className="font-medium">
                                                                {user?.username || "Unknown"}
                                                            </TableCell>
                                                            <TableCell className="text-sm">
                                                                {file?.file_name || "Unknown"}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={getAccessColor(access.access_type)}>
                                                                    {access.access_type}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                                {permissionToDelete === access.permission_id ? (
                                                                    <AlertDialog open={true} onOpenChange={(open) => {
                                                                        if (!open) setPermissionToDelete(null);
                                                                    }}>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Revoke Access</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Are you sure you want to revoke {user?.username}'s access to {file?.file_name}?
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <div className="flex gap-2 justify-end">
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => revokeFileAccess(access.permission_id)}
                                                                                    className="bg-destructive"
                                                                                >
                                                                                    Revoke
                                                                                </AlertDialogAction>
                                                                            </div>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                ) : null}
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setPermissionToDelete(access.permission_id)}
                                                                    className="text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
