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

import Alerts from "./pages/Alerts";
import AdminAlerts from "./pages/AdminAlerts";
import Activity from "./pages/Activity";

import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import FAQ from "./pages/FAQ";
import MLInfo from "./pages/MLInfo";
import Contact from "./pages/Contact";

import MyFiles from "./pages/MyFiles";
import SharedFiles from "./pages/SharedFiles";
import SharedFile from "./pages/SharedFile";
import AuditLogs from "./pages/AuditLogs";
import ManageUsers from "./pages/ManageUsers";
import AccessControl from "./pages/AccessControl";
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
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/ml-info" element={<MLInfo />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/share/:token" element={<SharedFile />} />

              {/* Protected Routes - Common */}
              <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Dashboard /></ProtectedRoute>} />


              <Route path="/my-files" element={<ProtectedRoute allowedRoles={["admin", "user"]}><MyFiles /></ProtectedRoute>} />
              <Route path="/shared-files" element={<ProtectedRoute allowedRoles={["admin", "user"]}><SharedFiles /></ProtectedRoute>} />
              <Route path="/alerts" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Alerts /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Profile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin", "user"]}><Settings /></ProtectedRoute>} />

              {/* Protected Routes - Admin Only */}
              <Route path="/activity" element={<ProtectedRoute allowedRoles={["admin"]}><Activity /></ProtectedRoute>} />
              <Route path="/admin-alerts" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAlerts /></ProtectedRoute>} />
              <Route path="/manage-users" element={<ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>} />
              <Route path="/audit-logs" element={<ProtectedRoute allowedRoles={["admin"]}><AuditLogs /></ProtectedRoute>} />
              <Route path="/access-control" element={<ProtectedRoute allowedRoles={["admin"]}><AccessControl /></ProtectedRoute>} />
              <Route path="/database-monitor" element={<ProtectedRoute allowedRoles={["admin"]}><DatabaseMonitor /></ProtectedRoute>} />

              {/* Legacy/Unused Routes or Catch-all */}

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
