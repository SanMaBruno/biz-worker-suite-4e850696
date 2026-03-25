import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, formatCurrency, getFullName, type Contract } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ContractWithEmployee extends Contract {
  employee?: { first_name: string; last_name: string; rut: string; id: string };
}

export default function ContractsList() {
  const [contracts, setContracts] = useState<ContractWithEmployee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadContracts(); }, []);

  async function loadContracts() {
    const { data } = await supabase
      .from('contracts')
      .select('*, employee:employees(id, first_name, last_name, rut)')
      .order('start_date', { ascending: false });
    setContracts((data || []) as any);
    setLoading(false);
  }

  const filtered = contracts.filter((c) => {
    const q = search.toLowerCase();
    const empName = c.employee ? getFullName(c.employee) : '';
    return empName.toLowerCase().includes(q) || c.contract_type.toLowerCase().includes(q) || (c.employee?.rut || '').includes(q);
  });

  const statusMap: Record<string, { label: string; cls: string }> = {
    active: { label: 'Vigente', cls: 'bg-success/10 text-success' },
    terminated: { label: 'Terminado', cls: 'bg-destructive/10 text-destructive' },
    suspended: { label: 'Suspendido', cls: 'bg-warning/10 text-warning' },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Contratos</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestión de contratos laborales.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por trabajador, tipo o RUT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Trabajador</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Tipo</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Inicio</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Término</th>
                <th className="text-right p-3 font-medium text-muted-foreground hidden lg:table-cell">Sueldo</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Sin contratos encontrados.</td></tr>
              ) : filtered.map((c) => {
                const st = statusMap[c.status] || statusMap.active;
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3">
                      {c.employee ? (
                        <Link to={`/admin/rrhh/employees/${c.employee.id}`} className="font-medium text-accent hover:underline">
                          {getFullName(c.employee)}
                        </Link>
                      ) : '-'}
                      <p className="text-xs text-muted-foreground">{c.employee?.rut}</p>
                    </td>
                    <td className="p-3">{c.contract_type}</td>
                    <td className="p-3 hidden md:table-cell">{formatDate(c.start_date)}</td>
                    <td className="p-3 hidden md:table-cell">{c.end_date ? formatDate(c.end_date) : 'Indefinido'}</td>
                    <td className="p-3 text-right tabular-nums hidden lg:table-cell">{formatCurrency(c.salary)}</td>
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
