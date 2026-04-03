import { useState, useEffect } from 'react';
import type { WeatherDay } from '../types';

export function useWeather(latitude: number, longitude: number) {
  const [weather, setWeather] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,windspeed_10m_max,winddirection_10m_dominant,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto&forecast_days=7`;
        const res = await fetch(url);
        const data = await res.json();
        const days: WeatherDay[] = data.daily.time.map((date: string, i: number) => ({
          date,
          tempMax: Math.round(data.daily.temperature_2m_max[i]),
          tempMin: Math.round(data.daily.temperature_2m_min[i]),
          weatherCode: data.daily.weathercode[i],
          windSpeed: Math.round(data.daily.windspeed_10m_max[i]),
          windDirection: data.daily.winddirection_10m_dominant[i],
          sunrise: data.daily.sunrise[i],
          sunset: data.daily.sunset[i],
        }));
        setWeather(days);
      } catch {
        setError('Weather unavailable');
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error };
}
