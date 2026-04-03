import type { Trip, Client } from '../types';
import { formatDate } from '../lib/utils';
import { Clock, MapPin, Fish } from 'lucide-react';
import { cn } from '../lib/utils';

interface TripCardProps {
  trip: Trip;
  clients: Client[];
  onClick?: () => void;
  onClientClick?: (client: Client) => void;
  compact?: boolean;
}

const tripTypeLabel: Record<string, string> = { fly: 'Fly', spin: 'Spin', both: 'Fly & Spin' };

export function TripCard({ trip, clients, onClick, onClientClick, compact }: TripCardProps) {
  const tripClients = trip.clients.map(tc => clients.find(c => c.id === tc.clientId)).filter(Boolean) as Client[];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-4 transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-brand-200',
        compact ? 'space-y-2' : 'space-y-3'
      )}
    >
      {/* Clients - always at top */}
      {tripClients.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {tripClients.map(c => (
            <div
              key={c.id}
              onClick={onClientClick ? (e) => { e.stopPropagation(); onClientClick(c); } : undefined}
              className={cn(
                'flex items-center gap-2 rounded-full pl-1 pr-3 py-1',
                compact ? 'bg-slate-100' : 'bg-brand-50 border border-brand-100',
                onClientClick && 'cursor-pointer hover:bg-brand-100 transition-colors'
              )}
            >
              <div className={cn(
                'rounded-full bg-brand-200 overflow-hidden flex-shrink-0',
                compact ? 'w-8 h-8' : 'w-10 h-10'
              )}>
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold text-sm">
                    {c.firstName[0]}
                  </div>
                )}
              </div>
              <span className={cn(
                'font-semibold text-slate-800',
                compact ? 'text-xs' : 'text-sm'
              )}>
                {c.firstName} {c.lastName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Date + status */}
      <div className="flex items-center justify-between">
        <div>
          <p className={cn('font-semibold text-slate-800', compact ? 'text-xs' : 'text-sm')}>{formatDate(trip.date)}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} />
            {trip.duration === 'full' ? 'Full Day' : 'Half Day'}
          </p>
        </div>
        <span className={cn(
          'text-xs font-medium px-2 py-0.5 rounded-full',
          trip.status === 'upcoming' ? 'bg-brand-50 text-brand-700' :
          trip.status === 'completed' ? 'bg-sage-100 text-sage-700' :
          'bg-red-50 text-red-600'
        )}>
          {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
        </span>
      </div>

      {/* Location + type */}
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin size={11} className="text-slate-400" />{trip.location}</span>
        <span className="flex items-center gap-1"><Fish size={11} className="text-slate-400" />{tripTypeLabel[trip.tripType]}</span>
      </div>

      {/* Deposit pending (non-compact only) */}
      {!compact && trip.clients.some(tc => !tc.depositPaid) && (
        <div>
          <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Deposit pending</span>
        </div>
      )}
    </div>
  );
}
