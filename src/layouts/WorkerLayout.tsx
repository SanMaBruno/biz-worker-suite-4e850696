import { Link, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, FileText, FolderOpen, User, LogOut, Menu, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

function getInitials(firstName?: string, lastName?: string) {
  return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();
}

export default function WorkerLayout() {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Inicio', path: '/portal', icon: <LayoutDashboard size={18} /> },
    { label: 'Liquidaciones', path: '/portal/payrolls', icon: <FileText size={18} /> },
    { label: 'Documentos', path: '/portal/documents', icon: <FolderOpen size={18} /> },
    { label: 'Mi Perfil', path: '/portal/profile', icon: <User size={18} /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-sm">Portal del Trabajador</span>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-foreground/20 font-medium'
                    : 'hover:bg-primary-foreground/10'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Avatar className="h-7 w-7">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
              ) : null}
              <AvatarFallback className="text-[10px] bg-primary-foreground/20 text-primary-foreground">
                {getInitials(profile?.first_name, profile?.last_name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs opacity-80">{profile?.first_name} {profile?.last_name}</span>
            <button onClick={signOut} className="hover:opacity-80" title="Cerrar sesión">
              <LogOut size={16} />
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-primary-foreground/20 px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm ${
                  isActive(item.path) ? 'bg-primary-foreground/20 font-medium' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <button
              onClick={signOut}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full hover:bg-primary-foreground/10"
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
