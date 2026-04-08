import { useState } from 'react';
import { X, Clock, Fish, FileText, CheckCircle, Circle, Trash2, Edit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Trip } from '../types';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';
import { EditTripModal } from './EditTripModal';
import { TripReportModal } from './TripReportModal';

interface Props {
  trip: Trip;
  onClose: () => void;
}

const tripTypeLabel: Record<string, string> = { fly: 'Fly', spin: 'Spin', both: 'Fly & Spin' };

export function TripDetailModal({ trip, onClose }: Props) {
  const { clients, reports, deleteTrip } = useApp();
  const tripClients = trip.clients.map(tc => ({
    client: clients.find(c => c.id === tc.clientId),
    depositPaid: tc.depositPaid,
  }));
  const existingReport = reports.find(r => r.tripId === trip.id);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Treat any trip in the past as completed regardless of stored status
  const isPast = trip.date < new Date().toISOString().split('T')[0];

  const handleDelete = async () => {
    setDeleting(true);
    await deleteTrip(trip.id);
    onClose();
  };

  if (showEdit) return <EditTripModal trip={trip} onClose={() => { setShowEdit(false); onClose(); }} />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{formatDate(trip.date)}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowEdit(true)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Edit size={16} /></button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Duration + type */}
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" />{trip.duration === 'full' ? 'Full Day' : 'Half Day'}</span>
            <span className="flex items-center gap-1.5"><Fish size={14} className="text-slate-400" />{tripTypeLabel[trip.tripType]}</span>
            <span className={cn(
              'ml-auto text-xs font-medium px-2 py-0.5 rounded-full',
              isPast ? 'bg-sage-100 text-sage-700' : 'bg-brand-50 text-brand-700'
            )}>
              {isPast ? 'Completed' : 'Upcoming'}
            </span>
          </div>

          {/* Clients */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Clients</p>
            <div className="space-y-2">
              {tripClients.map(({ client, depositPaid }) => client && (
                <div key={client.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 overflow-hidden flex-shrink-0">
                      {client.photoUrl ? (
                        <img src={client.photoUrl} alt={client.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-500 text-sm font-bold">
                          {client.firstName[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-slate-700">{client.firstName} {client.lastName}</span>
                  </div>
                  <span className={cn('flex items-center gap-1 text-xs font-medium', depositPaid ? 'text-green-600' : 'text-amber-500')}>
                    {depositPaid ? <CheckCircle size={12} /> : <Circle size={12} />}
                    {depositPaid ? 'Deposit paid' : 'Deposit pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {trip.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
              <p className="text-sm text-slate-600 leading-relaxed">{trip.notes}</p>
            </div>
          )}

          {/* Trip report — shown for past trips */}
          {isPast && (
            <button
              onClick={() => setShowReport(true)}
              className="w-full py-2.5 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              {existingReport ? 'Edit Trip Report' : 'Log Trip Report'}
            </button>
          )}
          {showReport && <TripReportModal trip={trip} existingReport={existingReport} onClose={() => { setShowReport(false); onClose(); }} />}

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors mx-auto"
            >
              <Trash2 size={13} />
              Delete Trip
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center space-y-2">
              <p className="text-sm font-medium text-red-700">Delete this trip?</p>
              <p className="text-xs text-red-500">This cannot be undone.</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setConfirmDelete(false)} className="px-4 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting} className="px-4 py-1.5 text-xs bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg font-medium">
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
