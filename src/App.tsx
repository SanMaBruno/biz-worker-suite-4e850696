import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Eager: critical path
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";

// Lazy: all other pages
const NotFound = lazy(() => import("./pages/NotFound"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));
const BackofficeLayout = lazy(() => import("./layouts/BackofficeLayout"));
const WorkerLayout = lazy(() => import("./layouts/WorkerLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const EmployeesList = lazy(() => import("./pages/admin/rrhh/EmployeesList"));
const EmployeeDetail = lazy(() => import("./pages/admin/rrhh/EmployeeDetail"));
const AdminPayrolls = lazy(() => import("./pages/admin/rrhh/AdminPayrolls"));
const ContractsList = lazy(() => import("./pages/admin/rrhh/ContractsList"));
const LaborDocumentsList = lazy(() => import("./pages/admin/rrhh/LaborDocumentsList"));
const PaymentsList = lazy(() => import("./pages/admin/finanzas/PaymentsList"));
const FinancialDocumentsList = lazy(() => import("./pages/admin/finanzas/FinancialDocumentsList"));
const CompaniesList = lazy(() => import("./pages/admin/companies/CompaniesList"));
const AuditLogs = lazy(() => import("./pages/admin/security/AuditLogs"));
const UsersRoles = lazy(() => import("./pages/admin/security/UsersRoles"));
const WorkerDashboard = lazy(() => import("./pages/portal/WorkerDashboard"));
const WorkerPayrolls = lazy(() => import("./pages/portal/WorkerPayrolls"));
const WorkerPayrollDetail = lazy(() => import("./pages/portal/WorkerPayrollDetail"));
const WorkerDocuments = lazy(() => import("./pages/portal/WorkerDocuments"));
const WorkerProfile = lazy(() => import("./pages/portal/WorkerProfile"));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
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
                <Route path="rrhh/contracts" element={<ContractsList />} />
                <Route path="rrhh/documents" element={<LaborDocumentsList />} />
                <Route path="finanzas/payments" element={<PaymentsList />} />
                <Route path="finanzas/documents" element={<FinancialDocumentsList />} />
                <Route path="companies" element={<CompaniesList />} />
                <Route path="security/users" element={<UsersRoles />} />
                <Route path="security/audit" element={<AuditLogs />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
