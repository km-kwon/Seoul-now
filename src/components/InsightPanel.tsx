import { Activity, AlertTriangle, CheckCircle2, Sparkles, Train } from "lucide-react";
import type {
  SeoulInsight,
  SeoulInsightSeverity,
  SubwayTrain,
  TimeSnapshot,
} from "../types/dashboard";
import { getSubwayLineColor, getTrainStatusLabel } from "../utils/format";

type InsightPanelProps = {
  cityMood: string;
  error?: Error | null;
  insights: SeoulInsight[];
  isLoading?: boolean;
  snapshot: TimeSnapshot;
};

const severityClasses: Record<SeoulInsightSeverity, string> = {
  info: "bg-primary/10 text-primary",
  caution: "bg-warning/10 text-warning",
  alert: "bg-danger/10 text-danger",
};

const severityBorderClasses: Record<SeoulInsightSeverity, string> = {
  info: "border-primary/20",
  caution: "border-warning/30",
  alert: "border-danger/30",
};

const getInsightIcon = (severity: SeoulInsightSeverity) => {
  if (severity === "info") {
    return CheckCircle2;
  }

  if (severity === "alert") {
    return AlertTriangle;
  }

  return Sparkles;
};

const getTrainTextClass = (train: SubwayTrain) => {
  if (train.isDelayed) {
    return "text-danger";
  }

  if (train.congestion >= 80) {
    return "text-warning";
  }

  return "text-primary";
};

const InsightSkeleton = () => {
  return (
    <div className="space-y-3" aria-label="인사이트 불러오는 중">
      {[0, 1, 2].map((item) => (
        <div key={item} className="rounded-2xl border border-border p-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-2xl bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const InsightPanel = ({
  cityMood,
  error,
  insights,
  isLoading = false,
  snapshot,
}: InsightPanelProps) => {
  const zoneNameById = new Map(snapshot.weatherZones.map((zone) => [zone.id, zone.name]));

  return (
    <aside className="grid gap-4 lg:self-start">
      <section className="rounded-[20px] border border-border bg-card p-4 shadow-soft sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
              인사이트
            </p>
            <h2 className="mt-2 text-xl font-bold tracking-normal">5초 해석</h2>
          </div>
          <div className="rounded-2xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
            {cityMood}
          </div>
        </div>

        <div className="mt-4">
          {isLoading ? <InsightSkeleton /> : null}

          {!isLoading && error ? (
            <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
              <p className="text-sm font-bold text-danger">인사이트를 계산하지 못했어요</p>
              <p className="mt-1 text-safe text-sm leading-6 text-muted-foreground">
                날씨와 열차 데이터 형식을 확인하면 다시 해석할 수 있습니다.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && insights.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/50 p-4">
              <p className="text-sm font-bold">현재 큰 주의사항은 없어요</p>
              <p className="mt-1 text-safe text-sm leading-6 text-muted-foreground">
                강수와 지연 신호가 낮아 서울 흐름이 안정적으로 보입니다.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && insights.length > 0 ? (
            <div className="space-y-3">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.severity);
                const badges = [
                  ...insight.relatedLines,
                  ...insight.relatedZones.map((zoneId) => zoneNameById.get(zoneId) ?? zoneId),
                ];

                return (
                  <article
                    key={insight.id}
                    className={`rounded-2xl border p-4 ${severityBorderClasses[insight.severity]}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${severityClasses[insight.severity]}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-safe text-base font-bold">{insight.title}</h3>
                        <p className="mt-1 text-safe text-sm leading-6 text-muted-foreground">
                          {insight.description}
                        </p>
                        {badges.length > 0 ? (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {badges.map((tag) => (
                              <span
                                key={`${insight.id}-${tag}`}
                                className="rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[20px] border border-border bg-card p-4 shadow-soft sm:p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Train className="h-4 w-4 text-primary" aria-hidden="true" />
          노선 흐름
        </p>
        <div className="mt-4 space-y-4">
          {snapshot.trains.map((train) => (
            <div key={train.id} className="min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: getSubwayLineColor(train.line) }}
                    aria-hidden="true"
                  />
                  <p className="truncate text-sm font-bold">{train.line}</p>
                </div>
                <p className={`shrink-0 text-sm font-bold ${getTrainTextClass(train)}`}>
                  {getTrainStatusLabel(train)}
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${train.congestion}%` }}
                />
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {train.currentLocation} · {train.direction}
              </p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};
