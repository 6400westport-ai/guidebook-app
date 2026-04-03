import { useState } from 'react';
import { X, Clock, Fish, FileText, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Trip } from '../types';
import { formatDate } from '../lib/utils';
import { cn } from '../lib/utils';

interface Props {
  trip: Trip;
  onClose: () => void;
}

const tripTypeLabel: Record<string, string> = { fly: 'Fly', spin: 'Spin', both: 'Fly & Spin' };

export function TripDetailModal({ trip, onClose }: Props) {
  const { clients, reports, updateTrip, saveReport } = useApp();
  const tripClients = trip.clients.map(tc => ({
    client: clients.find(c => c.id === tc.clientId),
    depositPaid: tc.depositPaid,
  }));
  const existingReport = reports.find(r => r.tripId === trip.id);
  const [reportNotes, setReportNotes] = useState(existingReport?.notes ?? '');
  const [showReport, setShowReport] = useState(!!existingReport);
  const [saving, setSaving] = useState(false);

  const markComplete = async () => {
    await updateTrip(trip.id, { status: 'completed' });
    setShowReport(true);
  };

  const handleSaveReport = async () => {
    setSaving(true);
    await saveReport(trip.id, reportNotes, existingReport?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-800">{formatDate(trip.date)}</h2>
            <p className="text-xs text-slate-400">{trip.location}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" />{trip.duration === 'full' ? 'Full Day' : 'Half Day'}</span>
            <span className="flex items-center gap-1.5"><Fish size={14} className="text-slate-400" />{tripTypeLabel[trip.tripType]}</span>
            <span className={cn(
              'ml-auto text-xs font-medium px-2 py-0.5 rounded-full',
              trip.status === 'upcoming' ? 'bg-brand-50 text-brand-700' : 'bg-sage-100 text-sage-700'
            )}>{trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}</span>
          </div>

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

          {trip.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
              <p className="text-sm text-slate-600 leading-relaxed">{trip.notes}</p>
            </div>
          )}

          {trip.status === 'upcoming' && (
            <button onClick={markComplete}
              className="w-full py-2.5 text-sm border border-sage-300 text-sage-700 rounded-lg hover:bg-sage-50 transition-colors font-medium">
              Mark Trip as Completed
            </button>
          )}

          {(showReport || trip.status === 'completed') && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText size={11} />Trip Report
              </p>
              <textarea
                value={reportNotes}
                onChange={e => setReportNotes(e.target.value)}
                rows={5}
                placeholder="Write your trip report — conditions, catches, highlights..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none"
              />
              <button onClick={handleSaveReport} disabled={saving}
                className="mt-2 w-full py-2.5 text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
                {saving ? 'Saving...' : 'Save Report'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
