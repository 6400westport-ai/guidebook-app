import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Guide, Client, Trip, TripReport, TripClient } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface AppContextType {
  guide: Guide | null;
  setGuide: (g: Guide) => void;
  clients: Client[];
  trips: Trip[];
  reports: TripReport[];
  loading: boolean;
  getClient: (id: string) => Client | undefined;
  getTripsForClient: (clientId: string) => Trip[];
  getReportForTrip: (tripId: string) => TripReport | undefined;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<void>;
  addTrip: (trip: { date: string; duration: string; tripType: string; location: string; notes: string; clients: TripClient[] }) => Promise<void>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<void>;
  saveReport: (tripId: string, notes: string, photoUrls: string[], existingReportId?: string) => Promise<void>;
  updateProfile: (updates: Partial<Guide>) => Promise<void>;
  updatePhotoUrl: (field: 'photoUrl' | 'logoUrl', url: string) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  updateTripFull: (id: string, updates: { date: string; duration: string; tripType: string; location: string; notes: string; clients: TripClient[] }) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [guide, setGuideState] = useState<Guide | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reports, setReports] = useState<TripReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, clientsRes, tripsRes, reportsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('clients').select('*').eq('guide_id', user.id).order('created_at'),
      supabase.from('trips').select('*, trip_clients(client_id, deposit_paid, party_size)').eq('guide_id', user.id).order('date'),
      supabase.from('trip_reports').select('*'),
    ]);

    if (profileRes.data) {
      const p = profileRes.data;
      setGuideState({
        id: p.id,
        name: `Capt. ${p.first_name} ${p.last_name}`,
        firstName: p.first_name ?? '',
        lastName: p.last_name ?? '',
        businessName: p.business_name ?? '',
        email: p.email ?? '',
        phone: p.phone ?? '',
        location: p.location ?? '',
        latitude: p.latitude ?? 32.7765,
        longitude: p.longitude ?? -79.9311,
        bio: p.bio ?? '',
        photoUrl: p.photo_url ?? null,
        logoUrl: p.logo_url ?? null,
      });
    }

    if (clientsRes.data) {
      setClients(clientsRes.data.map(c => ({
        id: c.id,
        firstName: c.first_name,
        lastName: c.last_name,
        email: c.email ?? '',
        phone: c.phone ?? '',
        notes: c.notes ?? '',
        photoUrl: c.photo_url ?? null,
        createdAt: c.created_at,
      })));
    }

    if (tripsRes.data) {
      setTrips(tripsRes.data.map(t => ({
        id: t.id,
        date: t.date,
        duration: t.duration,
        tripType: t.trip_type,
        location: t.location ?? '',
        notes: t.notes ?? '',
        status: t.status,
        clients: (t.trip_clients ?? []).map((tc: { client_id: string; deposit_paid: boolean; party_size?: number }) => ({
          clientId: tc.client_id,
          depositPaid: tc.deposit_paid,
          partySize: tc.party_size ?? 1,
        })),
      })));
    }

    if (reportsRes.data) {
      setReports(reportsRes.data.map(r => ({
        id: r.id,
        tripId: r.trip_id,
        notes: r.notes ?? '',
        photoUrls: r.photo_urls ?? [],
        createdAt: r.created_at,
      })));
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) loadData();
    else setLoading(false);
  }, [user, loadData]);

  const getClient = (id: string) => clients.find(c => c.id === id);
  const getTripsForClient = (clientId: string) => trips.filter(t => t.clients.some(tc => tc.clientId === clientId));
  const getReportForTrip = (tripId: string) => reports.find(r => r.tripId === tripId);

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    await supabase.from('clients').insert({
      guide_id: user!.id,
      first_name: client.firstName,
      last_name: client.lastName,
      email: client.email,
      phone: client.phone,
      notes: client.notes,
      photo_url: client.photoUrl,
    });
    await loadData();
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    await supabase.from('clients').update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      email: updates.email,
      phone: updates.phone,
      notes: updates.notes,
      photo_url: updates.photoUrl,
    }).eq('id', id);
    await loadData();
  };

  const addTrip = async (trip: { date: string; duration: string; tripType: string; location: string; notes: string; clients: TripClient[] }) => {
    const { data } = await supabase.from('trips').insert({
      guide_id: user!.id,
      date: trip.date,
      duration: trip.duration,
      trip_type: trip.tripType,
      location: trip.location,
      notes: trip.notes,
      status: 'upcoming',
    }).select().single();

    if (data && trip.clients.length > 0) {
      const { error: tcError } = await supabase.from('trip_clients').insert(
        trip.clients.map(tc => ({
          trip_id: data.id,
          client_id: tc.clientId,
          deposit_paid: tc.depositPaid,
          party_size: tc.partySize ?? 1,
        }))
      );
      if (tcError) console.error('trip_clients insert error:', tcError.message);
    }
    await loadData();
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('trips').update(dbUpdates).eq('id', id);
    }
    await loadData();
  };

  const saveReport = async (tripId: string, notes: string, photoUrls: string[], existingReportId?: string) => {
    if (existingReportId) {
      await supabase.from('trip_reports').update({ notes, photo_urls: photoUrls }).eq('id', existingReportId);
    } else {
      await supabase.from('trip_reports').insert({ trip_id: tripId, notes, photo_urls: photoUrls });
      await supabase.from('trips').update({ status: 'completed' }).eq('id', tripId);
    }
    await loadData();
  };

  const updateProfile = async (updates: Partial<Guide>) => {
    await supabase.from('profiles').update({
      first_name: updates.firstName,
      last_name: updates.lastName,
      business_name: updates.businessName,
      email: updates.email,
      phone: updates.phone,
      location: updates.location,
      latitude: updates.latitude,
      longitude: updates.longitude,
      bio: updates.bio,
      photo_url: updates.photoUrl,
      logo_url: updates.logoUrl,
    }).eq('id', user!.id);
    await loadData();
  };

  const updateTripFull = async (id: string, updates: { date: string; duration: string; tripType: string; location: string; notes: string; clients: TripClient[] }) => {
    const { error } = await supabase.from('trips').update({
      date: updates.date,
      duration: updates.duration,
      trip_type: updates.tripType,
      location: updates.location,
      notes: updates.notes,
    }).eq('id', id);
    if (error) { console.error('updateTripFull error:', error.message); return; }
    // Replace all clients for this trip
    await supabase.from('trip_clients').delete().eq('trip_id', id);
    if (updates.clients.length > 0) {
      const { error: tcError } = await supabase.from('trip_clients').insert(
        updates.clients.map(tc => ({
          trip_id: id,
          client_id: tc.clientId,
          deposit_paid: tc.depositPaid,
          party_size: tc.partySize ?? 1,
        }))
      );
      if (tcError) console.error('trip_clients insert error:', tcError.message);
    }
    await loadData();
  };

  const deleteTrip = async (id: string) => {
    await supabase.from('trips').delete().eq('id', id);
    await loadData();
  };

  const deleteClient = async (id: string) => {
    await supabase.from('clients').delete().eq('id', id);
    await loadData();
  };

  const updatePhotoUrl = async (field: 'photoUrl' | 'logoUrl', url: string) => {
    const dbField = field === 'photoUrl' ? 'photo_url' : 'logo_url';
    // Save the URL with the cache-busting timestamp to DB so reloads always get a fresh URL
    await supabase.from('profiles').update({ [dbField]: url }).eq('id', user!.id);
    setGuideState(prev => prev ? { ...prev, [field]: url } : prev);
  };

  const setGuide = (g: Guide) => setGuideState(g);

  return (
    <AppContext.Provider value={{ guide, setGuide, clients, trips, reports, loading, getClient, getTripsForClient, getReportForTrip, addClient, updateClient, addTrip, updateTrip, updateTripFull, saveReport, updateProfile, updatePhotoUrl, deleteTrip, deleteClient }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
