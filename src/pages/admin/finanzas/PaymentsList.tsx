import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, formatDate, getFullName, type Payment } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function PaymentsList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPayments(); }, []);

  async function loadPayments() {
    const { data } = await supabase
      .from('payments')
      .select('*, employee:employees(first_name, last_name, rut)')
      .order('payment_date', { ascending: false });
    setPayments((data || []) as any);
    setLoading(false);
  }

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const empName = p.employee ? getFullName(p.employee) : '';
    return empName.toLowerCase().includes(q) || (p.reference_number || '').toLowerCase().includes(q);
  });

  const statusMap: Record<string, { label: string; cls: string }> = {
    completed: { label: 'Completado', cls: 'bg-success/10 text-success' },
    pending: { label: 'Pendiente', cls: 'bg-warning/10 text-warning' },
    failed: { label: 'Fallido', cls: 'bg-destructive/10 text-destructive' },
    reversed: { label: 'Reversado', cls: 'bg-muted text-muted-foreground' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Pagos</h1>
        <p className="text-muted-foreground text-sm mt-1">Registro y trazabilidad de pagos realizados.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por trabajador o referencia..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Trabajador</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Monto</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Método</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Referencia</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.map((p) => {
                const st = statusMap[p.status] || statusMap.pending;
                return (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      <p className="font-medium">{p.employee ? getFullName(p.employee) : '-'}</p>
                    </td>
                    <td className="p-3">{formatDate(p.payment_date)}</td>
                    <td className="p-3 text-right tabular-nums font-medium">{formatCurrency(p.amount)}</td>
                    <td className="p-3 hidden md:table-cell capitalize">{p.payment_method}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">{p.reference_number || '-'}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${st.cls}`}>{st.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
