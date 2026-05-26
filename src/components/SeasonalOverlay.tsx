import { motion, useReducedMotion } from "framer-motion";
import type { SeasonTheme } from "../types/dashboard";

type SeasonalOverlayProps = {
  isLastTrainTime: boolean;
  theme: SeasonTheme;
};

type Particle = {
  delay: number;
  duration: number;
  left: number;
  rotate: number;
  size: number;
  top: number;
};

const particlesBySeason: Record<SeasonTheme["season"], Particle[]> = {
  spring: [
    { left: 12, top: -8, size: 9, delay: 0.2, duration: 16, rotate: -18 },
    { left: 36, top: -12, size: 7, delay: 5.4, duration: 18, rotate: 24 },
    { left: 68, top: -10, size: 8, delay: 9.2, duration: 17, rotate: -32 },
    { left: 84, top: -14, size: 6, delay: 13.6, duration: 19, rotate: 16 },
  ],
  summer: [
    { left: 18, top: -16, size: 18, delay: 0.3, duration: 4.8, rotate: 0 },
    { left: 44, top: -20, size: 20, delay: 1.8, duration: 5.2, rotate: 0 },
    { left: 71, top: -14, size: 16, delay: 3.1, duration: 4.6, rotate: 0 },
    { left: 88, top: -18, size: 19, delay: 4.2, duration: 5.4, rotate: 0 },
    { left: 28, top: -24, size: 16, delay: 5.1, duration: 5.1, rotate: 0 },
  ],
  autumn: [
    { left: 16, top: -10, size: 10, delay: 1.1, duration: 15, rotate: 32 },
    { left: 48, top: -12, size: 12, delay: 6.8, duration: 18, rotate: -24 },
    { left: 76, top: -16, size: 9, delay: 11.2, duration: 16, rotate: 18 },
    { left: 91, top: -9, size: 11, delay: 14.6, duration: 19, rotate: -36 },
  ],
  winter: [
    { left: 10, top: -8, size: 4, delay: 0.5, duration: 10, rotate: 0 },
    { left: 25, top: -14, size: 3, delay: 2.4, duration: 12, rotate: 0 },
    { left: 42, top: -10, size: 4, delay: 4.2, duration: 11, rotate: 0 },
    { left: 58, top: -16, size: 3, delay: 6.1, duration: 13, rotate: 0 },
    { left: 74, top: -11, size: 4, delay: 8.3, duration: 12, rotate: 0 },
    { left: 90, top: -18, size: 3, delay: 10.2, duration: 14, rotate: 0 },
  ],
};

const getParticleClass = (season: SeasonTheme["season"]) => {
  if (season === "summer") {
    return "rounded-full border border-primary/20 bg-primary/15";
  }

  if (season === "winter") {
    return "rounded-full bg-white/80 shadow-sm";
  }

  if (season === "autumn") {
    return "rounded-full bg-warning/45";
  }

  return "rounded-full bg-pink-300/50";
};

const getParticleStyle = (particle: Particle, theme: SeasonTheme) => {
  if (theme.season === "summer") {
    return {
      backgroundColor: `${theme.accentColor}22`,
      borderColor: `${theme.accentColor}44`,
      height: `${particle.size * 2.2}px`,
      left: `${particle.left}%`,
      top: `${particle.top}%`,
      width: "1.5px",
    };
  }

  if (theme.season === "autumn") {
    return {
      backgroundColor: `${theme.accentColor}99`,
      height: `${particle.size * 0.58}px`,
      left: `${particle.left}%`,
      top: `${particle.top}%`,
      transform: `rotate(${particle.rotate}deg)`,
      width: `${particle.size}px`,
    };
  }

  return {
    height: `${particle.size}px`,
    left: `${particle.left}%`,
    top: `${particle.top}%`,
    width: `${particle.size}px`,
  };
};

export const SeasonalOverlay = ({ isLastTrainTime, theme }: SeasonalOverlayProps) => {
  const shouldReduceMotion = useReducedMotion();
  const baseParticles = particlesBySeason[theme.season];
  const particleCount = shouldReduceMotion
    ? Math.max(2, Math.round(baseParticles.length * 0.45))
    : Math.max(2, Math.round(baseParticles.length * Math.max(0.45, theme.density * 1.6)));
  const particles = baseParticles.slice(0, particleCount);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {isLastTrainTime ? (
        <motion.div
          className="absolute inset-0 bg-slate-950/10 dark:bg-slate-950/20"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45 }}
        />
      ) : null}

      {particles.map((particle, index) => (
        <motion.span
          key={`${theme.season}-${index}`}
          aria-hidden="true"
          className={`absolute block opacity-60 ${getParticleClass(theme.season)}`}
          style={getParticleStyle(particle, theme)}
          initial={false}
          animate={
            shouldReduceMotion
              ? { opacity: 0.35 }
              : {
                  opacity: [0, 0.55, 0],
                  rotate: [particle.rotate, particle.rotate + 50],
                  x: theme.season === "summer" ? [0, 0] : [0, 18, -8],
                  y: ["0vh", "108vh"],
                }
          }
          transition={{
            delay: shouldReduceMotion ? 0 : particle.delay,
            duration: shouldReduceMotion ? 0 : particle.duration,
            ease: "linear",
            repeat: shouldReduceMotion ? 0 : Infinity,
          }}
        />
      ))}

      {isLastTrainTime ? (
        <motion.div
          role="status"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-2xl border border-border bg-card/95 px-4 py-3 text-sm font-bold text-foreground shadow-soft backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}
        >
          이제 집에 가요
        </motion.div>
      ) : null}
    </div>
  );
};
