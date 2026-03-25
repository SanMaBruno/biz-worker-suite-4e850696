import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Search, Shield } from 'lucide-react';
import type { AppRole } from '@/types/domain';

interface UserWithRoles {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: AppRole[];
}

const roleLabels: Record<AppRole, { label: string; cls: string }> = {
  superadmin: { label: 'Superadmin', cls: 'bg-primary/10 text-primary' },
  rrhh: { label: 'RRHH', cls: 'bg-info/10 text-info' },
  finanzas: { label: 'Finanzas', cls: 'bg-success/10 text-success' },
  trabajador: { label: 'Trabajador', cls: 'bg-muted text-muted-foreground' },
};

export default function UsersRoles() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  async function loadUsers() {
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*').order('last_name'),
      supabase.from('user_roles').select('*'),
    ]);

    const profiles = profilesRes.data || [];
    const roles = rolesRes.data || [];

    const merged: UserWithRoles[] = profiles.map((p: any) => ({
      ...p,
      roles: roles.filter((r: any) => r.user_id === p.user_id).map((r: any) => r.role as AppRole),
    }));

    setUsers(merged);
    setLoading(false);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Usuarios y Roles</h1>
        <p className="text-muted-foreground text-sm mt-1">Gestión de usuarios y asignación de roles del sistema.</p>
      </div>

      <div className="data-table-container">
        <div className="filter-bar">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} usuarios</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Usuario</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Roles</th>
                <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Cargando...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">Sin usuarios encontrados.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold flex-shrink-0">
                        {u.first_name[0]}{u.last_name[0]}
                      </div>
                      <span className="font-medium">{u.first_name} {u.last_name}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{u.email}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {u.roles.map((role) => {
                        const rl = roleLabels[role];
                        return (
                          <span key={role} className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${rl.cls}`}>
                            {rl.label}
                          </span>
                        );
                      })}
                      {u.roles.length === 0 && <span className="text-xs text-muted-foreground">Sin rol</span>}
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>{u.is_active ? 'Activo' : 'Inactivo'}</span>
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
