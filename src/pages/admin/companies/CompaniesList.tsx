import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, Building2 } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  rut: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
}

export default function CompaniesList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCompanies(); }, []);

  async function loadCompanies() {
    const { data } = await supabase.from('companies').select('*').order('name');
    setCompanies((data || []) as Company[]);
    setLoading(false);
  }

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.rut.includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Empresas</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestión de empresas del sistema.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o RUT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Empresa</th>
                <th className="text-left p-3 font-medium text-muted-foreground">RUT</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Teléfono</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Sin empresas encontradas.</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Building2 size={16} />
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-3 tabular-nums">{c.rut}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{c.email || '-'}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{c.phone || '-'}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>{c.is_active ? 'Activa' : 'Inactiva'}</span>
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
