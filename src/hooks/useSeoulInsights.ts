import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSeoulInsights } from "../api/insightApi";
import type { SubwayTrain, WeatherZone } from "../types/dashboard";

const INSIGHT_STALE_TIME = 1000 * 30;
const INSIGHT_REFETCH_INTERVAL = 1000 * 60;

const getWeatherSignature = (weatherZones: WeatherZone[]) => {
  return weatherZones
    .map((zone) => `${zone.id}:${zone.precipitationMm}:${zone.temperature}:${zone.umbrellaNeeded}`)
    .join("|");
};

const getTrainSignature = (trains: SubwayTrain[]) => {
  return trains
    .map((train) => `${train.id}:${train.line}:${train.isDelayed}:${train.congestion}:${train.arrivalMinutes}`)
    .join("|");
};

export const useSeoulInsights = (
  weatherZones: WeatherZone[],
  trains: SubwayTrain[],
  snapshotId?: string,
) => {
  const weatherSignature = useMemo(() => getWeatherSignature(weatherZones), [weatherZones]);
  const trainSignature = useMemo(() => getTrainSignature(trains), [trains]);

  return useQuery({
    enabled: Boolean(snapshotId),
    queryKey: ["seoul-insights", snapshotId, weatherSignature, trainSignature],
    queryFn: () =>
      getSeoulInsights({
        snapshotId,
        trains,
        weatherZones,
      }),
    retry: 1,
    staleTime: INSIGHT_STALE_TIME,
    refetchInterval: INSIGHT_REFETCH_INTERVAL,
  });
};
