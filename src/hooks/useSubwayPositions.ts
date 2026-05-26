import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRealtimeSubwayPositions } from "../api/realtimeSubwayApi";
import type { TimeSnapshot } from "../types/dashboard";

const SUBWAY_STALE_TIME = 1000 * 10;
const SUBWAY_REFETCH_INTERVAL = 1000 * 15;

export const useSubwayPositions = (snapshot?: TimeSnapshot) => {
  const lines = useMemo(() => {
    if (!snapshot) {
      return [] as string[];
    }

    return Array.from(new Set(snapshot.trains.map((train) => train.line)));
  }, [snapshot]);

  return useQuery({
    enabled: Boolean(snapshot),
    queryKey: ["subway-positions", snapshot?.id, lines.join(",")],
    queryFn: () =>
      getRealtimeSubwayPositions({
        lines,
        fallbackTrains: snapshot?.trains ?? [],
      }),
    retry: 1,
    staleTime: SUBWAY_STALE_TIME,
    refetchInterval: SUBWAY_REFETCH_INTERVAL,
  });
};
