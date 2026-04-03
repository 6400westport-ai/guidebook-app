import { useState } from 'react';
import { X, Phone, Mail, FileText, Edit } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Client } from '../types';
import { formatDate } from '../lib/utils';
import { ClientModal } from './ClientModal';

interface Props {
  client: Client;
  onClose: () => void;
}

export function ClientDetailModal({ client, onClose }: Props) {
  const { getTripsForClient, getReportForTrip } = useApp();
  const [showEdit, setShowEdit] = useState(false);
  const clientTrips = getTripsForClient(client.id).sort((a, b) => b.date.localeCompare(a.date));

  if (showEdit) return <ClientModal client={client} onClose={() => { setShowEdit(false); onClose(); }} />;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">{client.firstName} {client.lastName}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowEdit(true)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><Edit size={16} /></button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {client.photoUrl ? (
                <img src={client.photoUrl} alt={client.firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-brand-400">{client.firstName[0]}</span>
              )}
            </div>
            <div className="space-y-1.5">
              <p className="flex items-center gap-1.5 text-sm text-slate-600"><Mail size={13} className="text-slate-400" />{client.email}</p>
              <p className="flex items-center gap-1.5 text-sm text-slate-600"><Phone size={13} className="text-slate-400" />{client.phone}</p>
            </div>
          </div>

          {client.notes && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Notes</p>
              <p className="text-sm text-slate-600 leading-relaxed">{client.notes}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              Trip History ({clientTrips.length})
            </p>
            {clientTrips.length === 0 ? (
              <p className="text-sm text-slate-400">No trips yet.</p>
            ) : (
              <div className="space-y-2">
                {clientTrips.map(trip => {
                  const report = getReportForTrip(trip.id);
                  return (
                    <div key={trip.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-slate-700">{formatDate(trip.date)}</p>
                        <span className="text-xs text-slate-400">{trip.duration === 'full' ? 'Full' : 'Half'} Day</span>
                      </div>
                      <p className="text-xs text-slate-500">{trip.location}</p>
                      {report && (
                        <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1">
                          <FileText size={10} className="mt-0.5 flex-shrink-0 text-slate-400" />
                          <span className="line-clamp-2">{report.notes}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
