import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, type LaborDocument } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download } from 'lucide-react';
import { logAuditAction } from '@/services/auditService';

export default function WorkerDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<LaborDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadDocs();
  }, [user]);

  async function loadDocs() {
    const { data: emp } = await supabase.from('employees').select('id').eq('user_id', user!.id).single();
    if (!emp) { setLoading(false); return; }

    const { data } = await supabase
      .from('labor_documents')
      .select('*, category:document_categories(name)')
      .eq('employee_id', emp.id)
      .order('created_at', { ascending: false });

    setDocuments((data || []) as any);
    setLoading(false);
  }

  const handleDownload = async (doc: LaborDocument) => {
    await logAuditAction({
      action: 'download_document',
      module: 'portal',
      entityType: 'labor_document',
      entityId: doc.id,
    });
    alert('Descarga simulada: ' + doc.title);
  };

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    (d.category as any)?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Mis Documentos</h1>
        <p className="text-muted-foreground text-sm mt-1">Documentos laborales disponibles para consulta.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar documento..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
        </div>
        <div className="divide-y">
          {loading ? (
            <div className="p-6 text-center text-muted-foreground">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">No se encontraron documentos.</div>
          ) : filtered.map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-muted/20 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {(doc.category as any)?.name || 'Sin categoría'} · {formatDate(doc.created_at)}
                </p>
              </div>
              <button
                onClick={() => handleDownload(doc)}
                className="text-accent hover:text-accent/80 flex-shrink-0"
                title="Descargar"
              >
                <Download size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
