import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Files from "./pages/Files";
import Alerts from "./pages/Alerts";
import Activity from "./pages/Activity";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Upload from "./pages/Upload";
import MyFiles from "./pages/MyFiles";
import SharedFiles from "./pages/SharedFiles";
import AuditLogs from "./pages/AuditLogs";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers from "./pages/ManageUsers";
import AccessControl from "./pages/AccessControl";
import SecuritySettings from "./pages/SecuritySettings";
import MlDashboard from "./pages/MlDashboard";
import Profile from "./pages/Profile";
import DatabaseMonitor from "./pages/DatabaseMonitor";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Routes - Common */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Dashboard /></ProtectedRoute>} />
              <Route path="/files" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Files /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Upload /></ProtectedRoute>} />
              <Route path="/my-files" element={<ProtectedRoute allowedRoles={["admin", "user"]}><MyFiles /></ProtectedRoute>} />
              <Route path="/shared-files" element={<ProtectedRoute allowedRoles={["admin", "user"]}><SharedFiles /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Alerts /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Settings /></ProtectedRoute>} />

              {/* Protected Routes - Admin Only */}
              <Route path="/activity" element={<ProtectedRoute allowedRoles={["admin"]}><Activity /></ProtectedRoute>} />
              <Route path="/manage-users" element={<ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>} />
              <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={["admin"]}><AuditLogs /></ProtectedRoute>} />
              <Route path="/access-control" element={<ProtectedRoute allowedRoles={["admin"]}><AccessControl /></ProtectedRoute>} />
              <Route path="/security-settings" element={<ProtectedRoute allowedRoles={["admin"]}><SecuritySettings /></ProtectedRoute>} />
              <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/ml-dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><MlDashboard /></ProtectedRoute>} />
              <Route path="/database-monitor" element={<ProtectedRoute allowedRoles={["admin"]}><DatabaseMonitor /></ProtectedRoute>} />

              {/* Legacy/Unused Routes or Catch-all */}
              <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
