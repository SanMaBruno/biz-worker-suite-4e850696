export type AppRole = 'superadmin' | 'rrhh' | 'finanzas' | 'trabajador';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
}

export interface UserWithRole extends UserProfile {
  roles: AppRole[];
}

export interface Employee {
  id: string;
  user_id?: string;
  company_id: string;
  branch_id?: string;
  department_id?: string;
  position_id?: string;
  rut: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  birth_date?: string;
  hire_date: string;
  termination_date?: string;
  base_salary: number;
  is_active: boolean;
  // Joined fields
  company?: { name: string };
  branch?: { name: string };
  department?: { name: string };
  position?: { name: string };
}

export interface Payroll {
  id: string;
  employee_id: string;
  period_year: number;
  period_month: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  status: 'draft' | 'approved' | 'paid' | 'cancelled';
  notes?: string;
  file_url?: string;
  employee?: { first_name: string; last_name: string; rut: string };
}

export interface PayrollItem {
  id: string;
  payroll_id: string;
  concept: string;
  type: 'earning' | 'deduction';
  amount: number;
  is_taxable: boolean;
  sort_order: number;
}

export interface Contract {
  id: string;
  employee_id: string;
  contract_type: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'terminated' | 'suspended';
  salary: number;
  description?: string;
  file_url?: string;
}

export interface LaborDocument {
  id: string;
  employee_id: string;
  category_id?: string;
  title: string;
  description?: string;
  file_url?: string;
  file_name?: string;
  created_at: string;
  category?: { name: string };
}

export interface Payment {
  id: string;
  payroll_id?: string;
  employee_id: string;
  amount: number;
  payment_date: string;
  payment_method: string;
  reference_number?: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  notes?: string;
  employee?: { first_name: string; last_name: string; rut: string };
}

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CL');
}

export function getFullName(obj: { first_name: string; last_name: string }): string {
  return `${obj.first_name} ${obj.last_name}`;
}
