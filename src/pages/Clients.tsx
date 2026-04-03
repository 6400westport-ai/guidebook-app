import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { Search, Plus, User, Phone, Mail } from 'lucide-react';
import type { Client } from '../types';
import { ClientModal } from '../components/ClientModal';
import { ClientDetailModal } from '../components/ClientDetailModal';

export function Clients() {
  const { clients } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <Layout>
      <Header title="Clients" />

      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-300 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No clients found.</div>
          ) : (
            filtered.map(client => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {client.photoUrl ? (
                    <img src={client.photoUrl} alt={client.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} className="text-brand-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{client.firstName} {client.lastName}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} />{client.email}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Phone size={10} />{client.phone}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAdd && <ClientModal onClose={() => setShowAdd(false)} />}
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </Layout>
  );
}
