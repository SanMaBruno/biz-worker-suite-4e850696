import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logAuditAction } from '@/services/auditService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error } = await signIn(email, password);
    if (error) {
      setError('Credenciales inválidas. Intente nuevamente.');
      setIsLoading(false);
    } else {
      await logAuditAction({ action: 'login', module: 'auth', details: { email } });
      navigate('/');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-balance">
            Portal Empresarial
          </h1>
          <p className="text-lg opacity-80">
            Gestión integral de recursos humanos, finanzas y documentación laboral.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {[
              { label: 'Liquidaciones', desc: 'Consulta y descarga' },
              { label: 'Documentos', desc: 'Gestión centralizada' },
              { label: 'RRHH', desc: 'Administración completa' },
              { label: 'Finanzas', desc: 'Control y trazabilidad' },
            ].map((item) => (
              <div key={item.label} className="bg-primary-foreground/10 rounded-lg p-4">
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs opacity-70 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground">
              Ingrese sus credenciales para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="correo@empresa.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
            <p className="font-medium">Credenciales de prueba:</p>
            <p>Admin: admin@empresa.cl / admin123</p>
            <p>RRHH: rrhh@empresa.cl / rrhh123</p>
            <p>Finanzas: finanzas@empresa.cl / finanzas123</p>
            <p>Trabajador: juan.perez@empresa.cl / trabajador123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
