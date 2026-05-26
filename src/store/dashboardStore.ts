import { create } from "zustand";
import type { AmbientSoundMode, SeasonThemePreference } from "../types/dashboard";

type DashboardState = {
  ambientSoundMode: AmbientSoundMode;
  isPlaying: boolean;
  selectedSnapshotId: string;
  seasonThemePreference: SeasonThemePreference;
  soundVolume: number;
  selectSnapshot: (snapshotId: string) => void;
  setAmbientSoundMode: (mode: AmbientSoundMode) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSeasonThemePreference: (preference: SeasonThemePreference) => void;
  setSoundVolume: (volume: number) => void;
  togglePlaying: () => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ambientSoundMode: "off",
  isPlaying: false,
  selectedSnapshotId: "now",
  seasonThemePreference: "auto",
  soundVolume: 0.45,
  selectSnapshot: (snapshotId) => set({ selectedSnapshotId: snapshotId }),
  setAmbientSoundMode: (mode) => set({ ambientSoundMode: mode }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setSeasonThemePreference: (preference) => set({ seasonThemePreference: preference }),
  setSoundVolume: (volume) => set({ soundVolume: Math.min(Math.max(volume, 0), 1) }),
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
}));
