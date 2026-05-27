import {
  Activity,
  Building2,
  Check,
  Clock3,
  Moon,
  Share2,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ThemeMode } from "../types/dashboard";
import { formatClockTime } from "../utils/format";

type DashboardHeaderProps = {
  cityMood: string;
  currentTime: Date;
  headline: string;
  shareComplete: boolean;
  soundControl: ReactNode;
  theme: ThemeMode;
  onShare: () => void;
  onToggleTheme: () => void;
};

const iconButtonBaseClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";

const getIconButtonClass = (active = false) =>
  `${iconButtonBaseClass} ${
    active
      ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
      : "border-border bg-card/60 text-foreground hover:bg-muted/80"
  }`;

export const DashboardHeader = ({
  cityMood,
  currentTime,
  headline,
  shareComplete,
  soundControl,
  theme,
  onShare,
  onToggleTheme,
}: DashboardHeaderProps) => {
  return (
    <header>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Building2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">서울의 지금을 보는 창</p>
            <h1 className="truncate text-xl font-bold tracking-normal sm:text-2xl">서울지금</h1>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <div className="flex min-w-0 flex-wrap gap-2">
            <div className="flex max-w-full items-center gap-2 rounded-full bg-muted/70 px-3 py-1.5 text-xs font-bold">
              <Clock3 className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{formatClockTime(currentTime)}</span>
            </div>
            <div className="flex max-w-full items-center gap-2 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-bold text-primary">
              <Activity className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{cityMood}</span>
            </div>
            <div className="hidden max-w-[22rem] items-center rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground xl:flex">
              <span className="truncate">{headline}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              className={getIconButtonClass(theme === "dark")}
              aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
              title={theme === "dark" ? "라이트 모드" : "다크 모드"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Moon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            {soundControl}
            <button
              type="button"
              onClick={onShare}
              className={getIconButtonClass(shareComplete)}
              aria-label={shareComplete ? "공유 링크 복사됨" : "공유하기"}
              title={shareComplete ? "공유 링크 복사됨" : "공유"}
            >
              {shareComplete ? (
                <Check className="h-5 w-5 text-success" aria-hidden="true" />
              ) : (
                <Share2 className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
