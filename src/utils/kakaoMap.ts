declare global {
  interface Window {
    kakao?: {
      maps: KakaoMaps;
    };
  }
}

export type KakaoLatLng = {
  getLat(): number;
  getLng(): number;
};

export type KakaoMap = {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
  relayout(): void;
};

export type KakaoCustomOverlay = {
  setMap(map: KakaoMap | null): void;
  setPosition(latlng: KakaoLatLng): void;
};

type KakaoCustomOverlayOptions = {
  position: KakaoLatLng;
  content: HTMLElement | string;
  xAnchor?: number;
  yAnchor?: number;
  zIndex?: number;
  clickable?: boolean;
};

type KakaoMapOptions = {
  center: KakaoLatLng;
  level?: number;
  draggable?: boolean;
};

type KakaoMaps = {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (container: HTMLElement, options: KakaoMapOptions) => KakaoMap;
  CustomOverlay: new (options: KakaoCustomOverlayOptions) => KakaoCustomOverlay;
};

const SDK_SCRIPT_ID = "kakao-maps-sdk";

let loaderPromise: Promise<KakaoMaps> | undefined;

export const loadKakaoMaps = (): Promise<KakaoMaps> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("window is not available"));
  }

  if (window.kakao?.maps && typeof window.kakao.maps.Map === "function") {
    return Promise.resolve(window.kakao.maps);
  }

  if (loaderPromise) {
    return loaderPromise;
  }

  const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;

  if (!apiKey) {
    return Promise.reject(
      new Error(
        "VITE_KAKAO_MAP_KEY가 설정되지 않았습니다. .env에 카카오맵 JavaScript 키를 추가하세요.",
      ),
    );
  }

  loaderPromise = new Promise<KakaoMaps>((resolve, reject) => {
    const existing = document.getElementById(SDK_SCRIPT_ID) as HTMLScriptElement | null;
    const handleReady = () => {
      const maps = window.kakao?.maps;

      if (!maps) {
        reject(new Error("kakao.maps SDK 로드에 실패했습니다."));
        return;
      }

      maps.load(() => resolve(maps));
    };

    if (existing) {
      existing.addEventListener("load", handleReady, { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Kakao Maps SDK 스크립트 로드 실패")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = SDK_SCRIPT_ID;
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(
      apiKey,
    )}&autoload=false`;
    script.addEventListener("load", handleReady, { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Kakao Maps SDK 스크립트 로드 실패")),
      { once: true },
    );
    document.head.appendChild(script);
  });

  return loaderPromise;
};
