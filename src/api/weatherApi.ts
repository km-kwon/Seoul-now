import { fetchJson, createApiResult, createFixtureResult } from "./apiClient";
import { normalizeWeather } from "./normalizeWeather";
import type { WeatherZone } from "../types/dashboard";
import type { ApiResourceResult, WeatherApiResponse } from "../types/api";

type WeatherApiOptions = {
  fallbackZones: WeatherZone[];
  snapshotId?: string;
};

export const getWeather = async ({
  fallbackZones,
  snapshotId,
}: WeatherApiOptions): Promise<ApiResourceResult<WeatherZone[]>> => {
  try {
    const response = await fetchJson<WeatherApiResponse>("/weather", { snapshotId });

    try {
      const weatherZones = normalizeWeather(response, fallbackZones);

      return createApiResult(weatherZones);
    } catch {
      return createFixtureResult(
        fallbackZones,
        "normalize-failed",
        "날씨 API 응답 형식이 달라 fixture 날씨를 사용합니다.",
      );
    }
  } catch (error) {
    const reason =
      error instanceof Error && error.message.includes("base URL")
        ? "missing-base-url"
        : "request-failed";

    return createFixtureResult(
      fallbackZones,
      reason,
      reason === "missing-base-url"
        ? "VITE_SEOUL_NOW_API_BASE_URL이 없어 fixture 날씨를 사용합니다."
        : "날씨 API 요청에 실패해 fixture 날씨를 사용합니다.",
    );
  }
};
