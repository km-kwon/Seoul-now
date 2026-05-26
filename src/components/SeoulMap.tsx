import { useEffect, useMemo, useRef, useState } from "react";
import { CloudRain, Map as MapIcon, Train, TriangleAlert } from "lucide-react";
import type {
  AmbientSoundMode,
  Coordinates,
  SubwayTrain,
  TimeSnapshot,
  WeatherZone,
} from "../types/dashboard";
import {
  formatPrecipitation,
  formatTemperature,
  getArrivalText,
  getSubwayLineColor,
  getTrainStatusLabel,
} from "../utils/format";
import {
  loadKakaoMaps,
  type KakaoCustomOverlay,
  type KakaoMap as KakaoMapInstance,
} from "../utils/kakaoMap";

type SeoulMapProps = {
  onSoundModeRequest: (mode: AmbientSoundMode) => void;
  snapshot: TimeSnapshot;
};

type MapSelection =
  | { kind: "weather"; id: string; coordinates: Coordinates }
  | { kind: "train"; id: string; coordinates: Coordinates };

type MapStatus = "loading" | "ready" | "error";

type MarkerEntry = {
  key: string;
  kind: "weather" | "train";
  element: HTMLButtonElement;
  overlay: KakaoCustomOverlay;
};

const SEOUL_CENTER: Coordinates = { lat: 37.5665, lng: 126.978 };

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderWeatherMarker = (element: HTMLButtonElement, zone: WeatherZone) => {
  element.dataset.kind = "weather";
  element.dataset.id = zone.id;
  element.className = `sn-map-marker sn-map-marker--weather${
    zone.umbrellaNeeded ? " sn-map-marker--rain" : ""
  }`;
  element.setAttribute("aria-label", `${zone.name} ${zone.weatherStatus}`);
  element.innerHTML = `
    <span class="sn-map-marker__pulse" aria-hidden="true"></span>
    <span class="sn-map-marker__dot">${zone.umbrellaNeeded ? "☂" : "●"}</span>
    <span class="sn-map-marker__label">${escapeHtml(zone.name)} ${escapeHtml(
      formatTemperature(zone.temperature),
    )}</span>
  `;
};

const renderTrainMarker = (element: HTMLButtonElement, train: SubwayTrain) => {
  const lineColor = getSubwayLineColor(train.line);
  element.dataset.kind = "train";
  element.dataset.id = train.id;
  element.className = `sn-map-marker sn-map-marker--train${
    train.isDelayed ? " sn-map-marker--delayed" : ""
  }`;
  element.style.setProperty("--sn-line-color", lineColor);
  element.setAttribute("aria-label", `${train.line} ${train.currentLocation}`);
  element.innerHTML = `
    <span class="sn-map-marker__pulse" aria-hidden="true"></span>
    <span class="sn-map-marker__dot" style="background:${lineColor};">🚇</span>
    <span class="sn-map-marker__label">${escapeHtml(train.line)} · ${escapeHtml(
      train.currentLocation,
    )}</span>
  `;
};

const buildWeatherInfoHtml = (zone: WeatherZone) => `
  <div class="sn-map-info">
    <div class="sn-map-info__head">
      <strong>${escapeHtml(zone.name)}</strong>
      <span>${zone.umbrellaNeeded ? "우산 필요" : "우산 불필요"}</span>
    </div>
    <div class="sn-map-info__temp">${escapeHtml(formatTemperature(zone.temperature))}</div>
    <div class="sn-map-info__sub">${escapeHtml(zone.weatherStatus)} · ${escapeHtml(
      formatPrecipitation(zone.precipitationMm),
    )}</div>
  </div>
`;

const buildTrainInfoHtml = (train: SubwayTrain) => {
  const lineColor = getSubwayLineColor(train.line);
  return `
    <div class="sn-map-info">
      <div class="sn-map-info__head">
        <span class="sn-map-info__line" style="background:${lineColor};"></span>
        <strong>${escapeHtml(train.line)}</strong>
        <span>${escapeHtml(getTrainStatusLabel(train))}</span>
      </div>
      <div class="sn-map-info__temp" style="font-size:1rem;">${escapeHtml(
        train.currentLocation,
      )}</div>
      <div class="sn-map-info__sub">${escapeHtml(train.direction)} · ${escapeHtml(
        train.nextStation,
      )} ${escapeHtml(getArrivalText(train.arrivalMinutes))}</div>
    </div>
  `;
};

export const SeoulMap = ({ onSoundModeRequest, snapshot }: SeoulMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const markerRegistryRef = useRef<Map<string, MarkerEntry>>(new Map());
  const infoOverlayRef = useRef<KakaoCustomOverlay | null>(null);

  const [status, setStatus] = useState<MapStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [selection, setSelection] = useState<MapSelection | undefined>();

  const trainsWithCoordinates = useMemo(
    () =>
      snapshot.trains.filter(
        (train): train is SubwayTrain & { coordinates: Coordinates } =>
          Boolean(train.coordinates),
      ),
    [snapshot.trains],
  );

  useEffect(() => {
    let cancelled = false;

    loadKakaoMaps()
      .then((maps) => {
        if (cancelled || !containerRef.current) {
          return;
        }

        const center = new maps.LatLng(SEOUL_CENTER.lat, SEOUL_CENTER.lng);
        const map = new maps.Map(containerRef.current, {
          center,
          level: 7,
        });

        mapRef.current = map;
        setStatus("ready");
      })
      .catch((error: Error) => {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setErrorMessage(error.message);
      });

    return () => {
      cancelled = true;
      markerRegistryRef.current.forEach((entry) => entry.overlay.setMap(null));
      markerRegistryRef.current.clear();
      infoOverlayRef.current?.setMap(null);
      infoOverlayRef.current = null;
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.kakao) {
      return;
    }

    const maps = window.kakao.maps;
    const registry = markerRegistryRef.current;
    const seen = new Set<string>();

    const upsertMarker = (
      key: string,
      kind: MarkerEntry["kind"],
      coordinates: Coordinates,
      paint: (element: HTMLButtonElement) => void,
      onSelect: () => void,
    ) => {
      seen.add(key);
      const existing = registry.get(key);
      const position = new maps.LatLng(coordinates.lat, coordinates.lng);

      if (existing) {
        paint(existing.element);
        existing.overlay.setPosition(position);
        return;
      }

      const element = document.createElement("button");
      element.type = "button";
      paint(element);
      element.addEventListener("click", (event) => {
        event.stopPropagation();
        onSelect();
      });

      const overlay = new maps.CustomOverlay({
        position,
        content: element,
        xAnchor: 0.5,
        yAnchor: 0.5,
        zIndex: kind === "train" ? 5 : 3,
        clickable: true,
      });

      overlay.setMap(mapRef.current);
      registry.set(key, { key, kind, element, overlay });
    };

    snapshot.weatherZones.forEach((zone) => {
      upsertMarker(
        `weather:${zone.id}`,
        "weather",
        zone.coordinates,
        (element) => renderWeatherMarker(element, zone),
        () => {
          setSelection({
            kind: "weather",
            id: zone.id,
            coordinates: zone.coordinates,
          });

          if (zone.umbrellaNeeded || zone.precipitationMm > 0) {
            onSoundModeRequest("rain");
          }
        },
      );
    });

    trainsWithCoordinates.forEach((train) => {
      upsertMarker(
        `train:${train.id}`,
        "train",
        train.coordinates,
        (element) => renderTrainMarker(element, train),
        () => {
          setSelection({
            kind: "train",
            id: train.id,
            coordinates: train.coordinates,
          });
          onSoundModeRequest("station");
        },
      );
    });

    registry.forEach((entry, key) => {
      if (!seen.has(key)) {
        entry.overlay.setMap(null);
        registry.delete(key);
      }
    });
  }, [status, snapshot, trainsWithCoordinates, onSoundModeRequest]);

  useEffect(() => {
    const registry = markerRegistryRef.current;
    registry.forEach((entry) => {
      const isSelected =
        (entry.kind === selection?.kind &&
          entry.element.dataset.id === selection.id) ??
        false;

      entry.element.classList.toggle("sn-map-marker--selected", Boolean(isSelected));
    });
  }, [selection, snapshot]);

  useEffect(() => {
    if (status !== "ready" || !mapRef.current || !window.kakao) {
      return;
    }

    if (infoOverlayRef.current) {
      infoOverlayRef.current.setMap(null);
      infoOverlayRef.current = null;
    }

    if (!selection) {
      return;
    }

    const maps = window.kakao.maps;
    let html: string | undefined;

    if (selection.kind === "weather") {
      const zone = snapshot.weatherZones.find((z) => z.id === selection.id);
      if (zone) {
        html = buildWeatherInfoHtml(zone);
      }
    } else {
      const train = snapshot.trains.find((t) => t.id === selection.id);
      if (train) {
        html = buildTrainInfoHtml(train);
      }
    }

    if (!html) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;

    const overlay = new maps.CustomOverlay({
      position: new maps.LatLng(
        selection.coordinates.lat,
        selection.coordinates.lng,
      ),
      content: wrapper,
      xAnchor: 0.5,
      yAnchor: 1.4,
      zIndex: 20,
      clickable: false,
    });
    overlay.setMap(mapRef.current);
    infoOverlayRef.current = overlay;
  }, [selection, snapshot, status]);

  const rainyCount = snapshot.weatherZones.filter((zone) => zone.umbrellaNeeded).length;
  const delayedCount = snapshot.trains.filter((train) => train.isDelayed).length;
  const missingCoordinates =
    snapshot.trains.length - trainsWithCoordinates.length;

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[18px] border border-border bg-background sm:min-h-[440px]">
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-label="서울 카카오맵"
        role="application"
      />

      {status === "loading" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-card/70 text-sm text-muted-foreground">
          카카오맵을 불러오는 중…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/90 px-6 text-center text-sm text-muted-foreground">
          <TriangleAlert className="h-5 w-5 text-danger" aria-hidden="true" />
          <p className="font-bold text-foreground">카카오맵을 표시할 수 없습니다</p>
          <p>{errorMessage ?? ".env에 VITE_KAKAO_MAP_KEY를 설정한 뒤 다시 시도하세요."}</p>
          <p className="text-xs text-muted-foreground">
            카카오 개발자 콘솔에서 사이트 도메인에 http://localhost:5173 을 등록해야 합니다.
          </p>
        </div>
      ) : null}

      <div className="pointer-events-none absolute left-4 top-4 z-10 flex gap-2">
        <div className="rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
          <p className="flex items-center gap-2 text-xs font-bold text-primary">
            <CloudRain className="h-3.5 w-3.5" aria-hidden="true" />
            비 {rainyCount}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
          <p className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Train className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            지연 {delayedCount}
          </p>
        </div>
        {missingCoordinates > 0 ? (
          <div className="rounded-2xl border border-border bg-card/90 px-3 py-2 shadow-sm backdrop-blur">
            <p className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
              <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
              좌표 미매칭 {missingCoordinates}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
