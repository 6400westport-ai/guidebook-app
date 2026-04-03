import type { Trip, Client } from '../types';
import { formatDate } from '../lib/utils';
import { Clock, MapPin, Fish } from 'lucide-react';
import { cn } from '../lib/utils';

interface TripCardProps {
  trip: Trip;
  clients: Client[];
  onClick?: () => void;
  compact?: boolean;
}

const tripTypeLabel: Record<string, string> = { fly: 'Fly', spin: 'Spin', both: 'Fly & Spin' };

export function TripCard({ trip, clients, onClick, compact }: TripCardProps) {
  const tripClients = trip.clients.map(tc => clients.find(c => c.id === tc.clientId)).filter(Boolean) as Client[];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-4 transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-brand-200',
        compact ? 'space-y-1.5' : 'space-y-3'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{formatDate(trip.date)}</p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <Clock size={11} />
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

      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1"><MapPin size={11} className="text-slate-400" />{trip.location}</span>
        <span className="flex items-center gap-1"><Fish size={11} className="text-slate-400" />{tripTypeLabel[trip.tripType]}</span>
      </div>

      {!compact && (
        <div className="flex items-center gap-2 flex-wrap">
          {tripClients.map(c => (
            <div key={c.id} className="flex items-center gap-1.5 bg-slate-100 rounded-full pl-0.5 pr-2.5 py-0.5">
              <div className="w-5 h-5 rounded-full bg-brand-200 overflow-hidden flex-shrink-0">
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-600 text-xs font-bold">
                    {c.firstName[0]}
                  </div>
                )}
              </div>
              <span className="text-xs text-slate-600">{c.firstName} {c.lastName}</span>
            </div>
          ))}
          {trip.clients.some(tc => !tc.depositPaid) && (
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full ml-auto">Deposit pending</span>
          )}
        </div>
      )}
    </div>
  );
}
