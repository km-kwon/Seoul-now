import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BriefcaseBusiness,
  Clock3,
  Coffee,
  Pause,
  Play,
  Sunset,
} from "lucide-react";
import type {
  SeasonName,
  SeasonTheme,
  SeasonThemePreference,
  TimeSnapshot,
} from "../types/dashboard";
import { formatGeneratedTime, getSeasonLabel } from "../utils/format";

type TimeSliderProps = {
  isPlaying: boolean;
  resolvedSeason: SeasonName;
  seasonThemes: SeasonTheme[];
  seasonThemePreference: SeasonThemePreference;
  selectedSnapshotId: string;
  snapshots: TimeSnapshot[];
  onSeasonThemePreferenceChange: (preference: SeasonThemePreference) => void;
  onSelectSnapshot: (snapshotId: string) => void;
  onTogglePlaying: () => void;
};

const presetIcons = [Clock3, Clock3, Clock3, BriefcaseBusiness, Coffee, Sunset];
const themePreferences: Array<{
  label: string;
  value: SeasonThemePreference;
}> = [
  { label: "자동", value: "auto" },
  { label: "봄", value: "spring" },
  { label: "여름", value: "summer" },
  { label: "가을", value: "autumn" },
  { label: "겨울", value: "winter" },
];

const getSelectedIndex = (snapshots: TimeSnapshot[], selectedSnapshotId: string) => {
  const index = snapshots.findIndex((snapshot) => snapshot.id === selectedSnapshotId);
  return Math.max(index, 0);
};

export const TimeSlider = ({
  isPlaying,
  resolvedSeason,
  seasonThemes,
  seasonThemePreference,
  selectedSnapshotId,
  snapshots,
  onSeasonThemePreferenceChange,
  onSelectSnapshot,
  onTogglePlaying,
}: TimeSliderProps) => {
  const shouldReduceMotion = useReducedMotion();
  const selectedIndex = getSelectedIndex(snapshots, selectedSnapshotId);
  const selectedSnapshot = snapshots[selectedIndex];
  const seasonTheme = seasonThemes.find((theme) => theme.season === resolvedSeason);
  const progress = snapshots.length <= 1 ? 0 : (selectedIndex / (snapshots.length - 1)) * 100;

  useEffect(() => {
    if (!isPlaying || snapshots.length <= 1) {
      return undefined;
    }

    const intervalMs = shouldReduceMotion ? 2200 : 1500;
    const timer = window.setInterval(() => {
      const currentIndex = getSelectedIndex(snapshots, selectedSnapshotId);
      const nextSnapshot = snapshots[(currentIndex + 1) % snapshots.length];
      onSelectSnapshot(nextSnapshot.id);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, onSelectSnapshot, selectedSnapshotId, shouldReduceMotion, snapshots]);

  return (
    <section className="rounded-[20px] border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" aria-hidden="true" />
            타임랩스
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-normal">
            {selectedSnapshot.label} · {formatGeneratedTime(selectedSnapshot.time)}
          </h2>
          <p className="mt-1 text-safe text-sm leading-6 text-muted-foreground">
            {selectedSnapshot.summary.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <div className="grid min-w-[13rem] grid-cols-2 gap-2 rounded-2xl bg-muted p-3 text-sm sm:grid-cols-3 lg:min-w-[18rem]">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">날씨</p>
              <p className="mt-1 truncate font-bold">{selectedSnapshot.summary.weatherLabel}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">교통</p>
              <p className="mt-1 truncate font-bold">{selectedSnapshot.summary.transitLabel}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-muted-foreground">테마</p>
              <p className="mt-1 truncate font-bold">
                {seasonTheme ? getSeasonLabel(seasonTheme.season) : selectedSnapshot.summary.season}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onTogglePlaying}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
              isPlaying
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
            aria-label={isPlaying ? "타임랩스 정지" : "타임랩스 재생"}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Play className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {themePreferences.map((preference) => {
          const isSelected = seasonThemePreference === preference.value;

          return (
            <button
              key={preference.value}
              type="button"
              onClick={() => onSeasonThemePreferenceChange(preference.value)}
              className={`rounded-2xl border px-3 py-2 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              }`}
              aria-label={`${preference.label} 계절 테마 선택`}
              aria-pressed={isSelected}
            >
              {preference.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-muted">
          <motion.div
            className="absolute left-0 top-0 h-2 rounded-full bg-primary"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: "easeOut" }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={snapshots.length - 1}
          step={1}
          value={selectedIndex}
          onChange={(event) => onSelectSnapshot(snapshots[Number(event.target.value)].id)}
          className="mt-4 w-full cursor-pointer"
          aria-label="서울 시간대 선택"
        />
        <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {snapshots.map((snapshot, index) => {
            const Icon = presetIcons[index] ?? Clock3;
            const isSelected = snapshot.id === selectedSnapshot.id;

            return (
              <button
                key={snapshot.id}
                type="button"
                onClick={() => onSelectSnapshot(snapshot.id)}
                className={`flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{snapshot.label}</span>
                  <span
                    className={`mt-0.5 block truncate text-xs ${
                      isSelected ? "text-primary-foreground/85" : "text-muted-foreground"
                    }`}
                  >
                    {formatGeneratedTime(snapshot.time)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
