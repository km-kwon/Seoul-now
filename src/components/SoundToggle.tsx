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
    <div className="w-full min-w-0 rounded-2xl border border-border bg-background p-2 shadow-sm sm:w-[17rem] sm:min-w-[17rem]">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            if (isEnabled) {
              onDisable();
              return;
            }

            onEnableMode(recommendedMode === "off" ? "rain" : recommendedMode);
          }}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
            isEnabled
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground hover:bg-muted"
          }`}
          aria-label={isEnabled ? "사운드 끄기" : "사운드 켜기"}
          aria-pressed={isEnabled}
          title={isEnabled ? "사운드 끄기" : "사운드 켜기"}
        >
          {isEnabled ? (
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <VolumeX className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-xs font-bold text-muted-foreground">
              {isEnabled ? getSoundModeLabel(activeMode) : `추천 ${getSoundModeLabel(recommendedMode)}`}
            </p>
            <p
              className={`shrink-0 text-xs font-bold ${
                status === "missing" || status === "blocked" ? "text-warning" : "text-primary"
              }`}
            >
              {statusLabel}
            </p>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-1">
            {modeOptions.map(({ icon: Icon, mode: optionMode }) => {
              const isActive = mode === optionMode;
              const isRecommended = !isEnabled && recommendedMode === optionMode;

              return (
                <button
                  key={optionMode}
                  type="button"
                  onClick={() => onEnableMode(optionMode)}
                  className={`flex h-8 items-center justify-center rounded-xl border text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : isRecommended
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                  aria-label={`${getSoundModeLabel(optionMode)} 모드 켜기`}
                  aria-pressed={isActive}
                  title={isRecommended ? `${getSoundModeLabel(optionMode)} 추천` : getSoundModeLabel(optionMode)}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <label className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <span className="shrink-0">볼륨</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          className="min-w-0 flex-1 cursor-pointer"
          aria-label="사운드 볼륨"
        />
        <span className="w-8 text-right">{Math.round(volume * 100)}</span>
      </label>
    </div>
  );
};
