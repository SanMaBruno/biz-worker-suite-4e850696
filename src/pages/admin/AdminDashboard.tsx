import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/types/domain';
import { Users, FileText, DollarSign, Building2 } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ employees: 0, payrolls: 0, payments: 0, companies: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from('employees').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('payrolls').select('id', { count: 'exact', head: true }),
      supabase.from('payments').select('id', { count: 'exact', head: true }),
      supabase.from('companies').select('id', { count: 'exact', head: true }),
    ]).then(([emp, pay, pmt, comp]) => {
      setStats({
        employees: emp.count || 0,
        payrolls: pay.count || 0,
        payments: pmt.count || 0,
        companies: comp.count || 0,
      });
    });
  }, []);

  const cards = [
    { label: 'Trabajadores Activos', value: stats.employees, icon: <Users size={22} />, color: 'text-accent' },
    { label: 'Liquidaciones', value: stats.payrolls, icon: <FileText size={22} />, color: 'text-info' },
    { label: 'Pagos Registrados', value: stats.payments, icon: <DollarSign size={22} />, color: 'text-success' },
    { label: 'Empresas', value: stats.companies, icon: <Building2 size={22} />, color: 'text-warning' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground text-sm mt-1">Resumen general del sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{card.label}</p>
                <p className="text-3xl font-bold mt-2 tabular-nums">{card.value}</p>
              </div>
              <div className={card.color}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
