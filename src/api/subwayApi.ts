import { fetchJson, createApiResult, createFixtureResult } from "./apiClient";
import { normalizeSubway } from "./normalizeSubway";
import type { SubwayTrain } from "../types/dashboard";
import type { ApiResourceResult, SubwayApiResponse } from "../types/api";

type SubwayApiOptions = {
  fallbackTrains: SubwayTrain[];
  snapshotId?: string;
};

export const getSubwayPositions = async ({
  fallbackTrains,
  snapshotId,
}: SubwayApiOptions): Promise<ApiResourceResult<SubwayTrain[]>> => {
  try {
    const response = await fetchJson<SubwayApiResponse>("/subway", { snapshotId });

    try {
      const trains = normalizeSubway(response, fallbackTrains);

      return createApiResult(trains);
    } catch {
      return createFixtureResult(
        fallbackTrains,
        "normalize-failed",
        "지하철 API 응답 형식이 달라 fixture 지하철 데이터를 사용합니다.",
      );
    }
  } catch (error) {
    const reason =
      error instanceof Error && error.message.includes("base URL")
        ? "missing-base-url"
        : "request-failed";

    return createFixtureResult(
      fallbackTrains,
      reason,
      reason === "missing-base-url"
        ? "VITE_SEOUL_NOW_API_BASE_URL이 없어 fixture 지하철 데이터를 사용합니다."
        : "지하철 API 요청에 실패해 fixture 지하철 데이터를 사용합니다.",
    );
  }
};
