import { useState } from 'react';
import { X, Save, Search, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Trip, TripClient, TripDuration, TripType } from '../types';

interface Props {
  trip: Trip;
  onClose: () => void;
}

export function EditTripModal({ trip, onClose }: Props) {
  const { clients, updateTripFull, addClient } = useApp();
  const [form, setForm] = useState({
    date: trip.date,
    duration: trip.duration,
    tripType: trip.tripType,
    location: trip.location,
    notes: trip.notes,
  });
  const [selectedClients, setSelectedClients] = useState<TripClient[]>(trip.clients);
  const [saving, setSaving] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientForm, setNewClientForm] = useState({ firstName: '', lastName: '', phone: '', email: '' });
  const [addingClient, setAddingClient] = useState(false);

  const filteredClients = clients.filter(c => {
    const q = clientSearch.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    const aSelected = selectedClients.some(tc => tc.clientId === a.id);
    const bSelected = selectedClients.some(tc => tc.clientId === b.id);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return 0;
  });

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev =>
      prev.some(tc => tc.clientId === clientId)
        ? prev.filter(tc => tc.clientId !== clientId)
        : [...prev, { clientId, depositPaid: false, partySize: 1 }]
    );
  };

  const toggleDeposit = (clientId: string) => {
    setSelectedClients(prev =>
      prev.map(tc => tc.clientId === clientId ? { ...tc, depositPaid: !tc.depositPaid } : tc)
    );
  };

  const setPartySize = (clientId: string, size: number) => {
    setSelectedClients(prev =>
      prev.map(tc => tc.clientId === clientId ? { ...tc, partySize: Math.max(1, size) } : tc)
    );
  };

  const handleAddNewClient = async () => {
    if (!newClientForm.firstName || !newClientForm.lastName) return;
    setAddingClient(true);
    await addClient({
      firstName: newClientForm.firstName,
      lastName: newClientForm.lastName,
      phone: newClientForm.phone,
      email: newClientForm.email,
      notes: '',
      photoUrl: null,
    });
    setNewClientForm({ firstName: '', lastName: '', phone: '', email: '' });
    setShowNewClient(false);
    setClientSearch(newClientForm.firstName);
    setAddingClient(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateTripFull(trip.id, { ...form, location: '', clients: selectedClients });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-800">Edit Trip</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Date + Duration */}
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
                <option value="half-am">Half Day (AM)</option>
                <option value="half-pm">Half Day (PM)</option>
              </select>
            </div>
          </div>

          {/* Trip Type */}
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

          {/* Clients */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-500">Clients</label>
              <button onClick={() => setShowNewClient(v => !v)}
                className="flex items-center gap-1 text-xs text-brand-600 font-medium hover:text-brand-700">
                <UserPlus size={13} />
                New Client
                {showNewClient ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            {showNewClient && (
              <div className="mb-3 p-3 bg-brand-50 border border-brand-100 rounded-lg space-y-2">
                <p className="text-xs font-medium text-brand-700 mb-2">Quick Add Client</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { placeholder: 'First name *', field: 'firstName' },
                    { placeholder: 'Last name *', field: 'lastName' },
                    { placeholder: 'Phone', field: 'phone' },
                    { placeholder: 'Email', field: 'email' },
                  ].map(({ placeholder, field }) => (
                    <input key={field} type="text" placeholder={placeholder}
                      value={newClientForm[field as keyof typeof newClientForm]}
                      onChange={e => setNewClientForm(f => ({ ...f, [field]: e.target.value }))}
                      className="px-2.5 py-1.5 text-sm border border-brand-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white" />
                  ))}
                </div>
                <button onClick={handleAddNewClient}
                  disabled={addingClient || !newClientForm.firstName || !newClientForm.lastName}
                  className="w-full py-1.5 text-xs bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
                  {addingClient ? 'Adding...' : 'Add & Select Client'}
                </button>
              </div>
            )}

            <div className="relative mb-2">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search clients..." value={clientSearch}
                onChange={e => setClientSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300" />
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {filteredClients.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">No clients found</p>
              ) : (
                filteredClients.map(client => {
                  const selected = selectedClients.find(tc => tc.clientId === client.id);
                  return (
                    <div key={client.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50">
                      <label className="flex items-center gap-2 cursor-pointer flex-1">
                        <input type="checkbox" checked={!!selected} onChange={() => toggleClient(client.id)}
                          className="rounded border-slate-300 text-brand-500 focus:ring-brand-300" />
                        <div className="w-7 h-7 rounded-full bg-brand-100 overflow-hidden flex-shrink-0">
                          {client.photoUrl ? (
                            <img src={client.photoUrl} alt={client.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-brand-600 text-xs font-bold">
                              {client.firstName[0]}
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-slate-700">{client.firstName} {client.lastName}</span>
                      </label>
                      {selected && (
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                            <input type="checkbox" checked={selected.depositPaid} onChange={() => toggleDeposit(client.id)}
                              className="rounded border-slate-300 text-green-500 focus:ring-green-300" />
                            Deposit
                          </label>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setPartySize(client.id, (selected.partySize ?? 1) - 1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">−</button>
                            <span className="text-xs text-slate-700 w-4 text-center">{selected.partySize ?? 1}</span>
                            <button type="button" onClick={() => setPartySize(client.id, (selected.partySize ?? 1) + 1)}
                              className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center">+</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1">Notes</label>
            <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} placeholder="Location, tides, target species, special instructions..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 text-sm bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <Save size={15} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
