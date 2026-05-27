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
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            타임랩스
          </p>
          <h2 className="mt-1 truncate text-base font-bold tracking-normal sm:text-lg">
            {selectedSnapshot.label} · {formatGeneratedTime(selectedSnapshot.time)}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            {seasonTheme ? getSeasonLabel(seasonTheme.season) : selectedSnapshot.summary.season}
          </span>
          <button
            type="button"
            onClick={onTogglePlaying}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
              isPlaying
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/60 text-foreground hover:bg-muted/80"
            }`}
            aria-label={isPlaying ? "타임랩스 정지" : "타임랩스 재생"}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="relative h-1.5 rounded-full bg-muted/70">
          <motion.div
            className="absolute left-0 top-0 h-1.5 rounded-full bg-primary"
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
          className="mt-2 w-full cursor-pointer"
          aria-label="서울 시간대 선택"
        />
        <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {snapshots.map((snapshot, index) => {
            const Icon = presetIcons[index] ?? Clock3;
            const isSelected = snapshot.id === selectedSnapshot.id;

            return (
              <button
                key={snapshot.id}
                type="button"
                onClick={() => onSelectSnapshot(snapshot.id)}
                className={`flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 bg-card/40 hover:bg-muted/60"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-bold">{snapshot.label}</span>
                  <span
                    className={`block truncate text-[0.65rem] ${
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

      <div className="mt-3 flex flex-wrap gap-1.5">
        {themePreferences.map((preference) => {
          const isSelected = seasonThemePreference === preference.value;

          return (
            <button
              key={preference.value}
              type="button"
              onClick={() => onSeasonThemePreferenceChange(preference.value)}
              className={`rounded-full border px-2.5 py-1 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/60 bg-transparent text-muted-foreground hover:bg-muted/60"
              }`}
              aria-label={`${preference.label} 계절 테마 선택`}
              aria-pressed={isSelected}
            >
              {preference.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
