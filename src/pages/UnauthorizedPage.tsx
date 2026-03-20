import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl font-bold text-muted-foreground">403</div>
        <h1 className="text-2xl font-semibold">Acceso Denegado</h1>
        <p className="text-muted-foreground">
          No tiene permisos para acceder a esta sección.
        </p>
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
