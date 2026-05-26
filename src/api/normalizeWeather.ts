import type { WeatherZone } from "../types/dashboard";
import type { WeatherApiResponse, WeatherApiZone } from "../types/api";

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getWeatherZones = (response: WeatherApiResponse): WeatherApiZone[] => {
  if (Array.isArray(response.weatherZones)) {
    return response.weatherZones;
  }

  if (Array.isArray(response.zones)) {
    return response.zones;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.weatherZones)) {
    return response.data.weatherZones;
  }

  if (response.data && Array.isArray(response.data.zones)) {
    return response.data.zones;
  }

  throw new Error("Weather response does not include zones.");
};

const getFallbackZone = (zone: WeatherApiZone, fallbackZones: WeatherZone[]) => {
  return fallbackZones.find(
    (fallbackZone) =>
      fallbackZone.id === zone.id || fallbackZone.name === zone.name,
  );
};

export const normalizeWeather = (
  response: WeatherApiResponse,
  fallbackZones: WeatherZone[],
): WeatherZone[] => {
  const zones = getWeatherZones(response);

  return zones.map((zone, index) => {
    const fallbackZone = getFallbackZone(zone, fallbackZones) ?? fallbackZones[index];
    const precipitationMm = clamp(
      toNumber(zone.precipitationMm ?? zone.precipitation ?? zone.rainfallMm, fallbackZone?.precipitationMm ?? 0),
      0,
      200,
    );

    return {
      id: String(zone.id ?? fallbackZone?.id ?? `weather-zone-${index + 1}`),
      name: String(zone.name ?? fallbackZone?.name ?? `서울 권역 ${index + 1}`),
      coordinates: {
        lat: toNumber(
          zone.coordinates?.lat ?? zone.lat ?? zone.latitude,
          fallbackZone?.coordinates.lat ?? 37.5665,
        ),
        lng: toNumber(
          zone.coordinates?.lng ?? zone.lng ?? zone.longitude,
          fallbackZone?.coordinates.lng ?? 126.978,
        ),
      },
      weatherStatus: String(
        zone.weatherStatus ?? zone.status ?? zone.condition ?? fallbackZone?.weatherStatus ?? "정보 없음",
      ),
      precipitationMm,
      temperature: toNumber(
        zone.temperature ?? zone.temperatureC,
        fallbackZone?.temperature ?? 20,
      ),
      umbrellaNeeded: Boolean(
        zone.umbrellaNeeded ?? zone.umbrella ?? fallbackZone?.umbrellaNeeded ?? precipitationMm >= 0.8,
      ),
    };
  });
};
