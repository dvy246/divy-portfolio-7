import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ElectricOverlayProps {
  className?: string;
}

export const ElectricOverlay: React.FC<ElectricOverlayProps> = ({ className = "" }) => {
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const generateLightning = () => {
      const newPaths = [];
      const numBolts = Math.floor(Math.random() * 2) + 1; // 1-2 bolts at a time

      for (let i = 0; i < numBolts; i++) {
        // Start from a random edge
        // 0: top, 1: right, 2: bottom, 3: left
        const startEdge = Math.floor(Math.random() * 4);
        
        // Simple coordinate mapping (0-100 system)
        let startX = 0, startY = 0;
        let endX = 0, endY = 0;

        // Randomize start position on the chosen edge
        switch(startEdge) {
            case 0: startX = Math.random() * 100; startY = 0; break;
            case 1: startX = 100; startY = Math.random() * 100; break;
            case 2: startX = Math.random() * 100; startY = 100; break;
            case 3: startX = 0; startY = Math.random() * 100; break;
        }

        // Target center-ish or another edge
        endX = 20 + Math.random() * 60;
        endY = 20 + Math.random() * 60;

        // Generate jagged path
        let path = `M ${startX} ${startY}`;
        const segments = 8;
        let currX = startX;
        let currY = startY;
        
        const dx = (endX - startX) / segments;
        const dy = (endY - startY) / segments;

        for (let j = 0; j < segments; j++) {
            // Add jitter
            const jitter = (Math.random() - 0.5) * 10; // Jitter amount
            currX += dx;
            currY += dy;
            path += ` L ${currX + jitter} ${currY + jitter}`;
        }
        newPaths.push(path);
      }
      setPaths(newPaths);
    };

    // Fast interval for flickering effect
    const interval = setInterval(generateLightning, 120);
    generateLightning(); // Initial run

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none z-20 overflow-hidden ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="currentColor" // Uses text color (should be set to accent color in parent)
            strokeWidth="0.5"
            fill="none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2 }}
            filter="url(#glow)"
            className="text-light-accent dark:text-dark-accent"
          />
        ))}
      </svg>
    </div>
  );
};