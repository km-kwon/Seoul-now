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

  // 1호선 (서울 도심 구간)
  { name: "서울역", line: "1호선", coordinates: { lat: 37.5547, lng: 126.9707 } },
  { name: "시청", line: "1호선", coordinates: { lat: 37.5645, lng: 126.9774 } },
  { name: "종각", line: "1호선", coordinates: { lat: 37.5703, lng: 126.9826 } },
  { name: "종로3가", line: "1호선", coordinates: { lat: 37.5715, lng: 126.9919 } },
  { name: "종로5가", line: "1호선", coordinates: { lat: 37.5710, lng: 127.0017 } },
  { name: "동대문", line: "1호선", coordinates: { lat: 37.5715, lng: 127.0090 } },
  { name: "신설동", line: "1호선", coordinates: { lat: 37.5755, lng: 127.0252 } },
  { name: "제기동", line: "1호선", coordinates: { lat: 37.5783, lng: 127.0349 } },
  { name: "청량리", line: "1호선", coordinates: { lat: 37.5803, lng: 127.0466 } },

  // 3호선 (도심/강남 구간)
  { name: "독립문", line: "3호선", coordinates: { lat: 37.5728, lng: 126.9586 } },
  { name: "경복궁", line: "3호선", coordinates: { lat: 37.5759, lng: 126.9735 } },
  { name: "안국", line: "3호선", coordinates: { lat: 37.5765, lng: 126.9853 } },
  { name: "종로3가", line: "3호선", coordinates: { lat: 37.5715, lng: 126.9919 } },
  { name: "충무로", line: "3호선", coordinates: { lat: 37.5612, lng: 126.9943 } },
  { name: "동대입구", line: "3호선", coordinates: { lat: 37.5582, lng: 127.0021 } },
  { name: "약수", line: "3호선", coordinates: { lat: 37.5547, lng: 127.0103 } },
  { name: "압구정", line: "3호선", coordinates: { lat: 37.5275, lng: 127.0289 } },
  { name: "신사", line: "3호선", coordinates: { lat: 37.5163, lng: 127.0203 } },
  { name: "고속터미널", line: "3호선", coordinates: { lat: 37.5048, lng: 127.0048 } },
  { name: "양재", line: "3호선", coordinates: { lat: 37.4847, lng: 127.0344 } },
  { name: "수서", line: "3호선", coordinates: { lat: 37.4874, lng: 127.1023 } },

  // 4호선 (도심/북부 구간)
  { name: "노원", line: "4호선", coordinates: { lat: 37.6555, lng: 127.0612 } },
  { name: "창동", line: "4호선", coordinates: { lat: 37.6533, lng: 127.0473 } },
  { name: "쌍문", line: "4호선", coordinates: { lat: 37.6485, lng: 127.0345 } },
  { name: "미아", line: "4호선", coordinates: { lat: 37.6266, lng: 127.0259 } },
  { name: "길음", line: "4호선", coordinates: { lat: 37.6035, lng: 127.0250 } },
  { name: "한성대입구", line: "4호선", coordinates: { lat: 37.5891, lng: 127.0064 } },
  { name: "혜화", line: "4호선", coordinates: { lat: 37.5826, lng: 127.0019 } },
  { name: "동대문", line: "4호선", coordinates: { lat: 37.5715, lng: 127.0090 } },
  { name: "명동", line: "4호선", coordinates: { lat: 37.5612, lng: 126.9862 } },
  { name: "서울역", line: "4호선", coordinates: { lat: 37.5547, lng: 126.9707 } },
  { name: "이촌", line: "4호선", coordinates: { lat: 37.5223, lng: 126.9747 } },
  { name: "동작", line: "4호선", coordinates: { lat: 37.5031, lng: 126.9794 } },
  { name: "사당", line: "4호선", coordinates: { lat: 37.4766, lng: 126.9817 } },

  // 5호선 (강서~강동 횡단)
  { name: "김포공항", line: "5호선", coordinates: { lat: 37.5621, lng: 126.8016 } },
  { name: "발산", line: "5호선", coordinates: { lat: 37.5587, lng: 126.8378 } },
  { name: "화곡", line: "5호선", coordinates: { lat: 37.5413, lng: 126.8403 } },
  { name: "목동", line: "5호선", coordinates: { lat: 37.5260, lng: 126.8753 } },
  { name: "여의도", line: "5호선", coordinates: { lat: 37.5215, lng: 126.9243 } },
  { name: "공덕", line: "5호선", coordinates: { lat: 37.5443, lng: 126.9514 } },
  { name: "충정로", line: "5호선", coordinates: { lat: 37.5598, lng: 126.9636 } },
  { name: "광화문", line: "5호선", coordinates: { lat: 37.5715, lng: 126.9764 } },
  { name: "동대문역사문화공원", line: "5호선", coordinates: { lat: 37.5650, lng: 127.0078 } },
  { name: "왕십리", line: "5호선", coordinates: { lat: 37.5611, lng: 127.0376 } },
  { name: "답십리", line: "5호선", coordinates: { lat: 37.5667, lng: 127.0530 } },
  { name: "군자", line: "5호선", coordinates: { lat: 37.5571, lng: 127.0796 } },
  { name: "광나루", line: "5호선", coordinates: { lat: 37.5453, lng: 127.1037 } },
  { name: "천호", line: "5호선", coordinates: { lat: 37.5384, lng: 127.1238 } },
  { name: "상일동", line: "5호선", coordinates: { lat: 37.5571, lng: 127.1668 } },

  // 6호선 (도심 외곽 환승축)
  { name: "응암", line: "6호선", coordinates: { lat: 37.5980, lng: 126.9156 } },
  { name: "디지털미디어시티", line: "6호선", coordinates: { lat: 37.5764, lng: 126.9009 } },
  { name: "월드컵경기장", line: "6호선", coordinates: { lat: 37.5681, lng: 126.8993 } },
  { name: "합정", line: "6호선", coordinates: { lat: 37.5495, lng: 126.9136 } },
  { name: "공덕", line: "6호선", coordinates: { lat: 37.5443, lng: 126.9514 } },
  { name: "삼각지", line: "6호선", coordinates: { lat: 37.5347, lng: 126.9731 } },
  { name: "이태원", line: "6호선", coordinates: { lat: 37.5345, lng: 126.9945 } },
  { name: "약수", line: "6호선", coordinates: { lat: 37.5547, lng: 127.0103 } },
  { name: "동묘앞", line: "6호선", coordinates: { lat: 37.5728, lng: 127.0162 } },
  { name: "안암", line: "6호선", coordinates: { lat: 37.5862, lng: 127.0294 } },
  { name: "고려대", line: "6호선", coordinates: { lat: 37.5907, lng: 127.0327 } },
  { name: "월곡", line: "6호선", coordinates: { lat: 37.6029, lng: 127.0419 } },
  { name: "석계", line: "6호선", coordinates: { lat: 37.6149, lng: 127.0658 } },
  { name: "태릉입구", line: "6호선", coordinates: { lat: 37.6175, lng: 127.0744 } },
  { name: "봉화산", line: "6호선", coordinates: { lat: 37.6184, lng: 127.0934 } },

  // 8호선 (잠실/송파~성남)
  { name: "암사", line: "8호선", coordinates: { lat: 37.5497, lng: 127.1276 } },
  { name: "천호", line: "8호선", coordinates: { lat: 37.5384, lng: 127.1238 } },
  { name: "강동구청", line: "8호선", coordinates: { lat: 37.5302, lng: 127.1240 } },
  { name: "몽촌토성", line: "8호선", coordinates: { lat: 37.5172, lng: 127.1117 } },
  { name: "잠실", line: "8호선", coordinates: { lat: 37.5132, lng: 127.1000 } },
  { name: "석촌", line: "8호선", coordinates: { lat: 37.5050, lng: 127.1063 } },
  { name: "송파", line: "8호선", coordinates: { lat: 37.4985, lng: 127.1115 } },
  { name: "가락시장", line: "8호선", coordinates: { lat: 37.4925, lng: 127.1182 } },
  { name: "문정", line: "8호선", coordinates: { lat: 37.4859, lng: 127.1227 } },
  { name: "장지", line: "8호선", coordinates: { lat: 37.4787, lng: 127.1262 } },
  { name: "복정", line: "8호선", coordinates: { lat: 37.4699, lng: 127.1268 } },
  { name: "모란", line: "8호선", coordinates: { lat: 37.4338, lng: 127.1289 } },

  // 9호선 (강서~강남 급행축)
  { name: "개화", line: "9호선", coordinates: { lat: 37.5783, lng: 126.7984 } },
  { name: "김포공항", line: "9호선", coordinates: { lat: 37.5621, lng: 126.8016 } },
  { name: "마곡나루", line: "9호선", coordinates: { lat: 37.5675, lng: 126.8294 } },
  { name: "가양", line: "9호선", coordinates: { lat: 37.5613, lng: 126.8543 } },
  { name: "등촌", line: "9호선", coordinates: { lat: 37.5503, lng: 126.8651 } },
  { name: "염창", line: "9호선", coordinates: { lat: 37.5475, lng: 126.8742 } },
  { name: "당산", line: "9호선", coordinates: { lat: 37.5347, lng: 126.9027 } },
  { name: "여의도", line: "9호선", coordinates: { lat: 37.5215, lng: 126.9243 } },
  { name: "노량진", line: "9호선", coordinates: { lat: 37.5141, lng: 126.9426 } },
  { name: "흑석", line: "9호선", coordinates: { lat: 37.5089, lng: 126.9636 } },
  { name: "동작", line: "9호선", coordinates: { lat: 37.5031, lng: 126.9794 } },
  { name: "고속터미널", line: "9호선", coordinates: { lat: 37.5048, lng: 127.0048 } },
  { name: "신논현", line: "9호선", coordinates: { lat: 37.5046, lng: 127.0252 } },
  { name: "선정릉", line: "9호선", coordinates: { lat: 37.5104, lng: 127.0436 } },
  { name: "봉은사", line: "9호선", coordinates: { lat: 37.5145, lng: 127.0571 } },
  { name: "종합운동장", line: "9호선", coordinates: { lat: 37.5110, lng: 127.0735 } },

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

  if (!cleaned) {
    return undefined;
  }

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
  if (cleaned.length < 2) {
    return undefined;
  }

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
