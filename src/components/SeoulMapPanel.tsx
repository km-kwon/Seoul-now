import { Map, Thermometer, Train } from "lucide-react";
import { SeoulMap } from "./SeoulMap";
import type { AmbientSoundMode, TimeSnapshot } from "../types/dashboard";
import {
  formatTemperature,
  getArrivalText,
  getAverageTemperature,
  getSubwayLineColor,
  getTrainStatusLabel,
} from "../utils/format";

type SeoulMapPanelProps = {
  onSoundModeRequest: (mode: AmbientSoundMode) => void;
  snapshot: TimeSnapshot;
};

export const SeoulMapPanel = ({ onSoundModeRequest, snapshot }: SeoulMapPanelProps) => {
  const averageTemperature = getAverageTemperature(snapshot.weatherZones);

  return (
    <section className="rounded-[20px] border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Map className="h-4 w-4 text-primary" aria-hidden="true" />
            서울 지도 패널
          </p>
          <h2 className="mt-2 text-safe text-xl font-bold tracking-normal sm:text-2xl">
            {snapshot.summary.headline}
          </h2>
          <p className="mt-2 text-safe text-sm leading-6 text-muted-foreground">
            {snapshot.summary.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">
          <Thermometer className="h-4 w-4" aria-hidden="true" />
          평균 {formatTemperature(averageTemperature)}
        </div>
      </div>

      <div className="mt-4">
        <SeoulMap snapshot={snapshot} onSoundModeRequest={onSoundModeRequest} />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {snapshot.trains.map((train) => (
          <div key={train.id} className="min-w-0 rounded-2xl bg-muted/70 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: getSubwayLineColor(train.line) }}
                  aria-hidden="true"
                />
                <p className="truncate text-sm font-bold">{train.line}</p>
              </div>
              <p className={`shrink-0 text-xs font-bold ${train.isDelayed ? "text-danger" : "text-primary"}`}>
                {getTrainStatusLabel(train)}
              </p>
            </div>
            <div className="mt-2 h-2 rounded-full bg-card">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${train.congestion}%` }}
              />
            </div>
            <p className="mt-2 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
              <Train className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {train.nextStation} {getArrivalText(train.arrivalMinutes)}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
