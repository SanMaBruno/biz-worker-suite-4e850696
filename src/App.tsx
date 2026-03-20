import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import BackofficeLayout from "./layouts/BackofficeLayout";
import WorkerLayout from "./layouts/WorkerLayout";

import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeesList from "./pages/admin/rrhh/EmployeesList";
import EmployeeDetail from "./pages/admin/rrhh/EmployeeDetail";
import AdminPayrolls from "./pages/admin/rrhh/AdminPayrolls";
import PaymentsList from "./pages/admin/finanzas/PaymentsList";
import AuditLogs from "./pages/admin/security/AuditLogs";

import WorkerDashboard from "./pages/portal/WorkerDashboard";
import WorkerPayrolls from "./pages/portal/WorkerPayrolls";
import WorkerPayrollDetail from "./pages/portal/WorkerPayrollDetail";
import WorkerDocuments from "./pages/portal/WorkerDocuments";
import WorkerProfile from "./pages/portal/WorkerProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Worker Portal */}
            <Route path="/portal" element={<ProtectedRoute allowedRoles={['trabajador']}><WorkerLayout /></ProtectedRoute>}>
              <Route index element={<WorkerDashboard />} />
              <Route path="payrolls" element={<WorkerPayrolls />} />
              <Route path="payrolls/:id" element={<WorkerPayrollDetail />} />
              <Route path="documents" element={<WorkerDocuments />} />
              <Route path="profile" element={<WorkerProfile />} />
            </Route>

            {/* Backoffice */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['superadmin', 'rrhh', 'finanzas']}><BackofficeLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="rrhh/employees" element={<EmployeesList />} />
              <Route path="rrhh/employees/:id" element={<EmployeeDetail />} />
              <Route path="rrhh/payrolls" element={<AdminPayrolls />} />
              <Route path="finanzas/payments" element={<PaymentsList />} />
              <Route path="security/audit" element={<AuditLogs />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
