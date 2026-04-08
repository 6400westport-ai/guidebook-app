import type { Trip, Client } from '../types';
import { formatDate } from '../lib/utils';
import { History, Pencil, CalendarDays } from 'lucide-react';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';

interface TripCardProps {
  trip: Trip;
  clients: Client[];
  onClick?: () => void;
  onClientClick?: (client: Client) => void;
  onEdit?: () => void;
  compact?: boolean;
}

const tripTypeLabel: Record<string, string> = { fly: 'Fly', spin: 'Spin', both: 'Fly & Spin' };

function durationLabel(duration: string): string {
  if (duration === 'full') return 'Full Day';
  if (duration === 'half-am') return 'Half Day (AM)';
  if (duration === 'half-pm') return 'Half Day (PM)';
  return 'Half Day';
}

export function TripCard({ trip, clients, onClick, onClientClick, onEdit, compact }: TripCardProps) {
  const { getTripsForClient } = useApp();
  const tripClients = trip.clients.map(tc => ({
    client: clients.find(c => c.id === tc.clientId),
    depositPaid: tc.depositPaid,
    partySize: tc.partySize ?? 1,
  })).filter(tc => tc.client) as { client: Client; depositPaid: boolean; partySize: number }[];

  const allDepositsPaid = trip.clients.length > 0 && trip.clients.every(tc => tc.depositPaid);
  const anyDepositMissing = trip.clients.some(tc => !tc.depositPaid);
  const isPast = trip.date < new Date().toISOString().split('T')[0];

  const clientsWithHistory = tripClients.filter(({ client: c }) => {
    const pastTrips = getTripsForClient(c.id).filter(t => t.id !== trip.id && t.date < new Date().toISOString().split('T')[0]);
    return pastTrips.length > 0;
  });

  const headline = `${tripTypeLabel[trip.tripType]} Trip · ${durationLabel(trip.duration)}`;

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl border border-slate-200 p-4 transition-all',
        onClick && 'cursor-pointer hover:shadow-md hover:border-brand-200',
        compact ? 'space-y-2' : 'space-y-3'
      )}
    >
      {/* Headline row: trip type + duration + deposit badge + edit */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className={cn('font-bold text-slate-800 leading-tight', compact ? 'text-xs' : 'text-sm')}>
            {headline}
          </p>

          {/* Client names with party size */}
          {tripClients.length > 0 && (
            <p className={cn('text-slate-500 mt-0.5 truncate', compact ? 'text-xs' : 'text-xs')}>
              {tripClients.map(({ client: c, partySize }) =>
                partySize > 1
                  ? `${c.firstName} ${c.lastName} (${partySize} people)`
                  : `${c.firstName} ${c.lastName}`
              ).join(' · ')}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Deposit badge */}
          {!isPast && (
            allDepositsPaid && trip.clients.length > 0 ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                Deposit Paid
              </span>
            ) : anyDepositMissing ? (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                Deposit Needed
              </span>
            ) : null
          )}
          {onEdit && (
            <button
              onClick={e => { e.stopPropagation(); onEdit(); }}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Client avatars */}
      {!compact && tripClients.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {tripClients.map(({ client: c, partySize }) => (
            <div
              key={c.id}
              onClick={onClientClick ? (e) => { e.stopPropagation(); onClientClick(c); } : undefined}
              className={cn(
                'flex items-center gap-2 rounded-full pl-1 pr-3 py-1',
                'bg-brand-50 border border-brand-100',
                onClientClick && 'cursor-pointer hover:bg-brand-100 transition-colors'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-brand-200 overflow-hidden flex-shrink-0">
                {c.photoUrl ? (
                  <img src={c.photoUrl} alt={c.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-600 font-bold text-sm">
                    {c.firstName[0]}
                  </div>
                )}
              </div>
              <span className="text-sm font-semibold text-slate-800">
                {c.firstName} {c.lastName}
                {partySize > 1 && <span className="text-xs font-normal text-slate-400 ml-1">({partySize} people)</span>}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Date */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <CalendarDays size={11} />
        {formatDate(trip.date)}
      </div>

      {/* Notes */}
      {trip.notes && (
        <p className="text-xs text-slate-500 leading-relaxed italic">{trip.notes}</p>
      )}

      {/* Past trips link */}
      {!compact && clientsWithHistory.length > 0 && onClientClick && (
        <div className="border-t border-slate-100 pt-2 flex flex-wrap gap-2">
          {clientsWithHistory.map(({ client: c }) => {
            const pastCount = getTripsForClient(c.id).filter(t => t.id !== trip.id && t.date < new Date().toISOString().split('T')[0]).length;
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
