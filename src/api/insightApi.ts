import { createApiResult, createFixtureResult, fetchJson } from "./apiClient";
import { createRainInsights } from "../utils/rainInsight";
import type { SeoulInsight, SubwayTrain, WeatherZone } from "../types/dashboard";
import type { ApiResourceResult, InsightApiResponse, InsightApiItem } from "../types/api";

type InsightApiOptions = {
  snapshotId?: string;
  trains: SubwayTrain[];
  weatherZones: WeatherZone[];
};

const getInsights = (response: InsightApiResponse): InsightApiItem[] => {
  if (Array.isArray(response.insights)) {
    return response.insights;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  if (response.data && Array.isArray(response.data.insights)) {
    return response.data.insights;
  }

  throw new Error("Insight response does not include insights.");
};

const normalizeInsights = (response: InsightApiResponse): SeoulInsight[] => {
  return getInsights(response).map((insight, index) => ({
    id: String(insight.id ?? `insight-${index + 1}`),
    title: String(insight.title ?? "서울 흐름 인사이트"),
    description: String(insight.description ?? "날씨와 지하철 흐름을 함께 확인하세요."),
    severity: insight.severity ?? "info",
    relatedZones: insight.relatedZones ?? [],
    relatedLines: insight.relatedLines ?? [],
  }));
};

export const getSeoulInsights = async ({
  snapshotId,
  trains,
  weatherZones,
}: InsightApiOptions): Promise<ApiResourceResult<SeoulInsight[]>> => {
  const fallbackInsights = createRainInsights(weatherZones, trains);

  try {
    const response = await fetchJson<InsightApiResponse>("/insights", { snapshotId });

    try {
      const insights = normalizeInsights(response);

      return createApiResult(insights);
    } catch {
      return createFixtureResult(
        fallbackInsights,
        "normalize-failed",
        "인사이트 API 응답 형식이 달라 로컬 계산 결과를 사용합니다.",
      );
    }
  } catch (error) {
    const reason =
      error instanceof Error && error.message.includes("base URL")
        ? "missing-base-url"
        : "request-failed";

    return createFixtureResult(
      fallbackInsights,
      reason,
      reason === "missing-base-url"
        ? "인사이트 API base URL이 없어 로컬 계산 결과를 사용합니다."
        : "인사이트 API 요청에 실패해 로컬 계산 결과를 사용합니다.",
    );
  }
};
