
-- ============================================
-- ENTERPRISE PLATFORM - DATABASE SCHEMA
-- ============================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('superadmin', 'rrhh', 'finanzas', 'trabajador');
CREATE TYPE public.contract_status AS ENUM ('active', 'terminated', 'suspended');
CREATE TYPE public.payroll_status AS ENUM ('draft', 'approved', 'paid', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'reversed');
CREATE TYPE public.document_type AS ENUM ('labor', 'financial', 'contract', 'payroll', 'other');

-- 2. TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. COMPANIES
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rut TEXT UNIQUE NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- 4. BRANCHES
CREATE TABLE public.branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- 5. DEPARTMENTS
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 6. POSITIONS
CREATE TABLE public.positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- 7. PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 8. USER ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 9. PERMISSIONS
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- 10. ROLE_PERMISSIONS
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role app_role NOT NULL,
  permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (role, permission_id)
);
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- 11. EMPLOYEES
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_id UUID NOT NULL REFERENCES public.companies(id),
  branch_id UUID REFERENCES public.branches(id),
  department_id UUID REFERENCES public.departments(id),
  position_id UUID REFERENCES public.positions(id),
  rut TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  birth_date DATE,
  hire_date DATE NOT NULL,
  termination_date DATE,
  base_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_employees_company ON public.employees(company_id);
CREATE INDEX idx_employees_user ON public.employees(user_id);
CREATE INDEX idx_employees_rut ON public.employees(rut);

-- 12. CONTRACTS
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status contract_status NOT NULL DEFAULT 'active',
  salary NUMERIC(12,2) NOT NULL,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_contracts_employee ON public.contracts(employee_id);

-- 13. CONTRACT_AMENDMENTS
CREATE TABLE public.contract_amendments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  amendment_date DATE NOT NULL,
  description TEXT NOT NULL,
  new_salary NUMERIC(12,2),
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contract_amendments ENABLE ROW LEVEL SECURITY;

-- 14. DOCUMENT_CATEGORIES
CREATE TABLE public.document_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type document_type NOT NULL DEFAULT 'other',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.document_categories ENABLE ROW LEVEL SECURITY;

-- 15. LABOR_DOCUMENTS
CREATE TABLE public.labor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.document_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.labor_documents ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_labor_docs_employee ON public.labor_documents(employee_id);

-- 16. PAYROLLS
CREATE TABLE public.payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  period_year INT NOT NULL,
  period_month INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  gross_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  status payroll_status NOT NULL DEFAULT 'draft',
  notes TEXT,
  file_url TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (employee_id, period_year, period_month)
);
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_payrolls_employee ON public.payrolls(employee_id);
CREATE INDEX idx_payrolls_period ON public.payrolls(period_year, period_month);

-- 17. PAYROLL_ITEMS
CREATE TABLE public.payroll_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES public.payrolls(id) ON DELETE CASCADE,
  concept TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earning', 'deduction')),
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_taxable BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payroll_items ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_payroll_items_payroll ON public.payroll_items(payroll_id);

-- 18. FINANCIAL_DOCUMENTS
CREATE TABLE public.financial_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id),
  category_id UUID REFERENCES public.document_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  amount NUMERIC(14,2),
  document_date DATE NOT NULL,
  file_url TEXT,
  file_name TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.financial_documents ENABLE ROW LEVEL SECURITY;

-- 19. PAYMENTS
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID REFERENCES public.payrolls(id),
  employee_id UUID NOT NULL REFERENCES public.employees(id),
  amount NUMERIC(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'transfer',
  reference_number TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_payments_employee ON public.payments(employee_id);
CREATE INDEX idx_payments_payroll ON public.payments(payroll_id);

-- 20. AUDIT_LOGS
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_audit_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_action ON public.audit_logs(action);
CREATE INDEX idx_audit_created ON public.audit_logs(created_at DESC);

-- ============================================
-- SECURITY DEFINER FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_employee_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.employees WHERE user_id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_rrhh(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('superadmin', 'rrhh')
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_finanzas(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('superadmin', 'finanzas')
  )
$$;

-- ============================================
-- RLS POLICIES
-- ============================================

-- PROFILES
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Superadmin views all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);
CREATE POLICY "RRHH views all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'rrhh'
  )
);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System inserts profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- USER_ROLES
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Superadmin manages roles" ON public.user_roles FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'superadmin'
  )
);

-- PERMISSIONS
CREATE POLICY "Authenticated read permissions" ON public.permissions FOR SELECT TO authenticated USING (true);

-- ROLE_PERMISSIONS
CREATE POLICY "Authenticated read role_permissions" ON public.role_permissions FOR SELECT TO authenticated USING (true);

-- COMPANIES
CREATE POLICY "Authenticated read companies" ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages companies" ON public.companies FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- BRANCHES
CREATE POLICY "Authenticated read branches" ON public.branches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages branches" ON public.branches FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- DEPARTMENTS
CREATE POLICY "Authenticated read departments" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages departments" ON public.departments FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- POSITIONS
CREATE POLICY "Authenticated read positions" ON public.positions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages positions" ON public.positions FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- EMPLOYEES
CREATE POLICY "Workers view own employee record" ON public.employees FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_rrhh(auth.uid()));
CREATE POLICY "RRHH manages employees" ON public.employees FOR ALL USING (public.is_admin_or_rrhh(auth.uid()));

-- CONTRACTS
CREATE POLICY "Workers view own contracts" ON public.contracts FOR SELECT USING (employee_id = public.get_employee_id_for_user(auth.uid()) OR public.is_admin_or_rrhh(auth.uid()));
CREATE POLICY "RRHH manages contracts" ON public.contracts FOR ALL USING (public.is_admin_or_rrhh(auth.uid()));

-- CONTRACT_AMENDMENTS
CREATE POLICY "Workers view own amendments" ON public.contract_amendments FOR SELECT USING (contract_id IN (SELECT id FROM public.contracts WHERE employee_id = public.get_employee_id_for_user(auth.uid())) OR public.is_admin_or_rrhh(auth.uid()));
CREATE POLICY "RRHH manages amendments" ON public.contract_amendments FOR ALL USING (public.is_admin_or_rrhh(auth.uid()));

-- DOCUMENT_CATEGORIES
CREATE POLICY "Authenticated read doc categories" ON public.document_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin manages doc categories" ON public.document_categories FOR ALL USING (public.has_role(auth.uid(), 'superadmin'));

-- LABOR_DOCUMENTS
CREATE POLICY "Workers view own labor docs" ON public.labor_documents FOR SELECT USING (employee_id = public.get_employee_id_for_user(auth.uid()) OR public.is_admin_or_rrhh(auth.uid()));
CREATE POLICY "RRHH manages labor docs" ON public.labor_documents FOR ALL USING (public.is_admin_or_rrhh(auth.uid()));

-- PAYROLLS
CREATE POLICY "Workers view own payrolls" ON public.payrolls FOR SELECT USING (employee_id = public.get_employee_id_for_user(auth.uid()) OR public.is_admin_or_rrhh(auth.uid()) OR public.is_admin_or_finanzas(auth.uid()));
CREATE POLICY "RRHH manages payrolls" ON public.payrolls FOR ALL USING (public.is_admin_or_rrhh(auth.uid()));

-- PAYROLL_ITEMS
CREATE POLICY "Workers view own payroll items" ON public.payroll_items FOR SELECT USING (payroll_id IN (SELECT id FROM public.payrolls WHERE employee_id = public.get_employee_id_for_user(auth.uid())) OR public.is_admin_or_rrhh(auth.uid()) OR public.is_admin_or_finanzas(auth.uid()));
CREATE POLICY "RRHH manages payroll items" ON public.payroll_items FOR ALL USING (public.is_admin_or_rrhh(auth.uid()));

-- FINANCIAL_DOCUMENTS
CREATE POLICY "Finance views financial docs" ON public.financial_documents FOR SELECT USING (public.is_admin_or_finanzas(auth.uid()));
CREATE POLICY "Finance manages financial docs" ON public.financial_documents FOR ALL USING (public.is_admin_or_finanzas(auth.uid()));

-- PAYMENTS
CREATE POLICY "Workers view own payments" ON public.payments FOR SELECT USING (employee_id = public.get_employee_id_for_user(auth.uid()) OR public.is_admin_or_finanzas(auth.uid()));
CREATE POLICY "Finance manages payments" ON public.payments FOR ALL USING (public.is_admin_or_finanzas(auth.uid()));

-- AUDIT_LOGS
CREATE POLICY "Admin views audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "System inserts audit logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================
-- TRIGGERS
-- ============================================
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON public.branches FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_labor_documents_updated_at BEFORE UPDATE ON public.labor_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payrolls_updated_at BEFORE UPDATE ON public.payrolls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_financial_documents_updated_at BEFORE UPDATE ON public.financial_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- STORAGE BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Users can view documents they have access to" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents');

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'first_name', ''), COALESCE(NEW.raw_user_meta_data->>'last_name', ''), NEW.email);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
