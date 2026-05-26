import type { SubwayTrain } from "../types/dashboard";
import type { SubwayApiResponse, SubwayApiTrain } from "../types/api";

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getSubwayTrains = (response: SubwayApiResponse): SubwayApiTrain[] => {
  if (Array.isArray(response.trains)) {
    return response.trains;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.trains)) {
    return response.data.trains;
  }

  throw new Error("Subway response does not include trains.");
};

const getFallbackTrain = (train: SubwayApiTrain, fallbackTrains: SubwayTrain[]) => {
  return fallbackTrains.find(
    (fallbackTrain) =>
      fallbackTrain.id === train.id ||
      fallbackTrain.id === train.trainId ||
      fallbackTrain.line === train.line ||
      fallbackTrain.line === train.lineName,
  );
};

const normalizeCongestion = (value: SubwayApiTrain["congestion"], congestionLevel?: string) => {
  if (value !== undefined) {
    return clamp(toNumber(value, 60), 0, 100);
  }

  if (!congestionLevel) {
    return undefined;
  }

  if (congestionLevel.includes("혼잡")) {
    return 88;
  }

  if (congestionLevel.includes("보통")) {
    return 60;
  }

  if (congestionLevel.includes("여유")) {
    return 35;
  }

  return undefined;
};

const normalizeDelayed = (train: SubwayApiTrain) => {
  if (typeof train.isDelayed === "boolean") {
    return train.isDelayed;
  }

  if (typeof train.delayed === "boolean") {
    return train.delayed;
  }

  const delayMinutes = toNumber(train.delayMinutes ?? train.delay, 0);

  return delayMinutes >= 3 || Boolean(train.status?.includes("지연"));
};

export const normalizeSubway = (
  response: SubwayApiResponse,
  fallbackTrains: SubwayTrain[],
): SubwayTrain[] => {
  const trains = getSubwayTrains(response);

  return trains.map((train, index) => {
    const fallbackTrain = getFallbackTrain(train, fallbackTrains) ?? fallbackTrains[index];
    const congestion =
      normalizeCongestion(train.congestion, train.congestionLevel) ??
      fallbackTrain?.congestion ??
      60;
    const hasDelaySignal =
      train.isDelayed !== undefined ||
      train.delayed !== undefined ||
      train.delayMinutes !== undefined ||
      train.delay !== undefined ||
      train.status !== undefined;

    return {
      id: String(
        train.id ?? train.trainId ?? train.subwayId ?? fallbackTrain?.id ?? `subway-train-${index + 1}`,
      ),
      line: String(train.line ?? train.lineName ?? train.route ?? fallbackTrain?.line ?? "2호선"),
      currentLocation: String(
        train.currentLocation ??
          train.currentStation ??
          train.location ??
          fallbackTrain?.currentLocation ??
          "위치 확인 중",
      ),
      direction: String(
        train.direction ?? train.destination ?? train.updnLine ?? fallbackTrain?.direction ?? "방면 확인 중",
      ),
      isDelayed: hasDelaySignal ? normalizeDelayed(train) : fallbackTrain?.isDelayed ?? false,
      congestion,
      nextStation: String(
        train.nextStation ?? train.next ?? train.statnNm ?? fallbackTrain?.nextStation ?? "다음 역 확인 중",
      ),
      arrivalMinutes: clamp(
        toNumber(
          train.arrivalMinutes ?? train.etaMinutes ?? train.remainingMinutes,
          fallbackTrain?.arrivalMinutes ?? 3,
        ),
        0,
        120,
      ),
    };
  });
};
