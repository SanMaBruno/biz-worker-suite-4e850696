import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, formatCurrency, getFullName, MONTH_NAMES, type Employee, type Contract, type Payroll, type LaborDocument } from '@/types/domain';
import { ArrowLeft, User, FileText, Briefcase } from 'lucide-react';

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [documents, setDocuments] = useState<LaborDocument[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'contracts' | 'payrolls' | 'documents'>('info');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from('employees').select('*, company:companies(name), branch:branches(name), department:departments(name), position:positions(name)').eq('id', id).single(),
      supabase.from('contracts').select('*').eq('employee_id', id).order('start_date', { ascending: false }),
      supabase.from('payrolls').select('*').eq('employee_id', id).order('period_year', { ascending: false }).order('period_month', { ascending: false }),
      supabase.from('labor_documents').select('*, category:document_categories(name)').eq('employee_id', id).order('created_at', { ascending: false }),
    ]).then(([empRes, contRes, payRes, docRes]) => {
      setEmployee(empRes.data as any);
      setContracts((contRes.data || []) as Contract[]);
      setPayrolls((payRes.data || []) as Payroll[]);
      setDocuments((docRes.data || []) as any);
    });
  }, [id]);

  if (!employee) return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;

  const tabs = [
    { key: 'info', label: 'Información', icon: <User size={16} /> },
    { key: 'contracts', label: 'Contratos', icon: <Briefcase size={16} /> },
    { key: 'payrolls', label: 'Liquidaciones', icon: <FileText size={16} /> },
    { key: 'documents', label: 'Documentos', icon: <FileText size={16} /> },
  ] as const;

  const infoFields = [
    { label: 'RUT', value: employee.rut },
    { label: 'Email', value: employee.email },
    { label: 'Teléfono', value: employee.phone || '-' },
    { label: 'Dirección', value: employee.address || '-' },
    { label: 'Fecha nacimiento', value: employee.birth_date ? formatDate(employee.birth_date) : '-' },
    { label: 'Fecha ingreso', value: formatDate(employee.hire_date) },
    { label: 'Empresa', value: employee.company?.name || '-' },
    { label: 'Sucursal', value: employee.branch?.name || '-' },
    { label: 'Departamento', value: employee.department?.name || '-' },
    { label: 'Cargo', value: employee.position?.name || '-' },
    { label: 'Sueldo base', value: formatCurrency(employee.base_salary) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/admin/rrhh/employees" className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-bold">{getFullName(employee)}</h1>
          <p className="text-sm text-muted-foreground">{employee.position?.name || 'Sin cargo'} · {employee.rut}</p>
        </div>
        <span className={`ml-auto inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${employee.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
          {employee.is_active ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="bg-card rounded-lg border divide-y">
          {infoFields.map((f) => (
            <div key={f.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="text-sm font-medium">{f.value}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'contracts' && (
        <div className="data-table-container">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Tipo</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Inicio</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Término</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Sueldo</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
            </tr></thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="p-3">{c.contract_type}</td>
                  <td className="p-3">{formatDate(c.start_date)}</td>
                  <td className="p-3">{c.end_date ? formatDate(c.end_date) : 'Indefinido'}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(c.salary)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>{c.status === 'active' ? 'Vigente' : c.status === 'terminated' ? 'Terminado' : 'Suspendido'}</span>
                  </td>
                </tr>
              ))}
              {contracts.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Sin contratos registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'payrolls' && (
        <div className="data-table-container">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Período</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Bruto</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Descuentos</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Líquido</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
            </tr></thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3">{MONTH_NAMES[p.period_month - 1]} {p.period_year}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(p.gross_salary)}</td>
                  <td className="p-3 text-right tabular-nums text-destructive">{formatCurrency(p.total_deductions)}</td>
                  <td className="p-3 text-right tabular-nums font-medium">{formatCurrency(p.net_salary)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'paid' ? 'bg-success/10 text-success' : p.status === 'approved' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                    }`}>{p.status === 'paid' ? 'Pagada' : p.status === 'approved' ? 'Aprobada' : 'Borrador'}</span>
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Sin liquidaciones.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="data-table-container">
          <div className="divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">{(doc.category as any)?.name || 'Sin categoría'} · {formatDate(doc.created_at)}</p>
                </div>
              </div>
            ))}
            {documents.length === 0 && <div className="p-6 text-center text-muted-foreground">Sin documentos.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
