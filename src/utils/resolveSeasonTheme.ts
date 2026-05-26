import type {
  SeasonName,
  SeasonTheme,
  SeasonThemePreference,
  TimeSnapshot,
} from "../types/dashboard";

type ResolvedSeasonTheme = {
  isAuto: boolean;
  isLastTrainTime: boolean;
  season: SeasonName;
  theme: SeasonTheme;
};

const fallbackTheme: SeasonTheme = {
  season: "spring",
  particleType: "petal",
  accentColor: "#3182F6",
  density: 0.24,
};

export const isLastTrainSnapshot = (snapshot: TimeSnapshot) => {
  const hour = Number(snapshot.time.slice(11, 13));
  const searchableText = `${snapshot.label} ${snapshot.summary.headline} ${snapshot.summary.description}`;

  return hour >= 23 || hour < 1 || searchableText.includes("막차");
};

export const resolveSeasonTheme = (
  snapshot: TimeSnapshot,
  themes: SeasonTheme[],
  preference: SeasonThemePreference,
): ResolvedSeasonTheme => {
  const season = preference === "auto" ? snapshot.summary.season : preference;
  const theme =
    themes.find((candidate) => candidate.season === season) ??
    themes.find((candidate) => candidate.season === snapshot.summary.season) ??
    fallbackTheme;

  return {
    isAuto: preference === "auto",
    isLastTrainTime: isLastTrainSnapshot(snapshot),
    season: theme.season,
    theme,
  };
};
