import type { AmbientSoundMode, SeasonName, SubwayTrain, WeatherZone } from "../types/dashboard";

export const formatTemperature = (value: number) => `${Math.round(value)}°`;

export const formatPrecipitation = (value: number) => {
  if (value <= 0) {
    return "강수 없음";
  }

  return `${value.toFixed(1)}mm`;
};

export const formatGeneratedTime = (value: string) => {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
};

export const formatClockTime = (value: Date) => {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(value);
};

export const getAverageTemperature = (zones: WeatherZone[]) => {
  const total = zones.reduce((sum, zone) => sum + zone.temperature, 0);
  return total / Math.max(zones.length, 1);
};

export const getUmbrellaZoneCount = (zones: WeatherZone[]) => {
  return zones.filter((zone) => zone.umbrellaNeeded).length;
};

export const getTrainStatusLabel = (train: SubwayTrain) => {
  if (train.isDelayed) {
    return "지연 의심";
  }

  if (train.congestion >= 80) {
    return "혼잡";
  }

  if (train.congestion >= 60) {
    return "보통";
  }

  return "원활";
};

export const getSubwayLineColor = (line: string) => {
  if (line === "2호선") {
    return "#00A84D";
  }

  if (line === "7호선") {
    return "#747F00";
  }

  return "#3182F6";
};

export const getArrivalText = (minutes: number) => {
  if (minutes <= 1) {
    return "곧 도착";
  }

  return `${minutes}분 후`;
};

export const getSoundModeLabel = (mode: AmbientSoundMode) => {
  const labels: Record<AmbientSoundMode, string> = {
    off: "사운드 꺼짐",
    rain: "비 오는 서울",
    station: "역사 안내음",
    night: "야간 도심",
  };

  return labels[mode];
};

export const getSeasonLabel = (season: SeasonName) => {
  const labels: Record<SeasonName, string> = {
    spring: "봄",
    summer: "여름",
    autumn: "가을",
    winter: "겨울",
  };

  return labels[season];
};
