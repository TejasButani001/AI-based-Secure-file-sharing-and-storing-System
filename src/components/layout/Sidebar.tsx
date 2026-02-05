
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
import { motion, AnimatePresence } from "framer-motion";

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
    { icon: Users, label: "Manage Users", path: "/manage-users", roles: ["admin"] },
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
    <motion.aside
      initial={{ width: 256 }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar/80 backdrop-blur-xl border-r border-sidebar-border/50 flex flex-col z-50 shadow-2xl shadow-black/5",
        collapsed ? "items-center" : ""
      )}
    >
      {/* Logo */}
      <div className={cn("h-20 flex items-center px-4 border-b border-sidebar-border/50", collapsed ? "justify-center" : "justify-between")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-lg tracking-tight whitespace-nowrap"
              >
                SecureVault
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto no-scrollbar">
        {filteredNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative group block"
            >
              <div className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative z-10",
                isActive ? "text-primary dark:text-white" : "text-muted-foreground hover:text-foreground",
                collapsed && "justify-center px-0"
              )}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", isActive && "text-primary dark:text-blue-400")} />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border/50 space-y-2 bg-sidebar/50">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user?.name || "User"}</span>
              <span className="text-xs text-muted-foreground truncate capitalize">{user?.role || "Guest"}</span>
            </div>
          )}
          <ModeToggle />
        </div>

        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-24 w-8 h-8 rounded-full bg-background border border-border shadow-md hover:bg-accent hover:text-accent-foreground z-50"
      >
        <motion.div
          animate={{ rotate: collapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.div>
      </Button>
    </motion.aside>
  );
}
