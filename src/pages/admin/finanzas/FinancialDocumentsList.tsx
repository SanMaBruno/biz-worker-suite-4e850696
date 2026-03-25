import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDate, formatCurrency } from '@/types/domain';
import { Input } from '@/components/ui/input';
import { Search, FileText } from 'lucide-react';

interface FinancialDocument {
  id: string;
  title: string;
  description?: string;
  document_date: string;
  amount?: number;
  file_name?: string;
  category?: { name: string };
}

export default function FinancialDocumentsList() {
  const [documents, setDocuments] = useState<FinancialDocument[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    const { data } = await supabase
      .from('financial_documents')
      .select('*, category:document_categories(name)')
      .order('document_date', { ascending: false });
    setDocuments((data || []) as any);
    setLoading(false);
  }

  const filtered = documents.filter((d) => {
    const q = search.toLowerCase();
    return d.title.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Documentos Financieros</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestión de documentos financieros de la empresa.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por título..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
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
                  {(doc.category as any)?.name || 'Sin categoría'} · {formatDate(doc.document_date)}
                  {doc.amount ? ` · ${formatCurrency(doc.amount)}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
