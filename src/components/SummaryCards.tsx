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
    <section className="grid gap-3 sm:grid-cols-3">
      <article className="min-w-0 rounded-[20px] border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">{snapshot.summary.weatherLabel}</p>
          <CloudRain className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-3 flex items-end gap-2 text-3xl font-bold tracking-normal">
          {formatTemperature(averageTemperature)}
          <span className="pb-1 text-sm font-semibold text-muted-foreground">
            {rainyZone.weatherStatus}
          </span>
        </p>
        <p className="mt-2 text-safe text-sm leading-6 text-muted-foreground">
          {rainyZone.name} {formatPrecipitation(rainyZone.precipitationMm)} · 우산 권역{" "}
          {umbrellaZoneCount}곳
        </p>
      </article>

      <article className="min-w-0 rounded-[20px] border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">{snapshot.summary.transitLabel}</p>
          <Train className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        </div>
        <p className="mt-3 text-2xl font-bold tracking-normal">{busiestTrain.line}</p>
        <p className="mt-2 text-safe text-sm leading-6 text-muted-foreground">
          {busiestTrain.currentLocation} · {getTrainStatusLabel(busiestTrain)} · 혼잡도{" "}
          {busiestTrain.congestion}%
        </p>
      </article>

      <article className="min-w-0 rounded-[20px] border border-border bg-card p-4 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted-foreground">분위기 요약</p>
          {soundMode === "off" ? (
            <Thermometer className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          ) : (
            <Headphones className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          )}
        </div>
        <p className="mt-3 truncate text-2xl font-bold tracking-normal">
          {snapshot.summary.cityMood}
        </p>
        <p className="mt-2 text-safe text-sm leading-6 text-muted-foreground">
          {getSoundModeLabel(soundMode)} · {snapshot.label}
        </p>
      </article>
    </section>
  );
};
