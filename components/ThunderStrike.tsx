import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThunderStrikeProps {
  isActive: boolean;
  onComplete: () => void;
}

// Helper to generate fractal lightning paths
const generateLightningBolt = (x1: number, y1: number, x2: number, y2: number, displace: number, iteration: number = 0): string => {
    if (displace < 2 || iteration > 5) { // Base case: straight line if segment is small
        return `L ${x2} ${y2}`;
    }

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Calculate perpendicular offset
    // This creates the "jagged" look
    const offsetX = (Math.random() - 0.5) * displace;
    const offsetY = (Math.random() - 0.5) * displace;

    const targetX = midX + offsetX;
    const targetY = midY + offsetY;

    // Recursively split the segment
    return generateLightningBolt(x1, y1, targetX, targetY, displace / 2, iteration + 1) + 
           generateLightningBolt(targetX, targetY, x2, y2, displace / 2, iteration + 1);
};

// Helper to generate a branch off the main bolt
const generateBranch = (startX: number, startY: number): string => {
    const angle = Math.random() * Math.PI * 2;
    const length = 20 + Math.random() * 40;
    const endX = startX + Math.cos(angle) * length;
    const endY = startY + Math.sin(angle) * length;
    return `M ${startX} ${startY} ` + generateLightningBolt(startX, startY, endX, endY, 15);
}

export const ThunderStrike: React.FC<ThunderStrikeProps> = ({ isActive, onComplete }) => {
  const [bolts, setBolts] = useState<string[]>([]);
  const [flashColor, setFlashColor] = useState('white');

  useEffect(() => {
    if (isActive) {
      const newBolts = [];
      // Chaos Colors for the "Power" feel
      const colors = ['#FFFFFF', '#E0FFFF', '#F0F8FF'];
      setFlashColor(colors[Math.floor(Math.random() * colors.length)]);

      // Create 3-5 Main Bolts
      const numBolts = 3 + Math.floor(Math.random() * 3);
      
      for(let i=0; i<numBolts; i++) {
          // Random start on edges
          const isVertical = Math.random() > 0.5;
          const startX = isVertical ? Math.random() * 100 : (Math.random() > 0.5 ? 0 : 100);
          const startY = isVertical ? (Math.random() > 0.5 ? 0 : 100) : Math.random() * 100;
          
          // Target roughly center
          const endX = 30 + Math.random() * 40;
          const endY = 30 + Math.random() * 40;

          // Start path
          let path = `M ${startX} ${startY} `;
          // Append fractal path
          path += generateLightningBolt(startX, startY, endX, endY, 40); // 40 is initial displacement/jaggedness
          
          newBolts.push(path);

          // Chance to add a "Branch" bolt that forks off
          if (Math.random() > 0.3) {
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;
              newBolts.push(generateBranch(midX, midY));
          }
      }

      setBolts(newBolts);

      const timer = setTimeout(() => {
        onComplete();
      }, 1000); // Effect duration
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
            transition={{ duration: 0.6 }}
        >
          {/* 1. BLINDING FLASH (Mixed with Color) */}
          <motion.div 
            className="absolute inset-0 bg-white"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.3, ease: "circOut" }}
          />
          <motion.div 
            className="absolute inset-0 bg-cyan-500/30 mix-blend-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.5 }}
          />

          {/* 2. CHROMATIC ABERRATION SHIFT (RGB Split effect) */}
          <motion.div
             className="absolute inset-0 w-full h-full mix-blend-screen"
             animate={{ x: [-5, 5, -2, 2, 0], opacity: [0.5, 0] }}
             transition={{ duration: 0.2 }}
             style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }} // Red Shift
          />
          <motion.div
             className="absolute inset-0 w-full h-full mix-blend-screen"
             animate={{ x: [5, -5, 2, -2, 0], opacity: [0.5, 0] }}
             transition={{ duration: 0.2 }}
             style={{ backgroundColor: 'rgba(0, 0, 255, 0.1)' }} // Blue Shift
          />

          {/* 3. VIOLENT CAMERA SHAKE */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ 
                x: [-20, 20, -15, 15, -5, 5, 0],
                y: [-20, 20, -15, 15, -5, 5, 0],
                scale: [1, 1.05, 1] 
            }}
            transition={{ duration: 0.5, ease: "linear" }}
          >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <filter id="god-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <linearGradient id="bolt-grad-powerful" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#AEEEEE" />
                        <stop offset="100%" stopColor="#FFFFFF" />
                    </linearGradient>
                </defs>
                
                {bolts.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        stroke="url(#bolt-grad-powerful)"
                        strokeWidth="0.8"
                        fill="none"
                        filter="url(#god-glow)"
                        initial={{ pathLength: 0, opacity: 0, strokeWidth: 1.5 }}
                        animate={{ 
                            pathLength: 1, 
                            opacity: [1, 1, 0],
                            strokeWidth: [1.5, 3, 0.5] // Pulsing width
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                ))}

                {/* Impact Flash at Center */}
                <motion.circle 
                    cx="50" cy="50" r="2"
                    fill="white"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 40], opacity: [1, 0] }}
                    transition={{ duration: 0.4 }}
                />
              </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};