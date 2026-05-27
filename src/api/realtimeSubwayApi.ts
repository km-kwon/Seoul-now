import type { SubwayTrain } from "../types/dashboard";
import type {
  ApiResourceResult,
  SeoulRealtimePositionItem,
  SeoulRealtimePositionResponse,
} from "../types/api";
import { createApiResult, createFixtureResult } from "./apiClient";
import { findStationCoordinates } from "../data/stationCoordinates";

const REALTIME_ENDPOINT = "/seoul-openapi/json/realtimePosition/0/200";

const trainStatusLabel: Record<string, string> = {
  "0": "진입",
  "1": "도착",
  "2": "출발",
  "3": "전역출발",
};

const isOpenApiKeyConfigured = () =>
  Boolean(import.meta.env.VITE_SEOUL_OPENAPI_KEY?.trim());

const cleanApiText = (value?: string) => {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
};

const buildCurrentLocation = (item: SeoulRealtimePositionItem) => {
  const statn = cleanApiText(item.statnNm);
  const status = item.trainSttus ? trainStatusLabel[item.trainSttus] : undefined;

  if (!statn) {
    return "위치 확인 중";
  }

  return status ? `${statn}역 ${status}` : `${statn}역`;
};

const buildDirection = (item: SeoulRealtimePositionItem) => {
  const terminalStation = cleanApiText(item.statnTnm);

  if (terminalStation) {
    return `${terminalStation} 방면`;
  }

  if (item.updnLine === "0") {
    return "상행";
  }

  if (item.updnLine === "1") {
    return "하행";
  }

  return "방면 확인 중";
};

const mapItemToTrain = (
  item: SeoulRealtimePositionItem,
  fallbackTrains: SubwayTrain[],
  index: number,
  requestedLine?: string,
): SubwayTrain => {
  const line = cleanApiText(item.subwayNm) ?? requestedLine ?? "지하철";
  const fallback =
    fallbackTrains.find((train) => train.line === line) ?? fallbackTrains[index];

  const currentStation = cleanApiText(item.statnNm);
  const terminalStation = cleanApiText(item.statnTnm);
  const coordinates = currentStation
    ? findStationCoordinates(currentStation, line)
    : undefined;

  return {
    id: `seoul-${item.subwayId ?? line}-${item.trainNo ?? index}`,
    line,
    currentLocation: buildCurrentLocation(item),
    direction: buildDirection(item),
    isDelayed: false,
    congestion: fallback?.congestion ?? 60,
    nextStation: terminalStation ?? currentStation ?? "위치 갱신 대기",
    arrivalMinutes: item.trainSttus === "1" ? 0 : item.trainSttus === "0" ? 1 : 3,
    coordinates,
  };
};

const enrichFixtureWithCoordinates = (trains: SubwayTrain[]): SubwayTrain[] => {
  return trains.map((train) => {
    if (train.coordinates) {
      return train;
    }

    const coordinates =
      findStationCoordinates(train.currentLocation, train.line) ??
      findStationCoordinates(train.nextStation, train.line);

    return { ...train, coordinates };
  });
};

type RealtimeSubwayOptions = {
  lines: string[];
  fallbackTrains: SubwayTrain[];
};

export const getRealtimeSubwayPositions = async ({
  lines,
  fallbackTrains,
}: RealtimeSubwayOptions): Promise<ApiResourceResult<SubwayTrain[]>> => {
  if (!isOpenApiKeyConfigured()) {
    return createFixtureResult(
      enrichFixtureWithCoordinates(fallbackTrains),
      "missing-base-url",
      "VITE_SEOUL_OPENAPI_KEY가 없어 fixture 지하철 데이터를 지도에 표시합니다.",
    );
  }

  try {
    const responses = await Promise.all(
      lines.map(async (line) => {
        const url = `${REALTIME_ENDPOINT}/${encodeURIComponent(line)}`;
        const response = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Seoul OpenAPI ${line} request failed: ${response.status}`);
        }

        return {
          line,
          response: (await response.json()) as SeoulRealtimePositionResponse,
        };
      }),
    );

    const merged = responses
      .flatMap(({ line, response }) =>
        (response.realtimePositionList ?? []).map((item) => ({ item, line })),
      )
      .map(({ item, line }, index) => mapItemToTrain(item, fallbackTrains, index, line))
      .filter((train) => train.coordinates !== undefined);

    if (merged.length === 0) {
      return createFixtureResult(
        enrichFixtureWithCoordinates(fallbackTrains),
        "normalize-failed",
        "서울시 OpenAPI 응답에 좌표로 매칭되는 열차가 없어 fixture를 사용합니다.",
      );
    }

    return createApiResult(merged);
  } catch (error) {
    const message =
      error instanceof Error
        ? `서울시 OpenAPI 호출 실패 (${error.message}) — fixture로 대체합니다.`
        : "서울시 OpenAPI 호출 실패 — fixture로 대체합니다.";

    return createFixtureResult(
      enrichFixtureWithCoordinates(fallbackTrains),
      "request-failed",
      message,
    );
  }
};
