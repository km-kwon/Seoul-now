import { useCallback, useEffect, useRef, useState } from "react";
import type { AmbientSoundMode } from "../types/dashboard";

export type AmbientSoundStatus = "off" | "idle" | "loading" | "playing" | "missing" | "blocked";

const audioSources: Record<Exclude<AmbientSoundMode, "off">, string> = {
  rain: "/audio/rain.mp3",
  station: "/audio/station.mp3",
  night: "/audio/night.mp3",
};

export const useAmbientSound = (mode: AmbientSoundMode, volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activatedRef = useRef(false);
  const appliedModeRef = useRef<AmbientSoundMode>("off");
  const [hasUserActivated, setHasUserActivated] = useState(false);
  const [status, setStatus] = useState<AmbientSoundStatus>("off");

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    appliedModeRef.current = "off";
    setStatus("off");
  }, []);

  const releaseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
  }, []);

  const createAudio = useCallback(
    (nextMode: Exclude<AmbientSoundMode, "off">) => {
      releaseAudio();

      const audio = new Audio(audioSources[nextMode]);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = volume;
      audio.onerror = () => {
        setStatus("missing");
      };
      audioRef.current = audio;

      return audio;
    },
    [releaseAudio, volume],
  );

  const playMode = useCallback(
    async (nextMode: AmbientSoundMode) => {
      activatedRef.current = true;
      setHasUserActivated(true);
      appliedModeRef.current = nextMode;

      if (nextMode === "off") {
        stop();
        return;
      }

      setStatus("loading");
      const audio = createAudio(nextMode);

      try {
        await audio.play();
        setStatus("playing");
      } catch (error) {
        const errorName = error instanceof DOMException ? error.name : "";
        setStatus(errorName === "NotAllowedError" ? "blocked" : "missing");
      }
    },
    [createAudio, stop],
  );

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!activatedRef.current || mode === appliedModeRef.current) {
      return;
    }

    void playMode(mode);
  }, [mode, playMode]);

  useEffect(() => {
    return () => {
      releaseAudio();
    };
  }, [releaseAudio]);

  return {
    hasUserActivated,
    playMode,
    status,
    stop,
  };
};
