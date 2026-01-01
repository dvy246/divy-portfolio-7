import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShatteredGlassIntroProps {
  onComplete: () => void;
  triggerShatter: boolean;
}

// Pre-calculated Voronoi-like polygons to cover 100% of the viewport (4x4 Grid with perturbation)
// These share vertices exactly to prevent subpixel gaps before shattering.
const SHARDS = [
  // Row 1
  { id: 1, clip: "polygon(0% 0%, 25% 0%, 20% 25%, 0% 20%)", delay: 0.1 },
  { id: 2, clip: "polygon(25% 0%, 50% 0%, 55% 20%, 20% 25%)", delay: 0.05 },
  { id: 3, clip: "polygon(50% 0%, 75% 0%, 70% 25%, 55% 20%)", delay: 0.05 },
  { id: 4, clip: "polygon(75% 0%, 100% 0%, 100% 20%, 70% 25%)", delay: 0.1 },
  // Row 2
  { id: 5, clip: "polygon(0% 20%, 20% 25%, 25% 55%, 0% 50%)", delay: 0.08 },
  { id: 6, clip: "polygon(20% 25%, 55% 20%, 50% 50%, 25% 55%)", delay: 0 }, // Center - fast
  { id: 7, clip: "polygon(55% 20%, 70% 25%, 80% 55%, 50% 50%)", delay: 0 }, // Center - fast
  { id: 8, clip: "polygon(70% 25%, 100% 20%, 100% 50%, 80% 55%)", delay: 0.08 },
  // Row 3
  { id: 9, clip: "polygon(0% 50%, 25% 55%, 20% 80%, 0% 75%)", delay: 0.1 },
  { id: 10, clip: "polygon(25% 55%, 50% 50%, 55% 75%, 20% 80%)", delay: 0.02 },
  { id: 11, clip: "polygon(50% 50%, 80% 55%, 75% 80%, 55% 75%)", delay: 0.02 },
  { id: 12, clip: "polygon(80% 55%, 100% 50%, 100% 75%, 75% 80%)", delay: 0.1 },
  // Row 4
  { id: 13, clip: "polygon(0% 75%, 20% 80%, 25% 100%, 0% 100%)", delay: 0.15 },
  { id: 14, clip: "polygon(20% 80%, 55% 75%, 50% 100%, 25% 100%)", delay: 0.12 },
  { id: 15, clip: "polygon(55% 75%, 75% 80%, 80% 100%, 50% 100%)", delay: 0.12 },
  { id: 16, clip: "polygon(75% 80%, 100% 75%, 100% 100%, 80% 100%)", delay: 0.15 },
];

export const ShatteredGlassIntro: React.FC<ShatteredGlassIntroProps> = ({ onComplete, triggerShatter }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (triggerShatter) {
      // Allow animations to play out (approx 1.2s max duration) then cleanup
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [triggerShatter, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[99999] overflow-hidden pointer-events-none">
          {/* 
             Container Strategy: 
             We render the shards absolutely positioned filling the screen.
             Before 'triggerShatter', they sit perfectly still creating a white screen.
             After 'triggerShatter', they animate.
          */}
          {SHARDS.map((shard) => (
            <motion.div
              key={shard.id}
              className="absolute inset-0 bg-white origin-center will-change-transform"
              style={{ clipPath: shard.clip }}
              initial={{ y: 0, x: 0, rotate: 0, scale: 1, opacity: 1 }}
              animate={triggerShatter ? {
                y: "120vh",
                x: (Math.random() - 0.5) * 100, // Random lateral scatter
                rotate: (Math.random() - 0.5) * 90, // Random tumble
                scale: 0.9, // Slight depth effect
                opacity: 0
              } : {}}
              transition={{
                duration: 1.2,
                ease: [0.75, 0, 0.25, 1], // Heavy gravity ease ("circIn" equivalent feel)
                delay: shard.delay,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};
