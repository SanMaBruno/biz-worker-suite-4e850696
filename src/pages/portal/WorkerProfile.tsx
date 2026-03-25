import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';
import { AvatarUploader } from '@/components/shared/AvatarUploader';
import type { Employee } from '@/types/domain';
import { formatDate, formatCurrency } from '@/types/domain';

export default function WorkerProfile() {
  const { user, profile } = useAuth();
  const { uploadAvatar, removeAvatar } = useAvatarUpload();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('employees')
      .select('*, company:companies(name), branch:branches(name), department:departments(name), position:positions(name)')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => setEmployee(data as any));
  }, [user]);

  useEffect(() => {
    setAvatarUrl(profile?.avatar_url || null);
  }, [profile?.avatar_url]);

  const handleUpload = async (file: File) => {
    const url = await uploadAvatar(file);
    setAvatarUrl(url);
  };

  const handleRemove = async () => {
    await removeAvatar();
    setAvatarUrl(null);
  };

  if (!employee) return <div className="text-center py-12 text-muted-foreground">Cargando perfil...</div>;

  const fullName = `${employee.first_name} ${employee.last_name}`;

  const fields = [
    { label: 'Nombre completo', value: fullName },
    { label: 'RUT', value: employee.rut },
    { label: 'Email', value: employee.email },
    { label: 'Teléfono', value: employee.phone || '-' },
    { label: 'Dirección', value: employee.address || '-' },
    { label: 'Empresa', value: employee.company?.name || '-' },
    { label: 'Sucursal', value: employee.branch?.name || '-' },
    { label: 'Departamento', value: employee.department?.name || '-' },
    { label: 'Cargo', value: employee.position?.name || '-' },
    { label: 'Fecha ingreso', value: formatDate(employee.hire_date) },
    { label: 'Sueldo base', value: formatCurrency(employee.base_salary) },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">Información personal y laboral.</p>
      </div>

      <div className="flex justify-center py-4">
        <AvatarUploader
          currentUrl={avatarUrl}
          name={fullName}
          size="lg"
          onUpload={handleUpload}
          onRemove={handleRemove}
        />
      </div>

      <div className="bg-card rounded-lg border divide-y">
        {fields.map((f) => (
          <div key={f.label} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-muted-foreground">{f.label}</span>
            <span className="text-sm font-medium text-right">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
