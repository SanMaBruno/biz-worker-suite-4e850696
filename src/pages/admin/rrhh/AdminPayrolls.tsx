import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, MONTH_NAMES, getFullName, type Payroll } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminPayrolls() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPayrolls(); }, []);

  async function loadPayrolls() {
    const { data } = await supabase
      .from('payrolls')
      .select('*, employee:employees(first_name, last_name, rut)')
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false });
    setPayrolls((data || []) as any);
    setLoading(false);
  }

  const filtered = payrolls.filter((p) => {
    const q = search.toLowerCase();
    const empName = p.employee ? getFullName(p.employee) : '';
    return empName.toLowerCase().includes(q) || `${MONTH_NAMES[p.period_month - 1]} ${p.period_year}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Liquidaciones</h1>
        <p className="text-muted-foreground text-sm mt-1">Administración de liquidaciones de sueldo.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por trabajador o período..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Trabajador</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Período</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Bruto</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Descuentos</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Líquido</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <p className="font-medium">{p.employee ? getFullName(p.employee) : '-'}</p>
                    <p className="text-xs text-muted-foreground">{p.employee?.rut}</p>
                  </td>
                  <td className="p-3">{MONTH_NAMES[p.period_month - 1]} {p.period_year}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(p.gross_salary)}</td>
                  <td className="p-3 text-right tabular-nums text-destructive">{formatCurrency(p.total_deductions)}</td>
                  <td className="p-3 text-right tabular-nums font-semibold">{formatCurrency(p.net_salary)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'paid' ? 'bg-success/10 text-success' : p.status === 'approved' ? 'bg-info/10 text-info' : 'bg-muted text-muted-foreground'
                    }`}>{p.status === 'paid' ? 'Pagada' : p.status === 'approved' ? 'Aprobada' : 'Borrador'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
