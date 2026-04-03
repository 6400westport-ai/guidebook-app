import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getGreeting } from '../../lib/utils';

export function Header({ title }: { title?: string }) {
  const { guide } = useApp();

  return (
    <header className="flex items-center justify-between mb-6 md:mb-8">
      <div>
        {title ? (
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        ) : (
          <h1 className="text-xl font-semibold text-slate-800">{getGreeting(guide.firstName)}</h1>
        )}
      </div>

      <Link to="/profile" className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-full pl-2 pr-4 py-1.5 shadow-sm hover:shadow-md transition-shadow">
        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden">
          {guide.photoUrl ? (
            <img src={guide.photoUrl} alt={guide.name} className="w-full h-full object-cover" />
          ) : (
            <User size={16} className="text-brand-600" />
          )}
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-slate-800">{guide.name}</p>
          <p className="text-xs text-slate-400">{guide.businessName}</p>
        </div>
      </Link>
    </header>
  );
}
