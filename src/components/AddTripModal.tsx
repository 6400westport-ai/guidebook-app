import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Trip, TripClient, TripDuration, TripType } from '../types';

interface Props {
  defaultDate: string;
  onClose: () => void;
}

export function AddTripModal({ defaultDate, onClose }: Props) {
  const { clients, trips, setTrips } = useApp();
  const [form, setForm] = useState({
    date: defaultDate,
    duration: 'full' as TripDuration,
    tripType: 'fly' as TripType,
    location: '',
    notes: '',
  });
  const [selectedClients, setSelectedClients] = useState<TripClient[]>([]);

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev =>
      prev.some(tc => tc.clientId === clientId)
        ? prev.filter(tc => tc.clientId !== clientId)
        : [...prev, { clientId, depositPaid: false }]
    );
  };

  const toggleDeposit = (clientId: string) => {
    setSelectedClients(prev =>
      prev.map(tc => tc.clientId === clientId ? { ...tc, depositPaid: !tc.depositPaid } : tc)
    );
  };

  const handleSave = () => {
    if (!form.date || !form.location) return;
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      ...form,
      clients: selectedClients,
      status: 'upcoming',
    };
    setTrips([...trips, newTrip]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">New Trip</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 block mb-1">Duration</label>
              <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value as TripDuration }))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300">
                <option value="full">Full Day</option>
                <option value="half">Half Day</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Trip Type</label>
            <div className="flex gap-2">
              {(['fly', 'spin', 'both'] as TripType[]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, tripType: t }))}
                  className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${form.tripType === t ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  {t === 'both' ? 'Fly & Spin' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Location</label>
            <input type="text" value={form.location} placeholder="e.g. Bulls Bay Flats"
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-2">Clients</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {clients.map(client => {
                const selected = selectedClients.find(tc => tc.clientId === client.id);
                return (
                  <div key={client.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input type="checkbox" checked={!!selected} onChange={() => toggleClient(client.id)}
                        className="rounded border-slate-300 text-brand-500 focus:ring-brand-300" />
                      <span className="text-sm text-slate-700">{client.firstName} {client.lastName}</span>
                    </label>
                    {selected && (
                      <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                        <input type="checkbox" checked={selected.depositPaid} onChange={() => toggleDeposit(client.id)}
                          className="rounded border-slate-300 text-green-500 focus:ring-green-300" />
                        Deposit paid
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} placeholder="Tides, target species, special instructions..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 text-sm bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <Plus size={15} />Save Trip
          </button>
        </div>
      </div>
    </div>
  );
}
