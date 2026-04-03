import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Header({ title, weatherEmoji }: { title?: string; weatherEmoji?: string }) {
  const { guide } = useApp();

  if (!guide) return null;

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <header className="flex items-center justify-between mb-6 md:mb-8">
      <div>
        {title ? (
          <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
        ) : (
          <div className="flex items-center gap-3">
            {weatherEmoji && (
              <span className="text-4xl leading-none">{weatherEmoji}</span>
            )}
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-0.5">{timeOfDay}</p>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight">
                Capt. <span className="text-brand-500">{guide.firstName}</span>
              </h1>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {guide.logoUrl && (
          <img src={guide.logoUrl} alt="Business logo" className="h-10 w-auto object-contain" />
        )}
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
      </div>
    </header>
  );
}
