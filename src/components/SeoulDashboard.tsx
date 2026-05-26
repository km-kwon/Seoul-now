import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Database, RefreshCw, WifiOff } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { InsightPanel } from "./InsightPanel";
import { SeoulMapPanel } from "./SeoulMapPanel";
import { SeasonalOverlay } from "./SeasonalOverlay";
import { SoundToggle } from "./SoundToggle";
import { SummaryCards } from "./SummaryCards";
import { TimeSlider } from "./TimeSlider";
import { useAmbientSound } from "../hooks/useAmbientSound";
import { useCurrentTime } from "../hooks/useCurrentTime";
import { useSeoulDashboard } from "../hooks/useSeoulDashboard";
import { useSeoulInsights } from "../hooks/useSeoulInsights";
import { useSubwayPositions } from "../hooks/useSubwayPositions";
import { useWeather } from "../hooks/useWeather";
import { useDashboardStore } from "../store/dashboardStore";
import { useThemeStore } from "../store/themeStore";
import type { ApiResourceResult } from "../types/api";
import type { AmbientSoundMode, TimeSnapshot } from "../types/dashboard";
import { createRainInsights } from "../utils/rainInsight";
import { resolveSeasonTheme } from "../utils/resolveSeasonTheme";

type DataStatusItem = {
  error?: Error | null;
  isFetching: boolean;
  isLoading: boolean;
  label: string;
  result?: ApiResourceResult<unknown>;
};

const getRecommendedSoundMode = (
  snapshot: TimeSnapshot,
  fallbackMode: AmbientSoundMode,
): AmbientSoundMode => {
  const hour = Number(snapshot.time.slice(11, 13));

  if (hour >= 21 || hour < 5) {
    return "night";
  }

  if (snapshot.summary.soundMode !== "off") {
    return snapshot.summary.soundMode;
  }

  return fallbackMode === "off" ? "rain" : fallbackMode;
};

const getQueryError = (error: unknown) => {
  return error instanceof Error ? error : null;
};

const DataStatusBar = ({ items }: { items: DataStatusItem[] }) => {
  const isInitialLoading = items.some((item) => item.isLoading);
  const isRefreshing = items.some((item) => item.isFetching && !item.isLoading);
  const hasQueryError = items.some((item) => Boolean(item.error));
  const hasApiFallback = items.some(
    (item) => item.result?.fallbackReason && item.result.fallbackReason !== "missing-base-url",
  );
  const hasFixtureFallback = items.some((item) => item.result?.source === "fixture");
  const hasApiSuccess = items.some((item) => item.result?.source === "api");
  const Icon = isInitialLoading || isRefreshing ? RefreshCw : hasApiFallback || hasQueryError ? WifiOff : CheckCircle2;
  const statusText = isInitialLoading
    ? "실시간 데이터 확인 중"
    : hasApiFallback || hasQueryError
      ? "API 연결 실패 · fixture fallback"
      : hasApiSuccess && !hasFixtureFallback
        ? "API 데이터 연결됨"
        : "fixture fallback으로 작동 중";

  return (
    <section className="flex flex-col gap-3 rounded-[20px] border border-border bg-card px-4 py-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
            hasApiFallback || hasQueryError ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${isInitialLoading || isRefreshing ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{statusText}</p>
          <p className="truncate text-xs text-muted-foreground">
            Hono 프록시 연결 시 VITE_SEOUL_NOW_API_BASE_URL=/api 구조로 전환됩니다.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isFallback = item.result?.source !== "api";
          const sourceLabel = item.isLoading
            ? "동기화"
            : item.result?.source === "api"
              ? "API"
              : "fixture";

          return (
            <span
              key={item.label}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                isFallback
                  ? "bg-muted text-muted-foreground"
                  : "bg-success/10 text-success"
              }`}
            >
              <Database className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label} {sourceLabel}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export const SeoulDashboard = () => {
  const { data, isLoading } = useSeoulDashboard();
  const { theme, toggleTheme } = useThemeStore();
  const {
    ambientSoundMode,
    isPlaying,
    seasonThemePreference,
    selectedSnapshotId,
    selectSnapshot,
    setAmbientSoundMode,
    setSeasonThemePreference,
    setSoundVolume,
    soundVolume,
    togglePlaying,
  } = useDashboardStore();
  const ambientSound = useAmbientSound(ambientSoundMode, soundVolume);
  const currentTime = useCurrentTime();
  const [shareComplete, setShareComplete] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const selectedSnapshot = useMemo(() => {
    if (!data) {
      return undefined;
    }

    return (
      data.snapshots.find((snapshot) => snapshot.id === selectedSnapshotId) ??
      data.snapshots.find((snapshot) => snapshot.id === data.currentSnapshotId) ??
      data.snapshots[0]
    );
  }, [data, selectedSnapshotId]);
  const weatherQuery = useWeather(selectedSnapshot);
  const subwayQuery = useSubwayPositions(selectedSnapshot);
  const weatherZones = weatherQuery.data?.data ?? selectedSnapshot?.weatherZones ?? [];
  const trains = subwayQuery.data?.data ?? selectedSnapshot?.trains ?? [];
  const liveSnapshot = useMemo(() => {
    if (!selectedSnapshot) {
      return undefined;
    }

    return {
      ...selectedSnapshot,
      trains,
      weatherZones,
    };
  }, [selectedSnapshot, trains, weatherZones]);
  const insightQuery = useSeoulInsights(weatherZones, trains, selectedSnapshot?.id);

  useEffect(() => {
    if (!data || data.snapshots.some((snapshot) => snapshot.id === selectedSnapshotId)) {
      return;
    }

    selectSnapshot(data.currentSnapshotId);
  }, [data, selectSnapshot, selectedSnapshotId]);

  const generatedInsights = useMemo(() => {
    if (!liveSnapshot) {
      return [];
    }

    return insightQuery.data?.data ?? createRainInsights(liveSnapshot.weatherZones, liveSnapshot.trains);
  }, [insightQuery.data?.data, liveSnapshot]);
  const recommendedSoundMode = liveSnapshot
    ? getRecommendedSoundMode(liveSnapshot, data?.defaultSoundMode ?? "rain")
    : "rain";
  const resolvedSeasonTheme = useMemo(() => {
    if (!data || !liveSnapshot) {
      return undefined;
    }

    return resolveSeasonTheme(liveSnapshot, data.seasonThemes, seasonThemePreference);
  }, [data, liveSnapshot, seasonThemePreference]);
  const dataStatusItems: DataStatusItem[] = [
    {
      error: getQueryError(weatherQuery.error),
      isFetching: weatherQuery.isFetching,
      isLoading: weatherQuery.isLoading,
      label: "날씨",
      result: weatherQuery.data,
    },
    {
      error: getQueryError(subwayQuery.error),
      isFetching: subwayQuery.isFetching,
      isLoading: subwayQuery.isLoading,
      label: "지하철",
      result: subwayQuery.data,
    },
    {
      error: getQueryError(insightQuery.error),
      isFetching: insightQuery.isFetching,
      isLoading: insightQuery.isLoading,
      label: "인사이트",
      result: insightQuery.data,
    },
  ];
  const insightError = getQueryError(insightQuery.error);
  const isInsightLoading = insightQuery.isLoading && !insightQuery.data;

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: "서울지금",
      text: liveSnapshot?.summary.headline ?? "서울의 지금을 보는 창",
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      }

      setShareComplete(true);
      window.setTimeout(() => setShareComplete(false), 1800);
    } catch {
      setShareComplete(false);
    }
  };

  const handleEnableSoundMode = (mode: AmbientSoundMode) => {
    if (mode === "off") {
      setAmbientSoundMode("off");
      ambientSound.stop();
      return;
    }

    setAmbientSoundMode(mode);
    void ambientSound.playMode(mode);
  };

  const handleDisableSound = () => {
    setAmbientSoundMode("off");
    ambientSound.stop();
  };

  if (isLoading || !data || !liveSnapshot) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="rounded-[20px] border border-border bg-card px-6 py-5 shadow-soft">
          서울의 지금을 불러오는 중
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-3 py-4 text-foreground sm:px-6 lg:px-8">
      {resolvedSeasonTheme ? (
        <SeasonalOverlay
          isLastTrainTime={resolvedSeasonTheme.isLastTrainTime}
          theme={resolvedSeasonTheme.theme}
        />
      ) : null}
      <div className="mx-auto grid max-w-7xl gap-4 lg:gap-5">
        <DashboardHeader
          cityMood={liveSnapshot.summary.cityMood}
          currentTime={currentTime}
          headline={liveSnapshot.summary.headline}
          shareComplete={shareComplete}
          soundControl={
            <SoundToggle
              mode={ambientSoundMode}
              recommendedMode={recommendedSoundMode}
              status={ambientSound.status}
              volume={soundVolume}
              onDisable={handleDisableSound}
              onEnableMode={handleEnableSoundMode}
              onVolumeChange={setSoundVolume}
            />
          }
          theme={theme}
          onShare={handleShare}
          onToggleTheme={toggleTheme}
        />

        <DataStatusBar items={dataStatusItems} />

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.45fr)] lg:gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.42fr)]">
          <div className="grid min-w-0 gap-4 lg:gap-5">
            <SeoulMapPanel snapshot={liveSnapshot} onSoundModeRequest={handleEnableSoundMode} />
            <SummaryCards snapshot={liveSnapshot} soundMode={ambientSoundMode} />
          </div>
          <InsightPanel
            cityMood={liveSnapshot.summary.cityMood}
            error={insightError}
            insights={generatedInsights}
            isLoading={isInsightLoading}
            snapshot={liveSnapshot}
          />
        </div>

        <TimeSlider
          isPlaying={isPlaying}
          resolvedSeason={resolvedSeasonTheme?.season ?? liveSnapshot.summary.season}
          seasonThemes={data.seasonThemes}
          seasonThemePreference={seasonThemePreference}
          selectedSnapshotId={liveSnapshot.id}
          snapshots={data.snapshots}
          onSeasonThemePreferenceChange={setSeasonThemePreference}
          onSelectSnapshot={selectSnapshot}
          onTogglePlaying={togglePlaying}
        />
      </div>
    </main>
  );
};
