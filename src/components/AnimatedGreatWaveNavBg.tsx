import React from 'react';
import { motion } from 'motion/react';

interface AnimatedGreatWaveNavBgProps {
  theme?: 'light' | 'dark';
  speed?: number;      // ความเร็วของ animation (ค่า default = 1)
  intensity?: number;  // ความแรงของการเคลื่อนไหว (ค่า default = 1)
}

export const AnimatedGreatWaveNavBg: React.FC<AnimatedGreatWaveNavBgProps> = ({
  theme = 'light',
  speed = 1,
  intensity = 1,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. Gradient Base */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-t from-[#041226]/95 via-[#0A2540]/85 to-[#0F355C]/75'
            : 'bg-gradient-to-t from-white/90 via-[#F0F6FF]/85 to-sky-50/75'
        }`}
      />

      {/* 2. Primary Wave */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        initial={{ y: 2, scale: 1 }}
        animate={{
          y: [2, -5 * intensity, 0, 3, 2],
          x: [0, 4 * intensity, -3 * intensity, 2, 0],
          scale: [1, 1.03, 1.01, 0.99, 1],
          rotate: [0, 0.4, -0.3, 0.2, 0],
        }}
        transition={{
          duration: 7 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative w-full h-[150%] max-w-2xl mx-auto flex items-end justify-center">
          <img
            src="/great-wave.jpg"
            alt="The Great Wave background"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-bottom transition-opacity duration-300 filter ${
              isDark
                ? 'opacity-40 brightness-95 contrast-125 saturate-125'
                : 'opacity-30 brightness-105 contrast-110 saturate-110'
            }`}
          />
        </div>
      </motion.div>

      {/* 3. Secondary Crest */}
      <motion.div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        initial={{ y: 0, scale: 1 }}
        animate={{
          y: [0, 4 * intensity, -3 * intensity, 1, 0],
          x: [0, -3 * intensity, 3 * intensity, -1, 0],
          scale: [1, 0.99, 1.02, 1],
        }}
        transition={{
          duration: 9 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.8,
        }}
      >
        <div className="relative w-full h-[135%] max-w-xl mx-auto flex items-end justify-center">
          <img
            src="/great-wave.jpg"
            alt="The Great Wave secondary swell"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-bottom transition-opacity duration-300 mix-blend-screen filter ${
              isDark
                ? 'opacity-20 hue-rotate-15'
                : 'opacity-15 hue-rotate-[-10deg]'
            }`}
          />
        </div>
      </motion.div>

      {/* 4. Shimmer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: '-100%' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{
          duration: 6.5 / speed,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatDelay: 2,
        }}
      >
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] blur-[2px]" />
      </motion.div>

      {/* 5. Foam Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/70 filter blur-[0.5px]"
            style={{
              left: `${15 + i * 6}%`,
              bottom: `${30 + i * 3}%`,
            }}
            animate={{
              y: [0, -20 * intensity, 0],
              x: [0, (i % 2 === 0 ? 4 : -4) * intensity, 0],
              opacity: [0.2, 0.9, 0],
              scale: [0.7, 1.4, 0.5],
            }}
            transition={{
              duration: (3 + i * 0.5) / speed,
              repeat: Infinity,
              ease: 'easeOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* 6. Frosted Glass Overlay */}
      <div
        className={`absolute inset-0 backdrop-blur-[1px] transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-t from-slate-950/80 via-slate-900/50 to-transparent'
            : 'bg-gradient-to-t from-white/85 via-white/55 to-white/25'
        }`}
      />

      {/* 7. Golden Accent */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF8A00]/40 to-transparent" />
    </div>
  );
};
