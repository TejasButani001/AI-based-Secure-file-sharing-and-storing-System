import { Link, useLocation } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  FolderLock,
  Bell,
  Activity,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Upload,
  UserCircle,
  Database,
  FileCheck,
  Share2,
  Lock,
  Server
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ["admin", "user"] },


    { icon: FolderLock, label: "My Files", path: "/my-files", roles: ["admin", "user"] },
    { icon: Share2, label: "Shared Files", path: "/shared-files", roles: ["admin", "user"] },
    { icon: Bell, label: "Alerts", path: "/alerts", roles: ["admin", "user"] },
    { icon: UserCircle, label: "Profile", path: "/profile", roles: ["admin", "user"] },

    // Admin Only
    { icon: Activity, label: "Activity", path: "/activity", roles: ["admin"] },
    { icon: Users, label: "Manage Users", path: "/manage-users", roles: ["admin"] }, // Replaced /users with /manage-users or keep both? Using manage-users as per req
    { icon: FileCheck, label: "Audit Logs", path: "/audit-logs", roles: ["admin"] },
    { icon: Shield, label: "Access Control", path: "/access-control", roles: ["admin"] },
    { icon: Lock, label: "Security Settings", path: "/security-settings", roles: ["admin"] },
    { icon: LayoutDashboard, label: "Admin Dashboard", path: "/admin-dashboard", roles: ["admin"] },
    { icon: Database, label: "DB Monitor", path: "/database-monitor", roles: ["admin"] },
    { icon: Server, label: "ML Dashboard", path: "/ml-dashboard", roles: ["admin"] },
    { icon: Settings, label: "Settings", path: "/settings", roles: ["admin", "user"] },
  ];

  const filteredNavItems = navItems.filter(item =>
    user && item.roles.includes(user.role)
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-foreground">SecureVault</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <div className="px-3 py-2 flex items-center justify-between">
          {!collapsed && <p className="text-xs text-muted-foreground">Logged in as: <span className="font-semibold">{user?.name} ({user?.role})</span></p>}
          <div className={collapsed ? "mx-auto" : ""}>
            <ModeToggle />
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border hover:bg-sidebar-accent"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </Button>
    </aside>
  );
}
