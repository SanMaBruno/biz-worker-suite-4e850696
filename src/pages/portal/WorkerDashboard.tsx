import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, MONTH_NAMES } from '@/types/domain';
import { FileText, FolderOpen, DollarSign, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkerDashboard() {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({ payrolls: 0, documents: 0, lastNet: 0 });
  const [recentPayrolls, setRecentPayrolls] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    // Get employee id
    const { data: emp } = await supabase
      .from('employees')
      .select('id')
      .eq('user_id', user!.id)
      .single();
    if (!emp) return;

    const [payrollRes, docsRes] = await Promise.all([
      supabase.from('payrolls').select('*').eq('employee_id', emp.id).order('period_year', { ascending: false }).order('period_month', { ascending: false }),
      supabase.from('labor_documents').select('id').eq('employee_id', emp.id),
    ]);

    const payrolls = payrollRes.data || [];
    setRecentPayrolls(payrolls.slice(0, 5));
    setStats({
      payrolls: payrolls.length,
      documents: docsRes.data?.length || 0,
      lastNet: payrolls[0]?.net_salary || 0,
    });
  }

  const statCards = [
    { label: 'Última Liquidación', value: formatCurrency(stats.lastNet), icon: <DollarSign size={20} />, color: 'text-accent' },
    { label: 'Liquidaciones', value: stats.payrolls.toString(), icon: <FileText size={20} />, color: 'text-info' },
    { label: 'Documentos', value: stats.documents.toString(), icon: <FolderOpen size={20} />, color: 'text-success' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">
          Bienvenido, {profile?.first_name}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Aquí puedes consultar tus liquidaciones y documentos laborales.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold mt-1 tabular-nums">{card.value}</p>
              </div>
              <div className={card.color}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="data-table-container">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-sm">Últimas Liquidaciones</h2>
          <Link to="/portal/payrolls" className="text-xs text-accent hover:underline">Ver todas</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Período</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Bruto</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Descuentos</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Líquido</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentPayrolls.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <Link to={`/portal/payrolls/${p.id}`} className="text-accent hover:underline">
                      {MONTH_NAMES[p.period_month - 1]} {p.period_year}
                    </Link>
                  </td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(p.gross_salary)}</td>
                  <td className="p-3 text-right tabular-nums text-destructive">{formatCurrency(p.total_deductions)}</td>
                  <td className="p-3 text-right tabular-nums font-medium">{formatCurrency(p.net_salary)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'paid' ? 'bg-success/10 text-success' :
                      p.status === 'approved' ? 'bg-info/10 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {p.status === 'paid' ? 'Pagada' : p.status === 'approved' ? 'Aprobada' : p.status === 'draft' ? 'Borrador' : 'Cancelada'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentPayrolls.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No hay liquidaciones disponibles.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
