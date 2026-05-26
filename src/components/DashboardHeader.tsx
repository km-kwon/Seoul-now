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
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";

const getIconButtonClass = (active = false) =>
  `${iconButtonBaseClass} ${
    active
      ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
      : "border-border bg-card text-foreground hover:bg-muted"
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
    <header className="rounded-[20px] border border-border bg-card p-4 shadow-soft sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">서울의 지금을 보는 창</p>
            <h1 className="truncate text-2xl font-bold tracking-normal sm:text-3xl">서울지금</h1>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
          <div className="flex min-w-0 flex-wrap gap-2">
            <div className="flex max-w-full items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm font-bold">
              <Clock3 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">현재 {formatClockTime(currentTime)}</span>
            </div>
            <div className="flex max-w-full items-center gap-2 rounded-2xl bg-primary/10 px-3 py-2 text-sm font-bold text-primary">
              <Activity className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{cityMood}</span>
            </div>
            <div className="hidden max-w-[22rem] items-center rounded-2xl border border-border px-3 py-2 text-sm font-medium text-muted-foreground xl:flex">
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
