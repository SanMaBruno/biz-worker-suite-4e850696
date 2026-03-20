import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency, MONTH_NAMES, type Payroll, type PayrollItem } from '@/types/domain';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { logAuditAction } from '@/services/auditService';

export default function WorkerPayrollDetail() {
  const { id } = useParams<{ id: string }>();
  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [items, setItems] = useState<PayrollItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    loadPayroll();
  }, [id]);

  async function loadPayroll() {
    const [payrollRes, itemsRes] = await Promise.all([
      supabase.from('payrolls').select('*').eq('id', id!).single(),
      supabase.from('payroll_items').select('*').eq('payroll_id', id!).order('sort_order'),
    ]);
    setPayroll(payrollRes.data as Payroll | null);
    setItems((itemsRes.data || []) as PayrollItem[]);
    setLoading(false);
  }

  const handleDownload = async () => {
    await logAuditAction({
      action: 'download_payroll',
      module: 'portal',
      entityType: 'payroll',
      entityId: id,
    });
    // In a real app, this would generate or download a PDF
    alert('Descarga de PDF simulada. En producción se generaría el PDF de liquidación.');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (!payroll) {
    return <div className="text-center py-12 text-muted-foreground">Liquidación no encontrada.</div>;
  }

  const earnings = items.filter((i) => i.type === 'earning');
  const deductions = items.filter((i) => i.type === 'deduction');

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <Link to="/portal/payrolls" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">
            Liquidación {MONTH_NAMES[payroll.period_month - 1]} {payroll.period_year}
          </h1>
          <p className="text-sm text-muted-foreground">Detalle de haberes y descuentos</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-xs text-muted-foreground uppercase">Bruto</p>
          <p className="text-xl font-bold tabular-nums mt-1">{formatCurrency(payroll.gross_salary)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground uppercase">Descuentos</p>
          <p className="text-xl font-bold tabular-nums mt-1 text-destructive">{formatCurrency(payroll.total_deductions)}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs text-muted-foreground uppercase">Líquido</p>
          <p className="text-xl font-bold tabular-nums mt-1 text-accent">{formatCurrency(payroll.net_salary)}</p>
        </div>
      </div>

      {/* Items */}
      <div className="data-table-container">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Haberes</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {earnings.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3">{item.concept}</td>
                <td className="p-3 text-right tabular-nums font-medium">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            <tr className="bg-muted/30 font-semibold">
              <td className="p-3">Total Haberes</td>
              <td className="p-3 text-right tabular-nums">{formatCurrency(payroll.gross_salary)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="data-table-container">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-sm">Descuentos</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {deductions.map((item) => (
              <tr key={item.id} className="border-b last:border-0">
                <td className="p-3">{item.concept}</td>
                <td className="p-3 text-right tabular-nums font-medium text-destructive">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
            <tr className="bg-muted/30 font-semibold">
              <td className="p-3">Total Descuentos</td>
              <td className="p-3 text-right tabular-nums text-destructive">{formatCurrency(payroll.total_deductions)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button onClick={handleDownload} className="gap-2">
        <Download size={16} />
        Descargar PDF
      </Button>
    </div>
  );
}
