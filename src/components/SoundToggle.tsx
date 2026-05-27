import { CloudRain, Moon, Train, Volume2, VolumeX } from "lucide-react";
import type { AmbientSoundMode } from "../types/dashboard";
import type { AmbientSoundStatus } from "../hooks/useAmbientSound";
import { getSoundModeLabel } from "../utils/format";

type SoundToggleProps = {
  mode: AmbientSoundMode;
  recommendedMode: AmbientSoundMode;
  status: AmbientSoundStatus;
  volume: number;
  onDisable: () => void;
  onEnableMode: (mode: AmbientSoundMode) => void;
  onVolumeChange: (volume: number) => void;
};

const modeOptions: Array<{
  icon: typeof CloudRain;
  mode: Exclude<AmbientSoundMode, "off">;
}> = [
  { icon: CloudRain, mode: "rain" },
  { icon: Train, mode: "station" },
  { icon: Moon, mode: "night" },
];

const getStatusLabel = (status: AmbientSoundStatus) => {
  if (status === "playing") {
    return "재생 중";
  }

  if (status === "loading") {
    return "준비 중";
  }

  if (status === "missing") {
    return "사운드 파일 준비 중";
  }

  if (status === "blocked") {
    return "클릭 후 다시 시도";
  }

  return "꺼짐";
};

export const SoundToggle = ({
  mode,
  recommendedMode,
  status,
  volume,
  onDisable,
  onEnableMode,
  onVolumeChange,
}: SoundToggleProps) => {
  const isEnabled = mode !== "off";
  const activeMode = isEnabled ? mode : recommendedMode;
  const statusLabel = getStatusLabel(status);

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 p-1">
      <button
        type="button"
        onClick={() => {
          if (isEnabled) {
            onDisable();
            return;
          }

          onEnableMode(recommendedMode === "off" ? "rain" : recommendedMode);
        }}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          isEnabled
            ? "bg-primary text-primary-foreground"
            : "bg-transparent text-foreground hover:bg-muted/70"
        }`}
        aria-label={isEnabled ? "사운드 끄기" : "사운드 켜기"}
        aria-pressed={isEnabled}
        title={isEnabled ? `사운드 끄기 (${statusLabel})` : `사운드 켜기 (추천 ${getSoundModeLabel(recommendedMode)})`}
      >
        {isEnabled ? (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <div className="flex items-center gap-0.5">
        {modeOptions.map(({ icon: Icon, mode: optionMode }) => {
          const isActive = mode === optionMode;
          const isRecommended = !isEnabled && recommendedMode === optionMode;

          return (
            <button
              key={optionMode}
              type="button"
              onClick={() => onEnableMode(optionMode)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isRecommended
                    ? "bg-primary/15 text-primary"
                    : "bg-transparent text-muted-foreground hover:bg-muted/70"
              }`}
              aria-label={`${getSoundModeLabel(optionMode)} 모드 켜기`}
              aria-pressed={isActive}
              title={`${getSoundModeLabel(optionMode)}${isRecommended ? " · 추천" : ""}`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <label className="hidden items-center gap-1 px-1 text-[0.65rem] font-semibold text-muted-foreground xl:flex">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="w-16 cursor-pointer"
          aria-label="사운드 볼륨"
        />
        <span className="w-6 text-right tabular-nums">{Math.round(volume * 100)}</span>
      </label>

      <span className="sr-only">{isEnabled ? getSoundModeLabel(activeMode) : "사운드 꺼짐"} · {statusLabel}</span>
    </div>
  );
};
