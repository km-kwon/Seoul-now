import type { SeoulInsight, SeoulInsightSeverity, SubwayTrain, WeatherZone } from "../types/dashboard";

const stationZoneKeywords: Array<[string, string]> = [
  ["홍대입구", "mapo"],
  ["합정", "mapo"],
  ["신촌", "mapo"],
  ["이대", "mapo"],
  ["영등포", "yeongdeungpo"],
  ["신도림", "yeongdeungpo"],
  ["시청", "jongno"],
  ["을지로", "jongno"],
  ["종로", "jongno"],
  ["삼성", "gangnam"],
  ["선릉", "gangnam"],
  ["강남", "gangnam"],
  ["역삼", "gangnam"],
  ["교대", "gangnam"],
  ["서초", "gangnam"],
  ["청담", "gangnam"],
  ["논현", "gangnam"],
  ["잠실", "songpa"],
  ["종합운동장", "songpa"],
  ["건대입구", "songpa"],
  ["뚝섬유원지", "songpa"],
  ["상봉", "nowon"],
  ["면목", "nowon"],
  ["군자", "nowon"],
  ["어린이대공원", "nowon"],
];

const lineZoneCoverage: Record<string, string[]> = {
  "2호선": ["mapo", "yeongdeungpo", "jongno", "gangnam", "songpa"],
  "7호선": ["nowon", "songpa", "gangnam"],
};

const unique = <T>(values: T[]) => Array.from(new Set(values));

const getRainyZones = (weatherZones: WeatherZone[]) => {
  return weatherZones.filter((zone) => zone.umbrellaNeeded || zone.precipitationMm >= 0.8);
};

const getTrainZoneIds = (train: SubwayTrain) => {
  const searchableText = `${train.currentLocation} ${train.nextStation} ${train.direction}`;
  const matchedZones = stationZoneKeywords
    .filter(([keyword]) => searchableText.includes(keyword))
    .map(([, zoneId]) => zoneId);

  return unique([...matchedZones, ...(lineZoneCoverage[train.line] ?? [])]);
};

const hasOverlap = (left: string[], right: string[]) => left.some((value) => right.includes(value));

const getSeverityForRain = (zones: WeatherZone[]): SeoulInsightSeverity => {
  const maxPrecipitation = Math.max(...zones.map((zone) => zone.precipitationMm), 0);

  if (zones.length >= 5 || maxPrecipitation >= 3) {
    return "alert";
  }

  if (zones.length >= 2 || maxPrecipitation >= 1.5) {
    return "caution";
  }

  return "info";
};

const getZoneNames = (zones: WeatherZone[]) => zones.map((zone) => zone.name).join(", ");

export const createRainInsights = (
  weatherZones: WeatherZone[],
  trains: SubwayTrain[],
): SeoulInsight[] => {
  const rainyZones = getRainyZones(weatherZones);
  const rainyZoneIds = rainyZones.map((zone) => zone.id);
  const delayedTrains = trains.filter((train) => train.isDelayed);
  const insights: SeoulInsight[] = [];

  if (rainyZones.length > 0) {
    const sortedRainyZones = [...rainyZones].sort(
      (left, right) => right.precipitationMm - left.precipitationMm,
    );
    const topRainyZones = sortedRainyZones.slice(0, 3);

    insights.push({
      id: "umbrella-zones",
      title: "우산 필요 가능성이 높은 권역",
      description: `${getZoneNames(topRainyZones)} 중심으로 강수 신호가 뚜렷합니다. 짧은 도보 이동도 젖을 가능성이 있어요.`,
      severity: getSeverityForRain(rainyZones),
      relatedZones: topRainyZones.map((zone) => zone.id),
      relatedLines: [],
    });
  }

  const rainCrossingTrains = trains.filter((train) =>
    hasOverlap(getTrainZoneIds(train), rainyZoneIds),
  );

  if (rainCrossingTrains.length > 0) {
    const representativeTrains = rainCrossingTrains.slice(0, 2);
    const relatedZones = unique(
      rainCrossingTrains.flatMap((train) =>
        getTrainZoneIds(train).filter((zoneId) => rainyZoneIds.includes(zoneId)),
      ),
    );

    insights.push({
      id: "rain-crossing-trains",
      title: "비 오는 구간을 지나는 열차",
      description: `${representativeTrains.map((train) => train.line).join(", ")} 열차가 강수 권역과 겹칩니다. 역 밖 이동까지 포함하면 체감 이동 시간이 늘 수 있습니다.`,
      severity: rainCrossingTrains.some((train) => train.congestion >= 80) ? "caution" : "info",
      relatedZones,
      relatedLines: unique(rainCrossingTrains.map((train) => train.line)),
    });
  }

  const delayedRainTrains = delayedTrains.filter((train) =>
    hasOverlap(getTrainZoneIds(train), rainyZoneIds),
  );

  if (delayedRainTrains.length > 0) {
    const relatedZones = unique(
      delayedRainTrains.flatMap((train) =>
        getTrainZoneIds(train).filter((zoneId) => rainyZoneIds.includes(zoneId)),
      ),
    );

    insights.push({
      id: "delay-rain-overlap",
      title: "지연 의심 노선과 강수 권역이 겹침",
      description: `${unique(delayedRainTrains.map((train) => train.line)).join(", ")} 지연 신호가 비 오는 권역과 겹쳐 환승 여유가 필요합니다.`,
      severity: "alert",
      relatedZones,
      relatedLines: unique(delayedRainTrains.map((train) => train.line)),
    });
  }

  const easingRainZones = rainyZones.filter(
    (zone) => zone.precipitationMm > 0 && zone.precipitationMm <= 1.2,
  );
  const laterArrivals = trains.filter((train) => train.arrivalMinutes >= 5 && !train.isDelayed);

  if (easingRainZones.length > 0 && laterArrivals.length > 0) {
    const relatedLines = unique(laterArrivals.slice(0, 2).map((train) => train.line));

    insights.push({
      id: "rain-easing-on-arrival",
      title: "도착할 때쯤 비가 약해질 가능성",
      description: `${getZoneNames(easingRainZones.slice(0, 2))}는 강수량이 낮습니다. 5분 이상 뒤 도착하는 열차라면 역 밖 이동 부담이 줄 수 있어요.`,
      severity: "info",
      relatedZones: easingRainZones.slice(0, 2).map((zone) => zone.id),
      relatedLines,
    });
  }

  const nearbyRainStationTrain = trains.find((train) =>
    hasOverlap(
      stationZoneKeywords
        .filter(([keyword]) => `${train.currentLocation} ${train.nextStation}`.includes(keyword))
        .map(([, zoneId]) => zoneId),
      rainyZoneIds,
    ),
  );

  if (nearbyRainStationTrain) {
    const nearbyZones = unique(
      getTrainZoneIds(nearbyRainStationTrain).filter((zoneId) => rainyZoneIds.includes(zoneId)),
    );

    insights.push({
      id: "near-rain-station",
      title: "지금 비 오는 동네에서 가까운 역",
      description: `${nearbyRainStationTrain.currentLocation} 주변은 비 신호가 있습니다. ${nearbyRainStationTrain.nextStation} 도착 전후 보행 구간을 짧게 잡는 편이 좋아요.`,
      severity: nearbyRainStationTrain.congestion >= 80 ? "caution" : "info",
      relatedZones: nearbyZones,
      relatedLines: [nearbyRainStationTrain.line],
    });
  }

  return insights;
};
