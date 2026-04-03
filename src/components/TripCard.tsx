import type { Trip, Client } from '../types';
import { formatDate } from '../lib/utils';
import { Clock, MapPin, Fish, Users } from 'lucide-react';
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
        <div className="flex items-center gap-1.5 flex-wrap">
          <Users size={11} className="text-slate-400" />
          {tripClients.map(c => (
            <span key={c.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {c.firstName} {c.lastName}
            </span>
          ))}
          {trip.clients.some(tc => !tc.depositPaid) && (
            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full ml-auto">Deposit pending</span>
          )}
        </div>
      )}
    </div>
  );
}
