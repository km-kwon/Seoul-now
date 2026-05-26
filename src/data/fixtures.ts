import type {
  SeasonTheme,
  SeoulDashboardData,
  SubwayTrain,
  TimeSnapshot,
  TimeSnapshotSummary,
  WeatherZone,
} from "../types/dashboard";

const zone = (
  id: string,
  name: string,
  lat: number,
  lng: number,
  weatherStatus: string,
  precipitationMm: number,
  temperature: number,
  umbrellaNeeded: boolean,
): WeatherZone => ({
  id,
  name,
  coordinates: { lat, lng },
  weatherStatus,
  precipitationMm,
  temperature,
  umbrellaNeeded,
});

const train = (
  id: string,
  line: string,
  currentLocation: string,
  direction: string,
  isDelayed: boolean,
  congestion: number,
  nextStation: string,
  arrivalMinutes: number,
): SubwayTrain => ({
  id,
  line,
  currentLocation,
  direction,
  isDelayed,
  congestion,
  nextStation,
  arrivalMinutes,
});

const summary = (
  headline: string,
  description: string,
  cityMood: string,
  weatherLabel: string,
  transitLabel: string,
  soundMode: TimeSnapshotSummary["soundMode"],
  season: TimeSnapshotSummary["season"],
): TimeSnapshotSummary => ({
  headline,
  description,
  cityMood,
  weatherLabel,
  transitLabel,
  soundMode,
  season,
});

const snapshots: TimeSnapshot[] = [
  {
    id: "now",
    label: "지금",
    time: "2026-05-26T08:10:00+09:00",
    weatherZones: [
      zone("jongno", "종로", 37.5735, 126.9788, "약한 비", 1.8, 18, true),
      zone("mapo", "마포", 37.5663, 126.9019, "비", 2.4, 17, true),
      zone("yeongdeungpo", "영등포", 37.5264, 126.8962, "비", 2.1, 18, true),
      zone("gangnam", "강남", 37.5172, 127.0473, "흐림", 0.3, 20, false),
      zone("nowon", "노원", 37.6542, 127.0568, "구름 많음", 0, 17, false),
      zone("songpa", "송파", 37.5145, 127.1059, "약한 비", 1.2, 19, true),
    ],
    trains: [
      train("train-2-201", "2호선", "삼성역 진입", "신도림 방면", false, 84, "선릉", 2),
      train("train-2-202", "2호선", "홍대입구 출발", "잠실 방면", false, 71, "신촌", 3),
      train("train-7-701", "7호선", "청담역 대기", "장암 방면", true, 88, "강남구청", 6),
      train("train-7-702", "7호선", "건대입구 접근", "석남 방면", false, 62, "어린이대공원", 4),
    ],
    summary: summary(
      "서쪽 비구름과 강남권 혼잡이 겹친 아침",
      "마포, 영등포, 종로, 송파는 우산이 필요하고 7호선 청담 구간은 지연 가능성이 있습니다.",
      "젖은 출근길",
      "비 오는 권역 4곳",
      "2호선 혼잡, 7호선 지연 의심",
      "rain",
      "spring",
    ),
  },
  {
    id: "past-30m",
    label: "30분 전",
    time: "2026-05-26T07:40:00+09:00",
    weatherZones: [
      zone("jongno", "종로", 37.5735, 126.9788, "흐림", 0.2, 17, false),
      zone("mapo", "마포", 37.5663, 126.9019, "약한 비", 0.9, 17, true),
      zone("yeongdeungpo", "영등포", 37.5264, 126.8962, "약한 비", 0.8, 18, true),
      zone("gangnam", "강남", 37.5172, 127.0473, "흐림", 0, 19, false),
      zone("nowon", "노원", 37.6542, 127.0568, "구름 많음", 0, 16, false),
      zone("songpa", "송파", 37.5145, 127.1059, "흐림", 0.1, 18, false),
    ],
    trains: [
      train("train-2-201", "2호선", "역삼역 접근", "신도림 방면", false, 72, "강남", 3),
      train("train-2-202", "2호선", "합정역 출발", "잠실 방면", false, 64, "홍대입구", 2),
      train("train-7-701", "7호선", "학동역 통과", "장암 방면", false, 69, "강남구청", 4),
      train("train-7-702", "7호선", "군자역 대기", "석남 방면", false, 58, "어린이대공원", 5),
    ],
    summary: summary(
      "비는 서쪽부터 들어오고 혼잡은 아직 낮은 상태",
      "마포와 영등포 중심으로 강수 신호가 시작됐고 지하철 흐름은 대체로 안정적이었습니다.",
      "조용한 시작",
      "비 시작",
      "대체로 원활",
      "rain",
      "spring",
    ),
  },
  {
    id: "future-1h",
    label: "1시간 후",
    time: "2026-05-26T09:10:00+09:00",
    weatherZones: [
      zone("jongno", "종로", 37.5735, 126.9788, "비", 2.7, 19, true),
      zone("mapo", "마포", 37.5663, 126.9019, "비", 3.2, 18, true),
      zone("yeongdeungpo", "영등포", 37.5264, 126.8962, "비", 3.0, 19, true),
      zone("gangnam", "강남", 37.5172, 127.0473, "약한 비", 1.1, 20, true),
      zone("nowon", "노원", 37.6542, 127.0568, "흐림", 0.4, 18, false),
      zone("songpa", "송파", 37.5145, 127.1059, "비", 2.4, 20, true),
    ],
    trains: [
      train("train-2-201", "2호선", "교대역 정차", "신도림 방면", false, 79, "서초", 2),
      train("train-2-202", "2호선", "이대역 접근", "잠실 방면", false, 66, "아현", 3),
      train("train-7-701", "7호선", "강남구청역 대기", "장암 방면", true, 91, "학동", 7),
      train("train-7-702", "7호선", "뚝섬유원지역 통과", "석남 방면", false, 60, "청담", 5),
    ],
    summary: summary(
      "강수 권역이 넓어지고 7호선 지연 신호가 커짐",
      "우산 필요 권역이 5곳으로 늘고 7호선 청담-강남구청 주변은 7분 여유가 좋습니다.",
      "느린 오전",
      "비 확산",
      "7호선 지연 의심",
      "rain",
      "spring",
    ),
  },
  {
    id: "commute",
    label: "출근",
    time: "2026-05-26T08:30:00+09:00",
    weatherZones: [
      zone("jongno", "종로", 37.5735, 126.9788, "약한 비", 1.6, 18, true),
      zone("mapo", "마포", 37.5663, 126.9019, "비", 2.5, 17, true),
      zone("yeongdeungpo", "영등포", 37.5264, 126.8962, "비", 2.3, 18, true),
      zone("gangnam", "강남", 37.5172, 127.0473, "흐림", 0.4, 20, false),
      zone("nowon", "노원", 37.6542, 127.0568, "구름 많음", 0, 17, false),
      zone("songpa", "송파", 37.5145, 127.1059, "약한 비", 1.4, 19, true),
    ],
    trains: [
      train("train-2-201", "2호선", "삼성역 정차", "신도림 방면", false, 89, "선릉", 2),
      train("train-2-202", "2호선", "홍대입구 정차", "잠실 방면", false, 78, "신촌", 3),
      train("train-7-701", "7호선", "청담역 대기", "장암 방면", true, 92, "강남구청", 8),
      train("train-7-702", "7호선", "건대입구 접근", "석남 방면", false, 67, "어린이대공원", 4),
    ],
    summary: summary(
      "우산과 환승 여유가 모두 필요한 출근 피크",
      "비 오는 서부권 이동과 강남권 환승이 겹칩니다. 7호선은 지연 의심 상태입니다.",
      "분주한 출근",
      "우산 권장",
      "혼잡 높음",
      "station",
      "spring",
    ),
  },
  {
    id: "lunch",
    label: "점심",
    time: "2026-05-26T12:20:00+09:00",
    weatherZones: [
      zone("jongno", "종로", 37.5735, 126.9788, "흐림", 0.1, 21, false),
      zone("mapo", "마포", 37.5663, 126.9019, "흐림", 0.2, 20, false),
      zone("yeongdeungpo", "영등포", 37.5264, 126.8962, "구름 많음", 0, 21, false),
      zone("gangnam", "강남", 37.5172, 127.0473, "구름 많음", 0, 22, false),
      zone("nowon", "노원", 37.6542, 127.0568, "흐림", 0, 20, false),
      zone("songpa", "송파", 37.5145, 127.1059, "구름 많음", 0, 22, false),
    ],
    trains: [
      train("train-2-201", "2호선", "잠실역 접근", "신도림 방면", false, 54, "종합운동장", 4),
      train("train-2-202", "2호선", "시청역 출발", "잠실 방면", false, 48, "을지로입구", 2),
      train("train-7-701", "7호선", "논현역 통과", "장암 방면", false, 52, "반포", 5),
      train("train-7-702", "7호선", "상봉역 접근", "석남 방면", false, 46, "면목", 3),
    ],
    summary: summary(
      "비는 거의 잦아들고 점심 이동은 가벼움",
      "대부분 권역에서 우산 필요성이 낮고 지하철 혼잡도는 점심 수준으로 내려갑니다.",
      "가벼운 점심",
      "흐림",
      "보통",
      "off",
      "spring",
    ),
  },
  {
    id: "evening",
    label: "퇴근",
    time: "2026-05-26T18:20:00+09:00",
    weatherZones: [
      zone("jongno", "종로", 37.5735, 126.9788, "구름 많음", 0, 20, false),
      zone("mapo", "마포", 37.5663, 126.9019, "흐림", 0.1, 19, false),
      zone("yeongdeungpo", "영등포", 37.5264, 126.8962, "흐림", 0.2, 20, false),
      zone("gangnam", "강남", 37.5172, 127.0473, "구름 많음", 0, 21, false),
      zone("nowon", "노원", 37.6542, 127.0568, "맑아짐", 0, 19, false),
      zone("songpa", "송파", 37.5145, 127.1059, "구름 많음", 0, 21, false),
    ],
    trains: [
      train("train-2-201", "2호선", "역삼역 정차", "신도림 방면", true, 93, "강남", 7),
      train("train-2-202", "2호선", "합정역 접근", "잠실 방면", false, 82, "홍대입구", 3),
      train("train-7-701", "7호선", "고속터미널역 정차", "장암 방면", false, 78, "반포", 4),
      train("train-7-702", "7호선", "뚝섬유원지역 출발", "석남 방면", false, 70, "청담", 5),
    ],
    summary: summary(
      "비는 멎고 2호선 퇴근 혼잡이 가장 큼",
      "날씨는 안정되지만 2호선 강남 방향 정체가 두드러져 환승 시간 확보가 좋습니다.",
      "느린 퇴근",
      "비 그침",
      "2호선 지연 의심",
      "station",
      "spring",
    ),
  },
];

export const seasonThemesFixture: SeasonTheme[] = [
  {
    season: "spring",
    particleType: "petal",
    accentColor: "#3182F6",
    density: 0.28,
  },
  {
    season: "summer",
    particleType: "mist",
    accentColor: "#14B8A6",
    density: 0.36,
  },
  {
    season: "autumn",
    particleType: "leaf",
    accentColor: "#F59E0B",
    density: 0.22,
  },
  {
    season: "winter",
    particleType: "snow",
    accentColor: "#60A5FA",
    density: 0.42,
  },
];

const snapshotPresetOrder = ["past-30m", "now", "future-1h", "commute", "lunch", "evening"];
const orderedSnapshots = snapshotPresetOrder
  .map((snapshotId) => snapshots.find((snapshot) => snapshot.id === snapshotId))
  .filter((snapshot): snapshot is TimeSnapshot => Boolean(snapshot));

export const seoulDashboardFixture: SeoulDashboardData = {
  generatedAt: "2026-05-26T08:10:00+09:00",
  currentSnapshotId: "now",
  defaultSoundMode: "rain",
  snapshots: orderedSnapshots,
  seasonThemes: seasonThemesFixture,
};
