import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, getFullName, type LaborDocument } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LaborDocWithEmployee extends LaborDocument {
  employee?: { id: string; first_name: string; last_name: string };
}

export default function LaborDocumentsList() {
  const [documents, setDocuments] = useState<LaborDocWithEmployee[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    const { data } = await supabase
      .from('labor_documents')
      .select('*, category:document_categories(name), employee:employees(id, first_name, last_name)')
      .order('created_at', { ascending: false });
    setDocuments((data || []) as any);
    setLoading(false);
  }

  const filtered = documents.filter((d) => {
    const q = search.toLowerCase();
    const empName = d.employee ? getFullName(d.employee) : '';
    return d.title.toLowerCase().includes(q) || empName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Documentos Laborales</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestión de documentos laborales de trabajadores.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por título o trabajador..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} registros</span>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">Sin documentos encontrados.</div>
          ) : filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.employee ? (
                    <Link to={`/admin/rrhh/employees/${doc.employee.id}`} className="text-accent hover:underline">
                      {getFullName(doc.employee)}
                    </Link>
                  ) : 'Sin asignar'}
                  {' · '}{(doc.category as any)?.name || 'Sin categoría'} · {formatDate(doc.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
