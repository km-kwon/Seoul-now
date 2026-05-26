export type ThemeMode = "light" | "dark";

export type Coordinates = {
  lat: number;
  lng: number;
};

export type WeatherZone = {
  id: string;
  name: string;
  coordinates: Coordinates;
  weatherStatus: string;
  precipitationMm: number;
  temperature: number;
  umbrellaNeeded: boolean;
};

export type SubwayTrain = {
  id: string;
  line: string;
  currentLocation: string;
  direction: string;
  isDelayed: boolean;
  congestion: number;
  nextStation: string;
  arrivalMinutes: number;
  coordinates?: Coordinates;
};

export type SeoulInsightSeverity = "info" | "caution" | "alert";

export type SeoulInsight = {
  id: string;
  title: string;
  description: string;
  severity: SeoulInsightSeverity;
  relatedZones: string[];
  relatedLines: string[];
};

export type AmbientSoundMode = "off" | "rain" | "station" | "night";

export type SeasonName = "spring" | "summer" | "autumn" | "winter";

export type SeasonThemePreference = "auto" | SeasonName;

export type SeasonTheme = {
  season: SeasonName;
  particleType: string;
  accentColor: string;
  density: number;
};

export type TimeSnapshotSummary = {
  headline: string;
  description: string;
  cityMood: string;
  weatherLabel: string;
  transitLabel: string;
  soundMode: AmbientSoundMode;
  season: SeasonName;
};

export type TimeSnapshot = {
  id: string;
  label: string;
  time: string;
  weatherZones: WeatherZone[];
  trains: SubwayTrain[];
  summary: TimeSnapshotSummary;
};

export type SeoulDashboardData = {
  generatedAt: string;
  currentSnapshotId: string;
  defaultSoundMode: AmbientSoundMode;
  snapshots: TimeSnapshot[];
  seasonThemes: SeasonTheme[];
};
