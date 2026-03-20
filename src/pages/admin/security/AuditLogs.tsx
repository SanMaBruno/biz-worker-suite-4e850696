import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  module: string;
  entity_type?: string;
  details?: any;
  created_at: string;
}

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLogs(); }, []);

  async function loadLogs() {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    setLogs((data || []) as AuditLog[]);
    setLoading(false);
  }

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return l.action.toLowerCase().includes(q) || l.module.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Auditoría</h1>
        <p className="text-muted-foreground text-sm mt-1">Registro de acciones del sistema.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por acción o módulo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Acción</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Módulo</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Entidad</th>
              <th className="text-left p-3 font-medium text-muted-foreground hidden lg:table-cell">Detalles</th>
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Sin registros.</td></tr>
              ) : filtered.map((l) => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 text-xs tabular-nums">{new Date(l.created_at).toLocaleString('es-CL')}</td>
                  <td className="p-3 font-medium">{l.action}</td>
                  <td className="p-3 capitalize">{l.module}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{l.entity_type || '-'}</td>
                  <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground max-w-xs truncate">
                    {l.details ? JSON.stringify(l.details) : '-'}
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
