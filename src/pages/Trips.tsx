import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Layout } from '../components/layout/Layout';
import { Header } from '../components/layout/Header';
import { TripCard } from '../components/TripCard';
import { ClientDetailModal } from '../components/ClientDetailModal';
import { ChevronLeft, ChevronRight, Plus, CalendarPlus } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Trip, Client } from '../types';
import { AddTripModal } from '../components/AddTripModal';
import { TripDetailModal } from '../components/TripDetailModal';

export function Trips() {
  const { trips, clients } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const todayStr = new Date().toISOString().split('T')[0];

  const getTripsForDay = (day: number): Trip[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return trips.filter(t => t.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTrips = getTripsForDay(day);
    if (dayTrips.length === 1) {
      setSelectedTrip(dayTrips[0]);
    } else {
      setSelectedDate(dateStr);
      setShowAddModal(true);
    }
  };

  return (
    <Layout>
      <Header title="Trips" />

      <div className="space-y-6">
        <button
          onClick={() => { setSelectedDate(todayStr); setShowAddModal(true); }}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Trip
        </button>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><ChevronLeft size={18} /></button>
            <h2 className="text-base font-semibold text-slate-800">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600"><ChevronRight size={18} /></button>
          </div>

          {/* Hint */}
          <p className="text-center text-xs text-slate-400 mb-4 flex items-center justify-center gap-1">
            <CalendarPlus size={11} />
            Click any day to schedule a new trip
          </p>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1 uppercase tracking-wide">{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayTrips = getTripsForDay(day);
              const isToday = dateStr === todayStr;
              const isPast = dateStr < todayStr;

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    'relative min-h-[84px] p-1.5 rounded-xl cursor-pointer transition-all group',
                    isToday
                      ? 'bg-brand-50 border-2 border-brand-300 shadow-sm'
                      : isPast && dayTrips.length > 0
                        ? 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                        : 'border border-transparent hover:bg-slate-50 hover:border-slate-200',
                  )}
                >
                  {/* Day number */}
                  <div className="flex justify-center mb-1.5">
                    <span className={cn(
                      'text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full',
                      isToday
                        ? 'bg-brand-500 text-white'
                        : isPast
                          ? 'text-slate-400'
                          : 'text-slate-700 group-hover:text-brand-600'
                    )}>{day}</span>
                  </div>

                  {/* Trip blocks */}
                  <div className="space-y-1">
                    {dayTrips.slice(0, 2).map(trip => {
                      const tripClients = trip.clients
                        .map(tc => clients.find(c => c.id === tc.clientId))
                        .filter(Boolean) as typeof clients;
                      const past = trip.date < todayStr;
                      return (
                        <div key={trip.id} className={cn(
                          'rounded-lg px-1.5 py-1',
                          past ? 'bg-sage-100 border border-sage-200' : 'bg-brand-100 border border-brand-200'
                        )}>
                          {/* Client photos */}
                          {tripClients.some(c => c.photoUrl) && (
                            <div className="flex gap-0.5 mb-0.5">
                              {tripClients.filter(c => c.photoUrl).slice(0, 3).map(c => (
                                <div
                                  key={c.id}
                                  onClick={e => { e.stopPropagation(); setSelectedClient(c); }}
                                  className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 cursor-pointer ring-1 ring-white shadow-sm"
                                >
                                  <img src={c.photoUrl!} alt={c.firstName} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Client names */}
                          {tripClients.map(c => (
                            <div
                              key={c.id}
                              onClick={e => { e.stopPropagation(); setSelectedClient(c); }}
                              className={cn(
                                'text-xs truncate cursor-pointer hover:underline leading-tight font-medium',
                                past ? 'text-sage-700' : 'text-brand-700'
                              )}
                            >
                              {c.firstName}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    {dayTrips.length > 2 && (
                      <div className="text-xs text-slate-400 text-center font-medium">+{dayTrips.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            {currentDate.toLocaleDateString('en-US', { month: 'long' })} Trips
          </h2>
          <div className="space-y-3">
            {trips
              .filter(t => {
                const [y, m] = t.date.split('-').map(Number);
                return y === year && m === month + 1;
              })
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(trip => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  clients={clients}
                  onClick={() => setSelectedTrip(trip)}
                  onClientClick={setSelectedClient}
                />
              ))
            }
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddTripModal
          defaultDate={selectedDate || todayStr}
          onClose={() => { setShowAddModal(false); setSelectedDate(null); }}
        />
      )}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}
      {selectedClient && <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />}
    </Layout>
  );
}
