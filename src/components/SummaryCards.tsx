import { CloudRain, Headphones, Thermometer, Train } from "lucide-react";
import type { AmbientSoundMode, TimeSnapshot } from "../types/dashboard";
import {
  formatPrecipitation,
  formatTemperature,
  getAverageTemperature,
  getSoundModeLabel,
  getTrainStatusLabel,
  getUmbrellaZoneCount,
} from "../utils/format";

type SummaryCardsProps = {
  snapshot: TimeSnapshot;
  soundMode: AmbientSoundMode;
};

export const SummaryCards = ({ snapshot, soundMode }: SummaryCardsProps) => {
  const rainyZone = snapshot.weatherZones.find((zone) => zone.umbrellaNeeded) ?? snapshot.weatherZones[0];
  const busiestTrain = snapshot.trains.reduce((highest, train) =>
    train.congestion > highest.congestion ? train : highest,
  );
  const umbrellaZoneCount = getUmbrellaZoneCount(snapshot.weatherZones);
  const averageTemperature = getAverageTemperature(snapshot.weatherZones);

  return (
    <section className="grid gap-3">
      <article className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">{snapshot.summary.weatherLabel}</p>
          <CloudRain className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-2 flex items-end gap-2 text-2xl font-bold tracking-normal">
          {formatTemperature(averageTemperature)}
          <span className="pb-0.5 text-xs font-semibold text-muted-foreground">
            {rainyZone.weatherStatus}
          </span>
        </p>
        <p className="mt-1 text-safe text-xs leading-5 text-muted-foreground">
          {rainyZone.name} {formatPrecipitation(rainyZone.precipitationMm)} · 우산 권역{" "}
          {umbrellaZoneCount}곳
        </p>
      </article>

      <article className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">{snapshot.summary.transitLabel}</p>
          <Train className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-2 text-lg font-bold tracking-normal">{busiestTrain.line}</p>
        <p className="mt-1 text-safe text-xs leading-5 text-muted-foreground">
          {busiestTrain.currentLocation} · {getTrainStatusLabel(busiestTrain)} · 혼잡도{" "}
          {busiestTrain.congestion}%
        </p>
      </article>

      <article className="min-w-0 rounded-2xl border border-border/60 bg-card/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-muted-foreground">분위기 요약</p>
          {soundMode === "off" ? (
            <Thermometer className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          ) : (
            <Headphones className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          )}
        </div>
        <p className="mt-2 truncate text-lg font-bold tracking-normal">
          {snapshot.summary.cityMood}
        </p>
        <p className="mt-1 text-safe text-xs leading-5 text-muted-foreground">
          {getSoundModeLabel(soundMode)} · {snapshot.label}
        </p>
      </article>
    </section>
  );
};
