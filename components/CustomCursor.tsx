import React, { useEffect, useState, memo } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

// --- Sub-component for Sparks to isolate re-renders ---
const LightningSparks = memo(({ isHovering }: { isHovering: boolean }) => {
    const [sparks, setSparks] = useState<{id: number, angle: number, path: string}[]>([]);

    // Helper to generate a jagged lightning path
    const getLightningPath = (angle: number, length: number) => {
        const rad = angle * (Math.PI / 180);
        const startX = 0;
        const startY = 0;
        const endX = Math.cos(rad) * length;
        const endY = Math.sin(rad) * length;
        
        // Jitter settings
        const segments = isHovering ? 3 : 2;
        const jitter = isHovering ? 8 : 4;
        
        let d = `M${startX},${startY}`;
        
        for(let i=1; i<=segments; i++) {
            const t = i / segments;
            const targetX = startX + (endX - startX) * t;
            const targetY = startY + (endY - startY) * t;
            
            // Simplified jitter: just randomize intermediate points
            const jx = (Math.random() - 0.5) * jitter;
            const jy = (Math.random() - 0.5) * jitter;
            
            if (i === segments) {
                d += ` L${endX},${endY}`;
            } else {
                d += ` L${targetX + jx},${targetY + jy}`;
            }
        }

        return d;
    };

    useEffect(() => {
        // Use requestAnimationFrame for smoother "game-loop" style updates if needed, 
        // but setInterval is fine if isolated. 
        // We'll use a slightly randomized interval to feel more organic.
        
        let timeoutId: any;
        
        const loop = () => {
            const count = isHovering ? 12 : 5; // More dense sparks
            const length = isHovering ? 45 : 20; // Longer reach

            const newSparks = Array.from({ length: count }).map((_, i) => ({
                id: Date.now() + i,
                angle: Math.random() * 360,
                path: getLightningPath(Math.random() * 360, length * (0.5 + Math.random() * 0.5))
            }));
            
            setSparks(newSparks);
            
            // Randomize timing between 30ms and 60ms for "crackling" feel
            timeoutId = setTimeout(loop, 30 + Math.random() * 30);
        };

        loop();
        return () => clearTimeout(timeoutId);
    }, [isHovering]);

    return (
        <svg 
            className="absolute w-40 h-40 overflow-visible pointer-events-none z-0" 
            viewBox="-50 -50 100 100"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
            <defs>
                {/* Intense Blue Glow */}
                <filter id="hard-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            {sparks.map((spark) => (
                <g key={spark.id}>
                    {/* Layer 1: The Glow (Thick, Blurred, Colored) */}
                    <path
                        d={spark.path}
                        stroke={isHovering ? "#00FFFF" : "#29D8FF"}
                        strokeWidth={isHovering ? 4 : 2.5}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#hard-glow)"
                        opacity={isHovering ? 0.6 : 0.4}
                    />
                    {/* Layer 2: The Core (Thin, Sharp, White) */}
                    <path
                        d={spark.path}
                        stroke="#FFFFFF"
                        strokeWidth={isHovering ? 1.5 : 1}
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.9}
                    />
                </g>
            ))}
        </svg>
    );
});

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // 1. LATENCY FIX: 
  // We strictly use useMotionValue for coordinates.
  // We do NOT store mouse position in React state.
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth trail spring
  const trailX = useSpring(mouseX, { damping: 25, stiffness: 400, mass: 0.2 });
  const trailY = useSpring(mouseY, { damping: 25, stiffness: 400, mass: 0.2 });

  useEffect(() => {
    // Passive event listener for max performance
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('a') || 
        target.closest('button') ||
        target.getAttribute('role') === 'button';
        
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* MAIN CURSOR (Zero Latency) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block will-change-transform"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <div className="relative flex items-center justify-center w-0 h-0">
             {/* 1. Core Plasma Dot */}
             <motion.div 
                animate={{ 
                    scale: isClicking ? 0.5 : (isHovering ? 1.5 : 1), 
                }}
                className={`rounded-full bg-white z-20 ${isHovering ? 'w-3 h-3 shadow-[0_0_20px_4px_#00FFFF]' : 'w-2 h-2 shadow-[0_0_10px_2px_rgba(41,216,255,0.8)]'}`}
             />
             
             {/* 2. Isolated Spark Component (Re-renders independently) */}
             <LightningSparks isHovering={isHovering} />
        </div>
      </motion.div>

      {/* TRAILING GHOST (Smooth Follow) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block will-change-transform"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
         {/* Simplified Glow for performance */}
         <motion.div 
            animate={{ scale: isHovering ? 2 : 1, opacity: isHovering ? 0.8 : 0.4 }}
            className="w-8 h-8 bg-cyan-500/30 rounded-full blur-xl" 
         />
      </motion.div>
    </>
  );
};
