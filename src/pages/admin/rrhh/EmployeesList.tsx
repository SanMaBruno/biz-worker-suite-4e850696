import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency, type Employee, getFullName } from '@/types/domain';
import { Link } from 'react-router-dom';

export default function EmployeesList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadEmployees(); }, []);

  async function loadEmployees() {
    const { data } = await supabase
      .from('employees')
      .select('*, company:companies(name), department:departments(name), position:positions(name)')
      .order('last_name');
    setEmployees((data || []) as any);
    setLoading(false);
  }

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return getFullName(e).toLowerCase().includes(q) || e.rut.includes(q) || e.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trabajadores</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestión de personal de la empresa.</p>
        </div>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre, RUT o email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left p-3 font-medium text-muted-foreground">RUT</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Cargo</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Departamento</th>
                <th className="text-right p-3 font-medium text-muted-foreground hidden lg:table-cell">Sueldo Base</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.map((emp) => (
                <tr key={emp.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <Link to={`/admin/rrhh/employees/${emp.id}`} className="font-medium text-accent hover:underline">
                      {getFullName(emp)}
                    </Link>
                    <p className="text-xs text-muted-foreground">{emp.email}</p>
                  </td>
                  <td className="p-3 tabular-nums">{emp.rut}</td>
                  <td className="p-3 hidden md:table-cell">{emp.position?.name || '-'}</td>
                  <td className="p-3 hidden lg:table-cell">{emp.department?.name || '-'}</td>
                  <td className="p-3 text-right tabular-nums hidden lg:table-cell">{formatCurrency(emp.base_salary)}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      emp.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {emp.is_active ? 'Activo' : 'Inactivo'}
                    </span>
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
