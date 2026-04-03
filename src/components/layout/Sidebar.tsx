import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, Users, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/trips', icon: CalendarDays, label: 'Trips' },
  { to: '/clients', icon: Users, label: 'Clients' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
];

export function Sidebar() {
  const { guide } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5 border-b border-slate-100">
        <img src="/fish.png" alt="Guidebook" className="h-10 w-auto mb-2 object-contain" />
        <p className="text-sm font-semibold text-brand-600 leading-tight">{guide?.businessName ?? ''}</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-700 border border-brand-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">{guide?.location ?? ''}</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 fixed top-0 left-0 h-screen z-30">
        <NavContent />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <img src="/fish.png" alt="Guidebook" className="h-7 w-auto object-contain" />
          <span className="text-sm font-semibold text-brand-600 uppercase tracking-widest">Guidebook</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-100">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
