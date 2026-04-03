import type { Trip, Client } from '../types';
import { formatDate } from '../lib/utils';
import { Clock, MapPin, Fish, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface TripCardProps {
  trip: Trip;
  clients: Client[];
  onClick?: () => void;
  onClientClick?: (client: Client) => void;
  compact?: boolean;
}

const tripTypeLabel: Record<string, string> = { fly: 'Fly', spin: 'Spin', both: 'Fly & Spin' };

export function TripCard({ trip, clients, onClick, onClientClick, compact }: TripCardProps) {
  const { getTripsForClient } = useApp();
  const tripClients = trip.clients.map(tc => clients.find(c => c.id === tc.clientId)).filter(Boolean) as Client[];

  const allDepositsPaid = trip.clients.length > 0 && trip.clients.every(tc => tc.depositPaid);
  const anyDepositMissing = trip.clients.some(tc => !tc.depositPaid);

  // Check if any client has past completed trips
  const clientsWithHistory = tripClients.filter(c => {
    const pastTrips = getTripsForClient(c.id).filter(t => t.id !== trip.id && t.status === 'completed');
    return pastTrips.length > 0;
  });

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-4 transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-brand-200',
        compact ? 'space-y-2' : 'space-y-3'
      )}
    >
      {/* Date + duration + trip type + deposit status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={cn('font-semibold text-slate-800', compact ? 'text-xs' : 'text-sm')}>{formatDate(trip.date)}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn(
              'inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5',
              compact ? 'text-xs bg-slate-100 text-slate-600' : 'text-xs bg-brand-100 text-brand-700'
            )}>
              <Clock size={10} />
              {trip.duration === 'full' ? 'Full Day' : 'Half Day'}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1 font-semibold rounded-md px-1.5 py-0.5',
              compact ? 'text-xs bg-slate-100 text-slate-600' : 'text-xs bg-brand-100 text-brand-700'
            )}>
              <Fish size={10} />
              {tripTypeLabel[trip.tripType]}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {trip.status === 'upcoming' ? (
            allDepositsPaid ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                Deposit Paid
              </span>
            ) : anyDepositMissing ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                Deposit Needed
              </span>
            ) : null
          ) : (
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              trip.status === 'completed' ? 'bg-sage-100 text-sage-700' : 'bg-red-50 text-red-600'
            )}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      {/* Clients */}
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
              <span className={cn('font-semibold text-slate-800', compact ? 'text-xs' : 'text-sm')}>
                {c.firstName} {c.lastName}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Location */}
      {trip.location && (
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={11} className="text-slate-400 flex-shrink-0" />{trip.location}
        </div>
      )}

      {/* Guide notes */}
      {trip.notes && (
        <p className="text-xs text-slate-500 leading-relaxed italic">{trip.notes}</p>
      )}

      {/* Past trips link */}
      {!compact && clientsWithHistory.length > 0 && onClientClick && (
        <div className="border-t border-slate-100 pt-2 flex flex-wrap gap-2">
          {clientsWithHistory.map(c => {
            const pastCount = getTripsForClient(c.id).filter(t => t.id !== trip.id && t.status === 'completed').length;
            return (
              <button
                key={c.id}
                onClick={(e) => { e.stopPropagation(); onClientClick(c); }}
                className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-800 font-medium"
              >
                <History size={11} />
                {c.firstName} — {pastCount} past {pastCount === 1 ? 'trip' : 'trips'}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
