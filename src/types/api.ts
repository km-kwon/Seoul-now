import type { Coordinates, SeoulInsightSeverity } from "./dashboard";

export type ApiFallbackReason =
  | "missing-base-url"
  | "request-failed"
  | "normalize-failed";

export type ApiDataSource = "api" | "fixture";

export type ApiResourceResult<T> = {
  data: T;
  receivedAt: string;
  source: ApiDataSource;
  fallbackReason?: ApiFallbackReason;
  message?: string;
};

export type WeatherApiZone = {
  id?: string;
  name?: string;
  coordinates?: Partial<Coordinates>;
  lat?: number | string;
  lng?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  weatherStatus?: string;
  status?: string;
  condition?: string;
  precipitationMm?: number | string;
  precipitation?: number | string;
  rainfallMm?: number | string;
  temperature?: number | string;
  temperatureC?: number | string;
  umbrellaNeeded?: boolean;
  umbrella?: boolean;
};

export type WeatherApiResponse = {
  generatedAt?: string;
  data?: WeatherApiZone[] | { zones?: WeatherApiZone[]; weatherZones?: WeatherApiZone[] };
  zones?: WeatherApiZone[];
  weatherZones?: WeatherApiZone[];
};

export type SubwayApiTrain = {
  id?: string;
  trainId?: string;
  subwayId?: string;
  line?: string;
  lineName?: string;
  route?: string;
  currentLocation?: string;
  currentStation?: string;
  location?: string;
  direction?: string;
  destination?: string;
  updnLine?: string;
  isDelayed?: boolean;
  delayed?: boolean;
  delayMinutes?: number | string;
  delay?: number | string;
  status?: string;
  congestion?: number | string;
  congestionLevel?: string;
  nextStation?: string;
  next?: string;
  statnNm?: string;
  arrivalMinutes?: number | string;
  etaMinutes?: number | string;
  remainingMinutes?: number | string;
};

export type SubwayApiResponse = {
  generatedAt?: string;
  data?: SubwayApiTrain[] | { trains?: SubwayApiTrain[] };
  trains?: SubwayApiTrain[];
};

export type SeoulRealtimePositionItem = {
  subwayId?: string;
  subwayNm?: string;
  statnId?: string;
  statnNm?: string;
  trainNo?: string;
  updnLine?: string;
  statnTid?: string;
  statnTnm?: string;
  trainSttus?: string;
  directAt?: string;
  lstcarAt?: string;
  recptnDt?: string;
};

export type SeoulRealtimePositionResponse = {
  errorMessage?: {
    status?: number;
    code?: string;
    message?: string;
    total?: number;
  };
  realtimePositionList?: SeoulRealtimePositionItem[];
};

export type InsightApiItem = {
  id?: string;
  title?: string;
  description?: string;
  severity?: SeoulInsightSeverity;
  relatedZones?: string[];
  relatedLines?: string[];
};

export type InsightApiResponse = {
  generatedAt?: string;
  data?: InsightApiItem[] | { insights?: InsightApiItem[] };
  insights?: InsightApiItem[];
};
