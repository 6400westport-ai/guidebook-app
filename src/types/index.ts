export interface Guide {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  businessName: string;
  email: string;
  phone: string;
  location: string;
  latitude: number;
  longitude: number;
  bio: string;
  photoUrl: string | null;
  logoUrl: string | null;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  photoUrl: string | null;
  createdAt: string;
}

export type TripType = 'fly' | 'spin' | 'both';
export type TripDuration = 'full' | 'half';

export interface TripClient {
  clientId: string;
  depositPaid: boolean;
}

export interface Trip {
  id: string;
  date: string;
  duration: TripDuration;
  tripType: TripType;
  location: string;
  clients: TripClient[];
  notes: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  reportId?: string;
}

export interface TripReport {
  id: string;
  tripId: string;
  notes: string;
  photoUrls: string[];
  createdAt: string;
}

export interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  sunrise: string;
  sunset: string;
}
