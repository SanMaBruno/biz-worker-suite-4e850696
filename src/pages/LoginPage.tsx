import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput } from '@/components/ui/password-input';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { FeatureCard } from '@/components/ui/feature-card';
import { logAuditAction } from '@/services/auditService';
import { FileText, Users, DollarSign, ShieldCheck, Loader2 } from 'lucide-react';
import loginHero from '@/assets/login-hero.jpg';

const features = [
  { icon: FileText, label: 'Liquidaciones', description: 'Consulta y descarga de liquidaciones históricas en PDF' },
  { icon: Users, label: 'Recursos Humanos', description: 'Gestión integral de trabajadores, contratos y documentos' },
  { icon: DollarSign, label: 'Finanzas', description: 'Control financiero con trazabilidad de pagos y movimientos' },
  { icon: ShieldCheck, label: 'Seguridad', description: 'Auditoría completa, roles y permisos granulares' },
];

function LoginHero() {
  return (
    <div className="relative flex h-full w-full items-end bg-primary">
      <img
        src={loginHero}
        alt="Plataforma empresarial digital"
        className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
        width={1024}
        height={1408}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/30" />

      {/* Content */}
      <div className="relative z-10 w-full p-8 lg:p-12 xl:p-16 space-y-8 animate-slide-in-left">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1.5 text-xs font-medium text-accent-foreground backdrop-blur-sm border border-accent/20">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            Plataforma activa
          </div>
          <h1 className="text-3xl lg:text-4xl xl:text-[2.75rem] font-bold leading-[1.15] text-primary-foreground text-balance">
            Portal Empresarial
          </h1>
          <p className="text-base lg:text-lg text-primary-foreground/70 max-w-md leading-relaxed">
            Gestión integral de recursos humanos, finanzas y documentación laboral en una plataforma unificada.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <FeatureCard key={f.label} icon={f.icon} label={f.label} description={f.description} />
          ))}
        </div>

        <p className="text-xs text-primary-foreground/40 pt-2">
          © {new Date().getFullYear()} Portal Empresarial · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
      setError('Credenciales inválidas. Verifique su correo y contraseña.');
      setIsLoading(false);
    } else {
      await logAuditAction({ action: 'login', module: 'auth', details: { email } });
      navigate('/');
    }
  };

  return (
    <AuthLayout hero={<LoginHero />}>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="text-sm text-muted-foreground">
            Ingrese sus credenciales para acceder al sistema
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
              autoFocus
              className="h-11"
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <button
                type="button"
                className="text-xs text-accent hover:text-accent/80 font-medium transition-colors"
                tabIndex={-1}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-describedby={error ? "login-error" : undefined}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground cursor-pointer">
              Recordarme
            </Label>
          </div>

          {error && (
            <div
              id="login-error"
              role="alert"
              className="flex items-start gap-2 text-sm text-destructive bg-destructive/8 border border-destructive/20 rounded-lg p-3"
            >
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 text-sm font-semibold"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Ingresando…
              </>
            ) : (
              'Ingresar'
            )}
          </Button>
        </form>

        {/* Test credentials */}
        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Credenciales de prueba
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-muted-foreground font-body">
            <div><span className="font-medium text-foreground/70">Admin:</span> admin@empresa.cl</div>
            <div><span className="font-medium text-foreground/70">RRHH:</span> rrhh@empresa.cl</div>
            <div><span className="font-medium text-foreground/70">Finanzas:</span> finanzas@empresa.cl</div>
            <div><span className="font-medium text-foreground/70">Trabajador:</span> juan.perez@empresa.cl</div>
            <div className="sm:col-span-2 pt-1 text-muted-foreground/60">Contraseña: admin123 / rrhh123 / finanzas123 / trabajador123</div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
