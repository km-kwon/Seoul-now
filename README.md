# 서울지금 (Seoul Now)

서울의 **날씨 · 지하철 · 도시 분위기**를 한 화면에서 확인할 수 있는 글랜서블(glanceable) 대시보드입니다. 카카오맵 위에 실시간 지하철 위치와 권역별 날씨를 얹고, 시간대 스냅샷과 계절 테마, 앰비언트 사운드까지 결합해 "지금 서울이 어떤 모습인지"를 한눈에 보여줍니다.

## 주요 기능

- **카카오맵 기반 시각화** — 5개 권역 날씨와 실시간 지하철 위치를 지도 위 커스텀 오버레이로 표시
- **서울시 OpenAPI 연동** — `realtimePosition` 엔드포인트에서 실시간 열차 위치를 가져와 좌표로 보간
- **시간 슬라이더** — 현재 시간 기준으로 과거/미래 스냅샷을 넘겨보며 도시 흐름을 비교
- **계절 오버레이** — 봄/여름/가을/겨울 파티클과 막차 시간대 연출, `auto`/수동 선택 가능
- **앰비언트 사운드** — `rain`, `station`, `night` 모드를 시간대에 맞춰 자동 추천
- **fixture fallback** — API 키가 없거나 호출이 실패하면 fixture 데이터로 자동 전환되어 데모가 끊기지 않음
- **다크/라이트 테마**, **공유(Web Share API)**, **반응형 레이아웃** 지원

## 기술 스택

| 영역 | 사용 라이브러리 |
|---|---|
| 프레임워크 | React 18, TypeScript, Vite 6 |
| 상태 관리 | Zustand, @tanstack/react-query |
| 스타일 | Tailwind CSS 3, framer-motion, lucide-react |
| 지도 | Kakao Maps JavaScript SDK |
| 데이터 | 서울 열린데이터광장 OpenAPI (`swopenapi.seoul.go.kr`) |

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

[.env.example](.env.example)을 `.env`로 복사한 뒤 키 값을 채워주세요.

```bash
cp .env.example .env
```

| 변수 | 설명 | 발급처 |
|---|---|---|
| `VITE_KAKAO_MAP_KEY` | 카카오맵 JavaScript 키 | [Kakao Developers](https://developers.kakao.com/console/app) → 앱 → 플랫폼 → Web → 사이트 도메인에 `http://localhost:5173` 추가 |
| `VITE_SEOUL_OPENAPI_KEY` | 서울 열린데이터광장 인증키 | [data.seoul.go.kr](https://data.seoul.go.kr) → 인증키 신청 → 일반 인증키 |
| `VITE_SEOUL_NOW_API_BASE_URL` | (선택) 자체 백엔드 프록시 주소 | 비워두면 Vite proxy로 서울시 OpenAPI를 직접 호출합니다. Hono 등의 프록시를 사용할 경우 `/api` 형태로 지정 |

> 키가 비어 있으면 [src/data/fixtures.ts](src/data/fixtures.ts)의 fixture 데이터로 동작합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

기본 주소: <http://localhost:5173>

### 4. 빌드 / 미리보기

```bash
npm run build     # 타입 체크 + Vite 빌드
npm run preview   # 빌드 결과 로컬 서빙
```

## 프로젝트 구조

```
src/
├── api/              # 외부 API 호출 + fixture fallback 로직
│   ├── apiClient.ts
│   ├── realtimeSubwayApi.ts   # 서울 OpenAPI 실시간 열차 위치
│   ├── weatherApi.ts
│   └── normalize*.ts          # 응답 정규화
├── components/       # 대시보드 UI 컴포넌트
│   ├── SeoulDashboard.tsx     # 루트 컨테이너
│   ├── SeoulMapPanel.tsx
│   ├── SeoulMap.tsx           # 카카오맵 오버레이
│   ├── TimeSlider.tsx
│   ├── SeasonalOverlay.tsx
│   └── ...
├── hooks/            # React Query 훅, 시간/사운드 훅
├── store/            # Zustand 스토어 (테마, 대시보드 상태)
├── data/             # fixture, 지하철 역 좌표
├── utils/            # 포맷터, 카카오맵 로더, 인사이트 생성
└── types/            # 도메인 타입 정의
```

## 데이터 흐름

1. 진입 시 [useSeoulDashboard](src/hooks/useSeoulDashboard.ts)가 기본 스냅샷 데이터를 로드
2. 선택된 스냅샷을 기준으로 [useWeather](src/hooks/useWeather.ts), [useSubwayPositions](src/hooks/useSubwayPositions.ts)가 실시간 데이터를 호출
3. API 실패 시 [createFixtureResult](src/api/apiClient.ts)가 fixture로 폴백, 상단 `DataStatusBar`에서 상태 표시
4. 결과는 [SeoulMapPanel](src/components/SeoulMapPanel.tsx)·[InsightPanel](src/components/InsightPanel.tsx)·[SummaryCards](src/components/SummaryCards.tsx)에 분산되어 렌더

## Vite Proxy

서울 OpenAPI는 브라우저에서 직접 호출 시 CORS 이슈가 있어 [vite.config.ts](vite.config.ts)에서 `/seoul-openapi` 경로를 프록시합니다.

```
/seoul-openapi/json/realtimePosition/0/200/2호선
   ↓
http://swopenapi.seoul.go.kr/api/subway/{KEY}/json/realtimePosition/0/200/2호선
```

배포 환경에서는 별도 백엔드(예: Hono)를 두고 `VITE_SEOUL_NOW_API_BASE_URL`로 연결하는 것을 권장합니다.

## 라이선스

본 프로젝트는 인턴 학습용 데모입니다.
