import type { Coordinates } from "../types/dashboard";

type StationCoordinateRecord = {
  name: string;
  line: string;
  coordinates: Coordinates;
};

// 2호선/7호선 주요 정거장의 실제 위/경도. 서울교통공사 공개 자료 기준.
// 새 노선/역을 추가할 때는 같은 형식으로 push하면 자동으로 매칭됩니다.
export const stationCoordinates: StationCoordinateRecord[] = [
  // 2호선 (본선 일부)
  { name: "시청", line: "2호선", coordinates: { lat: 37.5651, lng: 126.9784 } },
  { name: "을지로입구", line: "2호선", coordinates: { lat: 37.5660, lng: 126.9826 } },
  { name: "을지로", line: "2호선", coordinates: { lat: 37.5660, lng: 126.9826 } },
  { name: "을지로3가", line: "2호선", coordinates: { lat: 37.5662, lng: 126.9914 } },
  { name: "을지로4가", line: "2호선", coordinates: { lat: 37.5664, lng: 126.9979 } },
  { name: "동대문역사문화공원", line: "2호선", coordinates: { lat: 37.5650, lng: 127.0078 } },
  { name: "신당", line: "2호선", coordinates: { lat: 37.5654, lng: 127.0177 } },
  { name: "상왕십리", line: "2호선", coordinates: { lat: 37.5645, lng: 127.0290 } },
  { name: "왕십리", line: "2호선", coordinates: { lat: 37.5611, lng: 127.0376 } },
  { name: "한양대", line: "2호선", coordinates: { lat: 37.5552, lng: 127.0438 } },
  { name: "뚝섬", line: "2호선", coordinates: { lat: 37.5474, lng: 127.0473 } },
  { name: "성수", line: "2호선", coordinates: { lat: 37.5446, lng: 127.0559 } },
  { name: "건대입구", line: "2호선", coordinates: { lat: 37.5403, lng: 127.0700 } },
  { name: "구의", line: "2호선", coordinates: { lat: 37.5371, lng: 127.0857 } },
  { name: "강변", line: "2호선", coordinates: { lat: 37.5350, lng: 127.0946 } },
  { name: "잠실나루", line: "2호선", coordinates: { lat: 37.5202, lng: 127.1037 } },
  { name: "잠실", line: "2호선", coordinates: { lat: 37.5132, lng: 127.1000 } },
  { name: "잠실새내", line: "2호선", coordinates: { lat: 37.5113, lng: 127.0863 } },
  { name: "종합운동장", line: "2호선", coordinates: { lat: 37.5110, lng: 127.0735 } },
  { name: "삼성", line: "2호선", coordinates: { lat: 37.5089, lng: 127.0631 } },
  { name: "선릉", line: "2호선", coordinates: { lat: 37.5045, lng: 127.0490 } },
  { name: "역삼", line: "2호선", coordinates: { lat: 37.5006, lng: 127.0364 } },
  { name: "강남", line: "2호선", coordinates: { lat: 37.4979, lng: 127.0276 } },
  { name: "교대", line: "2호선", coordinates: { lat: 37.4934, lng: 127.0143 } },
  { name: "서초", line: "2호선", coordinates: { lat: 37.4914, lng: 127.0078 } },
  { name: "방배", line: "2호선", coordinates: { lat: 37.4814, lng: 126.9974 } },
  { name: "사당", line: "2호선", coordinates: { lat: 37.4766, lng: 126.9817 } },
  { name: "낙성대", line: "2호선", coordinates: { lat: 37.4768, lng: 126.9637 } },
  { name: "서울대입구", line: "2호선", coordinates: { lat: 37.4811, lng: 126.9526 } },
  { name: "봉천", line: "2호선", coordinates: { lat: 37.4827, lng: 126.9417 } },
  { name: "신림", line: "2호선", coordinates: { lat: 37.4842, lng: 126.9296 } },
  { name: "신대방", line: "2호선", coordinates: { lat: 37.4873, lng: 126.9131 } },
  { name: "구로디지털단지", line: "2호선", coordinates: { lat: 37.4854, lng: 126.9015 } },
  { name: "대림", line: "2호선", coordinates: { lat: 37.4926, lng: 126.8954 } },
  { name: "신도림", line: "2호선", coordinates: { lat: 37.5089, lng: 126.8911 } },
  { name: "문래", line: "2호선", coordinates: { lat: 37.5180, lng: 126.8946 } },
  { name: "영등포구청", line: "2호선", coordinates: { lat: 37.5246, lng: 126.8961 } },
  { name: "당산", line: "2호선", coordinates: { lat: 37.5347, lng: 126.9027 } },
  { name: "합정", line: "2호선", coordinates: { lat: 37.5495, lng: 126.9136 } },
  { name: "홍대입구", line: "2호선", coordinates: { lat: 37.5572, lng: 126.9245 } },
  { name: "신촌", line: "2호선", coordinates: { lat: 37.5550, lng: 126.9366 } },
  { name: "이대", line: "2호선", coordinates: { lat: 37.5566, lng: 126.9458 } },
  { name: "아현", line: "2호선", coordinates: { lat: 37.5572, lng: 126.9554 } },
  { name: "충정로", line: "2호선", coordinates: { lat: 37.5598, lng: 126.9636 } },

  // 7호선 (강남/도봉/광명 일부)
  { name: "장암", line: "7호선", coordinates: { lat: 37.7036, lng: 127.0506 } },
  { name: "도봉산", line: "7호선", coordinates: { lat: 37.6892, lng: 127.0463 } },
  { name: "수락산", line: "7호선", coordinates: { lat: 37.6781, lng: 127.0556 } },
  { name: "마들", line: "7호선", coordinates: { lat: 37.6655, lng: 127.0651 } },
  { name: "노원", line: "7호선", coordinates: { lat: 37.6557, lng: 127.0612 } },
  { name: "중계", line: "7호선", coordinates: { lat: 37.6444, lng: 127.0747 } },
  { name: "하계", line: "7호선", coordinates: { lat: 37.6363, lng: 127.0680 } },
  { name: "공릉", line: "7호선", coordinates: { lat: 37.6251, lng: 127.0728 } },
  { name: "태릉입구", line: "7호선", coordinates: { lat: 37.6175, lng: 127.0744 } },
  { name: "먹골", line: "7호선", coordinates: { lat: 37.6105, lng: 127.0775 } },
  { name: "중화", line: "7호선", coordinates: { lat: 37.6024, lng: 127.0789 } },
  { name: "상봉", line: "7호선", coordinates: { lat: 37.5963, lng: 127.0855 } },
  { name: "면목", line: "7호선", coordinates: { lat: 37.5887, lng: 127.0879 } },
  { name: "사가정", line: "7호선", coordinates: { lat: 37.5809, lng: 127.0888 } },
  { name: "용마산", line: "7호선", coordinates: { lat: 37.5732, lng: 127.0890 } },
  { name: "중곡", line: "7호선", coordinates: { lat: 37.5658, lng: 127.0843 } },
  { name: "군자", line: "7호선", coordinates: { lat: 37.5571, lng: 127.0796 } },
  { name: "어린이대공원", line: "7호선", coordinates: { lat: 37.5479, lng: 127.0738 } },
  { name: "건대입구", line: "7호선", coordinates: { lat: 37.5403, lng: 127.0700 } },
  { name: "뚝섬유원지", line: "7호선", coordinates: { lat: 37.5316, lng: 127.0670 } },
  { name: "청담", line: "7호선", coordinates: { lat: 37.5193, lng: 127.0533 } },
  { name: "강남구청", line: "7호선", coordinates: { lat: 37.5172, lng: 127.0413 } },
  { name: "학동", line: "7호선", coordinates: { lat: 37.5142, lng: 127.0319 } },
  { name: "논현", line: "7호선", coordinates: { lat: 37.5110, lng: 127.0218 } },
  { name: "반포", line: "7호선", coordinates: { lat: 37.5080, lng: 127.0117 } },
  { name: "고속터미널", line: "7호선", coordinates: { lat: 37.5048, lng: 127.0048 } },
  { name: "내방", line: "7호선", coordinates: { lat: 37.4870, lng: 126.9942 } },
  { name: "총신대입구(이수)", line: "7호선", coordinates: { lat: 37.4866, lng: 126.9817 } },
  { name: "이수", line: "7호선", coordinates: { lat: 37.4866, lng: 126.9817 } },
];

const stationMap = new Map<string, StationCoordinateRecord>();

stationCoordinates.forEach((record) => {
  stationMap.set(`${record.line}:${record.name}`, record);

  if (!stationMap.has(record.name)) {
    stationMap.set(record.name, record);
  }
});

const stripStationSuffix = (raw: string) => {
  // "삼성역 진입", "홍대입구 출발" 같은 표현에서 역명만 추출
  return raw
    .replace(/역\b/g, "")
    .replace(/[\(\[].*?[\)\]]/g, "")
    .replace(/\s+(진입|출발|정차|통과|접근|대기|도착)$/g, "")
    .trim();
};

export const findStationCoordinates = (
  rawName: string,
  line?: string,
): Coordinates | undefined => {
  if (!rawName) {
    return undefined;
  }

  const cleaned = stripStationSuffix(rawName);

  if (line) {
    const exact = stationMap.get(`${line}:${cleaned}`);
    if (exact) {
      return exact.coordinates;
    }
  }

  const generic = stationMap.get(cleaned);
  if (generic) {
    return generic.coordinates;
  }

  // 부분 일치 fallback ("을지로입구" ↔ "을지로", "총신대입구(이수)" ↔ "이수")
  for (const record of stationCoordinates) {
    if (line && record.line !== line) {
      continue;
    }

    if (cleaned.includes(record.name) || record.name.includes(cleaned)) {
      return record.coordinates;
    }
  }

  return undefined;
};

export const interpolateBetweenStations = (
  fromName: string,
  toName: string,
  line: string,
  ratio = 0.5,
): Coordinates | undefined => {
  const from = findStationCoordinates(fromName, line);
  const to = findStationCoordinates(toName, line);

  if (!from || !to) {
    return from ?? to;
  }

  return {
    lat: from.lat + (to.lat - from.lat) * ratio,
    lng: from.lng + (to.lng - from.lng) * ratio,
  };
};
