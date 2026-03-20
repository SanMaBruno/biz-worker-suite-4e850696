import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, MONTH_NAMES, type Payroll } from '@/types/domain';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function WorkerPayrolls() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadPayrolls();
  }, [user]);

  async function loadPayrolls() {
    const { data: emp } = await supabase.from('employees').select('id').eq('user_id', user!.id).single();
    if (!emp) { setLoading(false); return; }

    const { data } = await supabase
      .from('payrolls')
      .select('*')
      .eq('employee_id', emp.id)
      .order('period_year', { ascending: false })
      .order('period_month', { ascending: false });

    setPayrolls((data || []) as Payroll[]);
    setLoading(false);
  }

  const filtered = payrolls.filter((p) => {
    const periodStr = `${MONTH_NAMES[p.period_month - 1]} ${p.period_year}`.toLowerCase();
    return periodStr.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Mis Liquidaciones</h1>
        <p className="text-muted-foreground text-sm mt-1">Historial completo de liquidaciones de sueldo.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar período..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
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
                <th className="text-center p-3 font-medium text-muted-foreground">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No se encontraron liquidaciones.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-medium">{MONTH_NAMES[p.period_month - 1]} {p.period_year}</td>
                  <td className="p-3 text-right tabular-nums">{formatCurrency(p.gross_salary)}</td>
                  <td className="p-3 text-right tabular-nums text-destructive">{formatCurrency(p.total_deductions)}</td>
                  <td className="p-3 text-right tabular-nums font-semibold">{formatCurrency(p.net_salary)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === 'paid' ? 'bg-success/10 text-success' :
                      p.status === 'approved' ? 'bg-info/10 text-info' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {p.status === 'paid' ? 'Pagada' : p.status === 'approved' ? 'Aprobada' : 'Borrador'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <Link to={`/portal/payrolls/${p.id}`} className="text-accent hover:underline text-xs">
                      Ver detalle
                    </Link>
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
