import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThunderStrikeProps {
  isActive: boolean;
  onComplete: () => void;
}

// Recursive Fractal Generation for Realistic Lightning
const generateLightningPath = (x1: number, y1: number, x2: number, y2: number, displace: number): string => {
    if (displace < 2) {
        return `L ${x2} ${y2}`;
    }

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Perpendicular offset based on displacement
    // Adding randomness to X and Y
    const offsetX = (Math.random() - 0.5) * displace;
    const offsetY = (Math.random() - 0.5) * displace;

    const targetX = midX + offsetX;
    const targetY = midY + offsetY;

    // Decay displacement for finer details in recursion
    return generateLightningPath(x1, y1, targetX, targetY, displace * 0.55) + 
           generateLightningPath(targetX, targetY, x2, y2, displace * 0.55);
};

export const ThunderStrike: React.FC<ThunderStrikeProps> = ({ isActive, onComplete }) => {
  const [bolts, setBolts] = useState<string[]>([]);

  useEffect(() => {
    if (isActive) {
      const newBolts = [];
      // Generate 2-4 main bolts
      const numBolts = 2 + Math.floor(Math.random() * 3);
      
      for(let i=0; i<numBolts; i++) {
          const startX = Math.random() * 100;
          const startY = 0; // Always from top for "Strike" feel
          const endX = Math.random() * 100;
          const endY = 100; // Strike ground

          let path = `M ${startX} ${startY} `;
          path += generateLightningPath(startX, startY, endX, endY, 30); // 30 is initial chaos
          newBolts.push(path);
      }

      setBolts(newBolts);

      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
            className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden mix-blend-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
          {/* 1. Camera Flash (Whiteout) */}
          <motion.div 
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0, 0.4, 0] }} // Double flash
            transition={{ duration: 0.4, times: [0, 0.1, 0.2, 0.3, 1] }}
          />

          {/* 2. Chromatic Aberration Layers (RGB Shift) */}
          <motion.div className="absolute inset-0 w-full h-full" animate={{ x: [-10, 10, 0] }} transition={{ duration: 0.1 }}>
             <BoltLayer bolts={bolts} color="#FF0000" opacity={0.7} width={2} blur={1} />
          </motion.div>
          <motion.div className="absolute inset-0 w-full h-full" animate={{ x: [10, -10, 0] }} transition={{ duration: 0.1 }}>
             <BoltLayer bolts={bolts} color="#0000FF" opacity={0.7} width={2} blur={1} />
          </motion.div>

          {/* 3. Main White Core */}
          <BoltLayer bolts={bolts} color="#FFFFFF" opacity={1} width={1.5} blur={0.5} />
          
          {/* 4. Glow */}
          <BoltLayer bolts={bolts} color="#00FFFF" opacity={0.6} width={6} blur={4} />

        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper component for rendering SVGs
const BoltLayer = ({ bolts, color, opacity, width, blur }: any) => (
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
            <filter id={`blur-${color}`}>
                <feGaussianBlur stdDeviation={blur} />
            </filter>
        </defs>
        {bolts.map((d: string, i: number) => (
            <motion.path
                key={i}
                d={d}
                stroke={color}
                strokeWidth={width}
                fill="none"
                filter={blur > 0 ? `url(#blur-${color})` : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, opacity, 0] }}
                transition={{ duration: 0.3, ease: "circOut" }}
            />
        ))}
    </svg>
);