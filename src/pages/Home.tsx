import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useWeather } from '../hooks/useWeather';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { TripCard } from '../components/TripCard';
import { ClientDetailModal } from '../components/ClientDetailModal';
import { EditTripModal } from '../components/EditTripModal';
import { weatherDescription, weatherEmoji, windDirectionLabel } from '../lib/utils';
import { Wind, Sunrise, Sunset, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Client, Trip } from '../types';

export function Home() {
  const { guide, trips, clients } = useApp();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const { weather, loading: weatherLoading } = useWeather(guide?.latitude ?? 32.7765, guide?.longitude ?? -79.9311);

  if (!guide) return <Layout><div className="text-sm text-slate-400">Loading...</div></Layout>;

  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const upcomingTrips = trips
    .filter(t => t.date >= today && t.date <= nextWeekStr && t.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date));

  const todayTrip = upcomingTrips.find(t => t.date === today);
  const weekTrips = upcomingTrips.filter(t => t.date !== today);

  const todayWeather = weather[0];

  return (
    <Layout>
      <Header weatherEmoji={todayWeather ? weatherEmoji(todayWeather.weatherCode) : undefined} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Today's Trip</h2>
            {todayTrip ? (
              <TripCard trip={todayTrip} clients={clients} onClientClick={setSelectedClient} onEdit={() => setEditingTrip(todayTrip)} featured />
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-400 text-sm">
                No trip scheduled today — enjoy the day off.
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Upcoming This Week</h2>
            {weekTrips.length > 0 ? (
              <div className="space-y-3">
                {weekTrips.map(trip => (
                  <TripCard key={trip.id} trip={trip} clients={clients} onClientClick={setSelectedClient} onEdit={() => setEditingTrip(trip)} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-5 text-center text-slate-400 text-sm">
                No upcoming trips this week.
              </div>
            )}
            <Link to="/trips" className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors">
              <CalendarDays size={13} />
              View Calendar
            </Link>
          </section>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">7-Day Forecast</h2>

          {weatherLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-4 text-sm text-slate-400 text-center">
              Loading forecast...
            </div>
          ) : (
            <>
              {todayWeather && (
                <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-4 text-white">
                  <p className="text-xs font-medium text-brand-100 mb-1">Today · {guide.location}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{todayWeather.tempMax}°</p>
                      <p className="text-sm text-brand-100">{weatherDescription(todayWeather.weatherCode)}</p>
                    </div>
                    <span className="text-4xl">{weatherEmoji(todayWeather.weatherCode)}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-brand-400 flex items-center gap-4 text-xs text-brand-100">
                    <span className="flex items-center gap-1">
                      <Wind size={11} />
                      {todayWeather.windSpeed} mph {windDirectionLabel(todayWeather.windDirection)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sunrise size={11} />
                      {todayWeather.sunrise.split('T')[1]?.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sunset size={11} />
                      {todayWeather.sunset.split('T')[1]?.slice(0, 5)}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {weather.slice(1).map((day) => (
                  <div key={day.date} className="flex items-center justify-between px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{weatherEmoji(day.weatherCode)}</span>
                      <span className="text-xs text-slate-500">
                        {new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Wind size={10} className="text-slate-300" />
                      {day.windSpeed} mph {windDirectionLabel(day.windDirection)}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{day.tempMax}° / {day.tempMin}°</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
      {editingTrip && <EditTripModal trip={editingTrip} onClose={() => setEditingTrip(null)} />}
    </Layout>
  );
}
