import React, { createContext, useContext, useState } from 'react';
import type { Guide, Client, Trip, TripReport } from '../types';
import { mockGuide, mockClients, mockTrips, mockReports } from '../data/mock';

interface AppContextType {
  guide: Guide;
  setGuide: (g: Guide) => void;
  clients: Client[];
  setClients: (c: Client[]) => void;
  trips: Trip[];
  setTrips: (t: Trip[]) => void;
  reports: TripReport[];
  setReports: (r: TripReport[]) => void;
  getClient: (id: string) => Client | undefined;
  getTripsForClient: (clientId: string) => Trip[];
  getReportForTrip: (tripId: string) => TripReport | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [guide, setGuide] = useState<Guide>(mockGuide);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [reports, setReports] = useState<TripReport[]>(mockReports);

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getTripsForClient = (clientId: string) => trips.filter(t => t.clients.some(tc => tc.clientId === clientId));
  const getReportForTrip = (tripId: string) => reports.find(r => r.tripId === tripId);

  return (
    <AppContext.Provider value={{ guide, setGuide, clients, setClients, trips, setTrips, reports, setReports, getClient, getTripsForClient, getReportForTrip }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
