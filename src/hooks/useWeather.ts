import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../api/weatherApi";
import type { TimeSnapshot } from "../types/dashboard";

const WEATHER_STALE_TIME = 1000 * 60 * 3;
const WEATHER_REFETCH_INTERVAL = 1000 * 60 * 5;

export const useWeather = (snapshot?: TimeSnapshot) => {
  return useQuery({
    enabled: Boolean(snapshot),
    queryKey: ["weather", snapshot?.id],
    queryFn: () =>
      getWeather({
        fallbackZones: snapshot?.weatherZones ?? [],
        snapshotId: snapshot?.id,
      }),
    retry: 1,
    staleTime: WEATHER_STALE_TIME,
    refetchInterval: WEATHER_REFETCH_INTERVAL,
  });
};
