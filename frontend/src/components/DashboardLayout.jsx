import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Activity, LogOut, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Leads', icon: LayoutDashboard, end: true },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/activity', label: 'Activity Log', icon: Activity },
];

export default function DashboardLayout({ children }) {
  const { email, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const SidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between gap-2 px-5 border-b border-border shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#1E3A8A] flex items-center justify-center shrink-0">
            <Users size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-ink truncate">Mini CRM</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-ink-soft hover:bg-bg"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-soft text-brand'
                  : 'text-ink-soft hover:bg-bg hover:text-ink'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-brand-soft flex items-center justify-center text-brand text-xs font-semibold shrink-0">
            {email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-ink truncate">{email}</p>
            <p className="text-[11px] text-ink-soft">Admin</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:bg-bg hover:text-coral transition"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border bg-surface flex-col">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 max-w-[80vw] bg-surface border-r border-border flex flex-col h-full shadow-2xl">
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-lg text-ink-soft hover:bg-bg"
          >
            <Menu size={20} />
          </button>
          <span className="font-display font-semibold text-ink">Mini CRM</span>
        </div>

        <main className="flex-1 min-w-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}