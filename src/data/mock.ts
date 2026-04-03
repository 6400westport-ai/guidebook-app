import type { Guide, Client, Trip, TripReport } from '../types';

export const mockGuide: Guide = {
  id: 'guide-1',
  name: 'Capt. John Sullivan',
  firstName: 'John',
  lastName: 'Sullivan',
  businessName: 'Blue Water Guide Service',
  email: 'john@bluewaterguide.com',
  phone: '(843) 555-0192',
  location: 'Charleston, SC',
  latitude: 32.7765,
  longitude: -79.9311,
  bio: 'Lifelong waterman with 20+ years guiding in the Lowcountry.',
  photoUrl: null,
  logoUrl: null,
};

export const mockClients: Client[] = [
  {
    id: 'client-1',
    firstName: 'Mike',
    lastName: 'Harris',
    email: 'mike.harris@email.com',
    phone: '(404) 555-0134',
    notes: 'Experienced fly fisherman. Prefers early morning trips. Catch and release only.',
    photoUrl: null,
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'client-2',
    firstName: 'Sarah',
    lastName: 'Chen',
    email: 'sarah.chen@email.com',
    phone: '(212) 555-0187',
    notes: 'Beginner. Very enthusiastic. Prefers spin fishing.',
    photoUrl: null,
    createdAt: '2024-04-02T10:00:00Z',
  },
  {
    id: 'client-3',
    firstName: 'Tom',
    lastName: 'Bradley',
    email: 'tom.bradley@email.com',
    phone: '(615) 555-0211',
    notes: 'Corporate client. Books with wife occasionally.',
    photoUrl: null,
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'client-4',
    firstName: 'Dana',
    lastName: 'Reeves',
    email: 'dana.reeves@email.com',
    phone: '(843) 555-0309',
    notes: 'Local. Regular client. Experienced with both fly and spin.',
    photoUrl: null,
    createdAt: '2023-11-10T10:00:00Z',
  },
  {
    id: 'client-5',
    firstName: 'Chris',
    lastName: 'Nguyen',
    email: 'chris.nguyen@email.com',
    phone: '(713) 555-0445',
    notes: 'Visiting from Houston. Wants redfish experience.',
    photoUrl: null,
    createdAt: '2024-05-01T10:00:00Z',
  },
];

const today = new Date();
const fmt = (d: Date) => d.toISOString().split('T')[0];
const addDays = (d: Date, n: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
};

export const mockTrips: Trip[] = [
  {
    id: 'trip-1',
    date: fmt(today),
    duration: 'full',
    tripType: 'fly',
    location: 'Bulls Bay Flats',
    clients: [
      { clientId: 'client-1', depositPaid: true },
      { clientId: 'client-4', depositPaid: true },
    ],
    notes: 'High tide at 7:15am. Target redfish on the incoming.',
    status: 'upcoming',
  },
  {
    id: 'trip-2',
    date: fmt(addDays(today, 2)),
    duration: 'half',
    tripType: 'spin',
    location: 'Shem Creek',
    clients: [{ clientId: 'client-2', depositPaid: false }],
    notes: 'Half day morning trip. Beginner friendly.',
    status: 'upcoming',
  },
  {
    id: 'trip-3',
    date: fmt(addDays(today, 4)),
    duration: 'full',
    tripType: 'both',
    location: 'Kiawah River',
    clients: [
      { clientId: 'client-3', depositPaid: true },
      { clientId: 'client-5', depositPaid: true },
    ],
    notes: 'Corporate group. Full day on the Kiawah.',
    status: 'upcoming',
  },
  {
    id: 'trip-4',
    date: fmt(addDays(today, 6)),
    duration: 'half',
    tripType: 'fly',
    location: 'Folly Beach Marsh',
    clients: [{ clientId: 'client-1', depositPaid: true }],
    notes: 'Afternoon half day.',
    status: 'upcoming',
  },
  {
    id: 'trip-5',
    date: fmt(addDays(today, -7)),
    duration: 'full',
    tripType: 'fly',
    location: 'Bulls Bay Flats',
    clients: [
      { clientId: 'client-4', depositPaid: true },
      { clientId: 'client-1', depositPaid: true },
    ],
    notes: '',
    status: 'completed',
    reportId: 'report-1',
  },
  {
    id: 'trip-6',
    date: fmt(addDays(today, -14)),
    duration: 'half',
    tripType: 'spin',
    location: 'Shem Creek',
    clients: [
      { clientId: 'client-2', depositPaid: true },
      { clientId: 'client-3', depositPaid: true },
    ],
    notes: '',
    status: 'completed',
    reportId: 'report-2',
  },
];

export const mockReports: TripReport[] = [
  {
    id: 'report-1',
    tripId: 'trip-5',
    notes: 'Exceptional day on the flats. Landed 8 reds before noon, all on fly. Mike threw a perfect cast to a tailing fish in 6 inches of water. Dana stayed cool in the wind and picked up two nice trout on the way back.',
    photoUrls: [],
    createdAt: fmt(addDays(today, -7)),
  },
  {
    id: 'report-2',
    tripId: 'trip-6',
    notes: 'Morning half day with Sarah and Tom. Sarah landed her first keeper trout — huge smiles. Tom caught a nice flounder off the pilings. Overcast kept the fish active.',
    photoUrls: [],
    createdAt: fmt(addDays(today, -14)),
  },
];
