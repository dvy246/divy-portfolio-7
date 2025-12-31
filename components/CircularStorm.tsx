import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CircularStormProps {
  isHovering: boolean;
}

export const CircularStorm: React.FC<CircularStormProps> = ({ isHovering }) => {
  const [paths, setPaths] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isHovering) {
        setPaths([]);
        return;
    }

    const generateLightning = () => {
        // Generate 3 layers of concentric electricity for depth
        const newPaths = [];
        const layers = 3;
        
        for(let layer = 0; layer < layers; layer++) {
            const points = [];
            const segments = 40; // Number of jagged points
            const center = 50;   // Center of 100x100 SVG
            // Base radius varies slightly by layer
            const baseRadius = 48 + (layer * 2); 
            
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                
                // Add chaotic jitter to radius to simulate electricity
                // Layer 0 is tighter (core), Layer 2 is wilder (arcs)
                const variance = layer === 0 ? 1.5 : 4;
                const jitter = (Math.random() - 0.5) * variance;
                
                const r = baseRadius + jitter;
                const x = center + Math.cos(angle) * r;
                const y = center + Math.sin(angle) * r;
                
                points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
            }
            
            // Close the loop
            newPaths.push(`M ${points.join(" L ")} Z`);
        }
        setPaths(newPaths);
    }
    
    // High-speed update interval for "crackling" look
    const interval = setInterval(generateLightning, 60);
    return () => clearInterval(interval);
  }, [isHovering]);

  if (!isHovering) return null;

  return (
    <div className="absolute -inset-12 z-30 pointer-events-none">
       <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
                {/* Glow Filter */}
                <filter id="storm-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                {/* Gradient: Dark Blue -> Light Blue -> White */}
                <linearGradient id="storm-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00008B" /> {/* Dark Blue */}
                    <stop offset="50%" stopColor="#00BFFF" /> {/* Deep Sky Blue */}
                    <stop offset="100%" stopColor="#E0FFFF" /> {/* Light Cyan */}
                </linearGradient>
            </defs>

            {paths.map((d, i) => (
                <motion.path
                    key={i}
                    d={d}
                    fill="none"
                    strokeWidth={i === 0 ? 1.5 : 0.5} // Core is thicker
                    stroke={i === 0 ? "url(#storm-gradient)" : "#AEEEEE"} // Outer arcs are lighter
                    filter="url(#storm-glow)"
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: [0.4, 1, 0.4],
                        // Subtle rotation to make it feel alive
                        rotate: i % 2 === 0 ? [0, 5, 0] : [0, -5, 0] 
                    }}
                    transition={{ 
                        opacity: { duration: 0.1, repeat: Infinity, repeatType: "mirror" },
                        rotate: { duration: 0.2, repeat: Infinity }
                    }}
                    style={{ originX: "50%", originY: "50%" }}
                />
            ))}
       </svg>
    </div>
  );
};