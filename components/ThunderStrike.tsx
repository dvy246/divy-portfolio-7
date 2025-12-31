import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThunderStrikeProps {
  isActive: boolean;
  onComplete: () => void;
}

export const ThunderStrike: React.FC<ThunderStrikeProps> = ({ isActive, onComplete }) => {
  const [bolts, setBolts] = useState<string[]>([]);

  // Generate the lightning paths
  useEffect(() => {
    if (isActive) {
      const newBolts = [];
      // 4 Main bolts from corners to center
      const corners = [
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 0, y: 100 },
        { x: 100, y: 100 }
      ];

      corners.forEach(start => {
        let path = `M ${start.x} ${start.y}`;
        // Target center with some randomness
        const endX = 50 + (Math.random() * 10 - 5);
        const endY = 50 + (Math.random() * 10 - 5);
        
        const segments = 12;
        let currX = start.x;
        let currY = start.y;
        
        const dx = (endX - start.x) / segments;
        const dy = (endY - start.y) / segments;

        for (let i = 0; i < segments; i++) {
            // Intense jitter for the "Hard Shock" look
            const jitter = (Math.random() - 0.5) * 8; 
            currX += dx + (Math.random() - 0.5) * 2;
            currY += dy + (Math.random() - 0.5) * 2;
            
            // Midpoint jaggedness
            path += ` L ${currX + jitter} ${currY + jitter}`;
        }
        path += ` L ${endX} ${endY}`;
        newBolts.push(path);
      });

      setBolts(newBolts);

      // Reset after animation duration
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
            className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
          {/* 1. The Blind Flash (Whiteout) */}
          <motion.div 
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />

          {/* 2. The Atmospheric Glow (Blue/Purple) */}
          <motion.div 
            className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8 }}
          />

          {/* 3. The Camera Shake Wrapper */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ 
                x: [-10, 10, -5, 5, -2, 2, 0],
                y: [-5, 5, -2, 2, 0] 
            }}
            transition={{ duration: 0.4 }}
          >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <filter id="hard-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#29D8FF" />
                        <stop offset="100%" stopColor="#bfdbfe" />
                    </linearGradient>
                </defs>
                
                {bolts.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        stroke="url(#bolt-grad)"
                        strokeWidth="0.8"
                        fill="none"
                        filter="url(#hard-glow)"
                        initial={{ pathLength: 0, opacity: 0, strokeWidth: 0.2 }}
                        animate={{ 
                            pathLength: [0, 1, 1], 
                            opacity: [1, 1, 0],
                            strokeWidth: [0.2, 1.5, 0]
                        }}
                        transition={{ duration: 0.4, times: [0, 0.1, 1] }}
                    />
                ))}

                {/* Central Impact Burst */}
                <motion.circle 
                    cx="50" cy="50" r="1"
                    fill="white"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: [0, 20, 30], opacity: [1, 0.5, 0] }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    filter="url(#hard-glow)"
                />
              </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};