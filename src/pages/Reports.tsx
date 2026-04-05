import { useApp } from '../context/AppContext';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { formatDate } from '../lib/utils';
import { FileText, Users, Fish } from 'lucide-react';

export function Reports() {
  const { trips, clients, reports } = useApp();

  const today = new Date().toISOString().split('T')[0];

  const completedTrips = trips
    .filter(t => t.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalClients = clients.length;
  const totalTrips = completedTrips.length;
  const upcomingCount = trips.filter(t => t.date >= today).length;

  return (
    <Layout>
      <Header title="Reports" />

      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Clients', value: totalClients, icon: Users },
            { label: 'Trips Completed', value: totalTrips, icon: Fish },
            { label: 'Upcoming Trips', value: upcomingCount, icon: FileText },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
              <Icon size={20} className="text-brand-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Trip Reports</h2>
          <div className="space-y-3">
            {completedTrips.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
                No completed trips yet.
              </div>
            ) : (
              completedTrips.map(trip => {
                const report = reports.find(r => r.tripId === trip.id);
                const tripClients = trip.clients.map(tc => clients.find(c => c.id === tc.clientId)).filter(Boolean);
                return (
                  <div key={trip.id} className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{formatDate(trip.date)}</p>
                        <p className="text-xs text-slate-400">{trip.duration === 'full' ? 'Full Day' : 'Half Day'}</p>
                      </div>
                      <span className="text-xs bg-sage-100 text-sage-700 px-2 py-0.5 rounded-full font-medium">Completed</span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {tripClients.map(c => c && (
                        <span key={c.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {c.firstName} {c.lastName}
                        </span>
                      ))}
                    </div>
                    {report ? (
                      <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2">{report.notes}</p>
                    ) : (
                      <p className="text-xs text-amber-500 border-t border-slate-100 pt-2">No report written yet.</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
