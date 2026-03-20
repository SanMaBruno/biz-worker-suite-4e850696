import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Users, FileText, DollarSign, Settings, LogOut,
  Menu, X, ChevronDown, Building2, Shield, ClipboardList
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  children?: { label: string; path: string }[];
}

export default function BackofficeLayout() {
  const { profile, roles, signOut, hasAnyRole } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
  ];

  if (hasAnyRole('superadmin', 'rrhh')) {
    navItems.push({
      label: 'Recursos Humanos',
      path: '/admin/rrhh',
      icon: <Users size={18} />,
      children: [
        { label: 'Trabajadores', path: '/admin/rrhh/employees' },
        { label: 'Contratos', path: '/admin/rrhh/contracts' },
        { label: 'Liquidaciones', path: '/admin/rrhh/payrolls' },
        { label: 'Documentos', path: '/admin/rrhh/documents' },
      ],
    });
  }

  if (hasAnyRole('superadmin', 'finanzas')) {
    navItems.push({
      label: 'Finanzas',
      path: '/admin/finanzas',
      icon: <DollarSign size={18} />,
      children: [
        { label: 'Pagos', path: '/admin/finanzas/payments' },
        { label: 'Documentos', path: '/admin/finanzas/documents' },
      ],
    });
  }

  if (hasAnyRole('superadmin')) {
    navItems.push(
      {
        label: 'Empresas',
        path: '/admin/companies',
        icon: <Building2 size={18} />,
      },
      {
        label: 'Seguridad',
        path: '/admin/security',
        icon: <Shield size={18} />,
        children: [
          { label: 'Usuarios y Roles', path: '/admin/security/users' },
          { label: 'Auditoría', path: '/admin/security/audit' },
        ],
      }
    );
  }

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="flex min-h-screen">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-200
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-2">
            <ClipboardList size={22} className="text-sidebar-primary" />
            <span className="font-semibold text-sm">Backoffice</span>
          </Link>
          <button className="lg:hidden text-sidebar-foreground" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {navItems.map((item) => (
            <div key={item.path}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === item.path ? null : item.path)}
                    className={`w-full sidebar-nav-item-inactive justify-between ${
                      isActive(item.path) ? '!bg-sidebar-accent !text-sidebar-primary' : ''
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${expandedMenu === item.path ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedMenu === item.path && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(child.path)
                              ? 'text-sidebar-primary font-medium'
                              : 'text-sidebar-foreground/70 hover:text-sidebar-foreground'
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={isActive(item.path) && item.path === location.pathname ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="text-xs truncate">
              <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-sidebar-foreground/60 capitalize">{roles.join(', ')}</p>
            </div>
            <button onClick={signOut} className="text-sidebar-foreground/60 hover:text-sidebar-foreground">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="text-sm text-muted-foreground ml-auto">
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
