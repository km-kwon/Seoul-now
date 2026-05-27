import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Database,
  Lightbulb,
  RefreshCw,
  SlidersHorizontal,
  WifiOff,
  X,
} from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { InsightPanel } from "./InsightPanel";
import { SeoulMap } from "./SeoulMap";
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

type PanelId = "insights" | "summary" | "timeline";

const panelOpeners: Array<{
  id: PanelId;
  label: string;
  icon: typeof Lightbulb;
}> = [
  { id: "insights", label: "인사이트", icon: Lightbulb },
  { id: "summary", label: "요약", icon: BarChart3 },
  { id: "timeline", label: "타임랩스", icon: SlidersHorizontal },
];

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
      ? "API 실패 · fixture"
      : hasApiSuccess && !hasFixtureFallback
        ? "API 연결됨"
        : "fixture로 작동 중";

  return (
    <div className="sn-glass flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
          hasApiFallback || hasQueryError ? "bg-danger/15 text-danger" : "bg-primary/15 text-primary"
        }`}
      >
        <Icon
          className={`h-3.5 w-3.5 ${isInitialLoading || isRefreshing ? "animate-spin" : ""}`}
          aria-hidden="true"
        />
      </div>
      <p className="truncate font-bold">{statusText}</p>
      <div className="hidden items-center gap-1 sm:flex">
        {items.map((item) => {
          const isFallback = item.result?.source !== "api";
          return (
            <span
              key={item.label}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                isFallback ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"
              }`}
            >
              <Database className="h-3 w-3" aria-hidden="true" />
              {item.label}
            </span>
          );
        })}
      </div>
    </div>
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
  const [mobileSheet, setMobileSheet] = useState<"insights" | "summary" | null>(null);
  const [closedPanels, setClosedPanels] = useState<Record<PanelId, boolean>>({
    insights: false,
    summary: false,
    timeline: false,
  });

  const closePanel = (panelId: PanelId) => {
    setClosedPanels((prev) => ({ ...prev, [panelId]: true }));
  };

  const openPanel = (panelId: PanelId) => {
    setClosedPanels((prev) => ({ ...prev, [panelId]: false }));
  };

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
        <div className="sn-glass rounded-[20px] px-6 py-5">서울의 지금을 불러오는 중</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {resolvedSeasonTheme ? (
        <SeasonalOverlay
          isLastTrainTime={resolvedSeasonTheme.isLastTrainTime}
          theme={resolvedSeasonTheme.theme}
        />
      ) : null}

      {/* Fullscreen map */}
      <div className="fixed inset-0 z-0">
        <SeoulMap snapshot={liveSnapshot} onSoundModeRequest={handleEnableSoundMode} />
      </div>

      {/* Top header */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 flex flex-col gap-2 px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="pointer-events-auto sn-glass rounded-[20px] px-3 py-2.5 sm:px-4 sm:py-3">
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
        </div>
        <div className="pointer-events-auto flex items-center justify-between gap-2">
          <DataStatusBar items={dataStatusItems} />
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => {
                openPanel("summary");
                setMobileSheet((prev) => (prev === "summary" ? null : "summary"));
              }}
              className={`sn-glass rounded-full px-3 py-1.5 text-xs font-bold ${
                mobileSheet === "summary" ? "text-primary" : "text-foreground"
              }`}
            >
              요약
            </button>
            <button
              type="button"
              onClick={() => {
                openPanel("insights");
                setMobileSheet((prev) => (prev === "insights" ? null : "insights"));
              }}
              className={`sn-glass rounded-full px-3 py-1.5 text-xs font-bold ${
                mobileSheet === "insights" ? "text-primary" : "text-foreground"
              }`}
            >
              인사이트
            </button>
          </div>
        </div>
      </div>

      {/* Left: insights (lg+) */}
      {!closedPanels.insights ? (
      <aside className="pointer-events-none fixed left-3 top-32 z-20 hidden w-[22rem] xl:w-[24rem] lg:block">
        <div className="pointer-events-auto sn-glass sn-scroll-area max-h-[calc(100vh-22rem)] overflow-y-auto rounded-[20px] p-3 sm:p-4">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => closePanel("insights")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="인사이트 패널 닫기"
              title="닫기"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <InsightPanel
            cityMood={liveSnapshot.summary.cityMood}
            error={insightError}
            insights={generatedInsights}
            isLoading={isInsightLoading}
            snapshot={liveSnapshot}
          />
        </div>
      </aside>
      ) : null}

      {/* Right: summary cards (lg+) */}
      {!closedPanels.summary ? (
      <aside className="pointer-events-none fixed right-3 top-32 z-20 hidden w-[22rem] xl:w-[24rem] lg:block">
        <div className="pointer-events-auto sn-glass rounded-[20px] p-3 sm:p-4">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => closePanel("summary")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="요약 패널 닫기"
              title="닫기"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <SummaryCards snapshot={liveSnapshot} soundMode={ambientSoundMode} />
        </div>
      </aside>
      ) : null}

      {/* Mobile bottom sheet */}
      {mobileSheet ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-32 top-32 z-20 px-3 lg:hidden">
          <div className="pointer-events-auto sn-glass sn-scroll-area max-h-full overflow-y-auto rounded-[20px] p-3 sm:p-4">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileSheet(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="패널 닫기"
                title="닫기"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            {mobileSheet === "summary" ? (
              <SummaryCards snapshot={liveSnapshot} soundMode={ambientSoundMode} />
            ) : (
              <InsightPanel
                cityMood={liveSnapshot.summary.cityMood}
                error={insightError}
                insights={generatedInsights}
                isLoading={isInsightLoading}
                snapshot={liveSnapshot}
              />
            )}
          </div>
        </div>
      ) : null}

      {panelOpeners.some((panel) => closedPanels[panel.id]) ? (
        <div className="pointer-events-none fixed right-3 top-32 z-30 flex flex-col gap-2">
          {panelOpeners.map((panel) => {
            if (!closedPanels[panel.id]) {
              return null;
            }

            const Icon = panel.icon;

            return (
              <button
                key={panel.id}
                type="button"
                onClick={() => openPanel(panel.id)}
                className="pointer-events-auto sn-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label={`${panel.label} 패널 열기`}
                title={`${panel.label} 열기`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Bottom: TimeSlider */}
      {!closedPanels.timeline ? (
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:px-5 sm:pb-4">
        <div className="pointer-events-auto sn-glass mx-auto max-w-5xl rounded-[20px] p-3 sm:p-4">
          <div className="mb-1 flex justify-end">
            <button
              type="button"
              onClick={() => closePanel("timeline")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
              aria-label="타임랩스 패널 닫기"
              title="닫기"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
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
      </div>
      ) : null}
    </main>
  );
};
