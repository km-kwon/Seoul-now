import type { ApiFallbackReason, ApiResourceResult } from "../types/api";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, "");

export const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_SEOUL_NOW_API_BASE_URL;

  return typeof baseUrl === "string" && baseUrl.trim().length > 0
    ? trimTrailingSlash(baseUrl.trim())
    : undefined;
};

export const buildApiUrl = (path: string, params?: Record<string, string | undefined>) => {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return undefined;
  }

  const url = `${baseUrl}/${trimLeadingSlash(path)}`;
  const query = new URLSearchParams();

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `${url}?${queryString}` : url;
};

export const createFixtureResult = <T>(
  data: T,
  fallbackReason: ApiFallbackReason,
  message: string,
): ApiResourceResult<T> => ({
  data,
  fallbackReason,
  message,
  receivedAt: new Date().toISOString(),
  source: "fixture",
});

export const createApiResult = <T>(data: T): ApiResourceResult<T> => ({
  data,
  receivedAt: new Date().toISOString(),
  source: "api",
});

export const fetchJson = async <T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> => {
  const url = buildApiUrl(path, params);

  if (!url) {
    throw new Error("API base URL is not configured.");
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with ${response.status}.`);
  }

  return response.json() as Promise<T>;
};
