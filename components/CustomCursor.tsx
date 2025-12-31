import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // 1. LATENCY FIX: Use MotionValues directly without spring for the main container
  // This ensures the cursor feels 1:1 with hardware mouse movement
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // We use a very tight spring only for the "trailing" sparks to give them weight, not the main cursor
  const trailX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 });
  const trailY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 });

  const [sparks, setSparks] = useState<{id: number, angle: number, scale: number, opacity: number}[]>([]);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Center the cursor (assuming ~24px size)
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check for clickable elements
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

    window.addEventListener('mousemove', moveCursor);
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

  // Lightning Generation Loop
  useEffect(() => {
    const interval = setInterval(() => {
        // Generate random sparks
        const count = isHovering ? 5 : 3;
        const newSparks = Array.from({ length: count }).map((_, i) => ({
            id: Date.now() + i,
            angle: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random()
        }));
        setSparks(newSparks);
    }, 80); // Fast flicker rate

    return () => clearInterval(interval);
  }, [isHovering]);

  // Helper to generate a jagged lightning path for a spark
  const getLightningPath = (angle: number, length: number) => {
      const rad = angle * (Math.PI / 180);
      const startX = 0;
      const startY = 0;
      const endX = Math.cos(rad) * length;
      const endY = Math.sin(rad) * length;
      
      // Create midpoint jitter
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 10;
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 10;

      return `M${startX},${startY} Q${midX},${midY} ${endX},${endY}`;
  };

  return (
    <>
      {/* MAIN HARDWARE CURSOR REPLACEMENT (Zero Latency) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
        <div className="relative flex items-center justify-center w-8 h-8">
             {/* 1. Core Plasma Dot */}
             <motion.div 
                animate={{ 
                    scale: isClicking ? 0.8 : (isHovering ? 1.5 : 1),
                    filter: isHovering ? "blur(1px)" : "blur(0px)"
                }}
                className={`rounded-full bg-white shadow-[0_0_15px_2px_rgba(41,216,255,0.8)] z-20 ${isHovering ? 'w-2 h-2' : 'w-1.5 h-1.5'}`}
             />
             
             {/* 2. Inner Blue Glow Ring (Rotates) */}
             <motion.div 
                animate={{ 
                    rotate: 360, 
                    scale: isHovering ? 1.2 : 0.8,
                    opacity: isHovering ? 1 : 0.5
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-cyan-400/50 z-10"
             />

             {/* 3. Dynamic Lightning Sparks */}
             <svg className="absolute w-24 h-24 overflow-visible pointer-events-none z-0 opacity-80" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                 <defs>
                     <filter id="spark-glow">
                         <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                         <feMerge>
                             <feMergeNode in="coloredBlur"/>
                             <feMergeNode in="SourceGraphic"/>
                         </feMerge>
                     </filter>
                 </defs>
                 {sparks.map((spark) => (
                     <motion.path
                        key={spark.id}
                        d={getLightningPath(spark.angle, isHovering ? 25 : 12)}
                        stroke={isHovering ? "#00FFFF" : "#FFFFFF"}
                        strokeWidth={isHovering ? 1.5 : 1}
                        fill="none"
                        filter="url(#spark-glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                        transition={{ duration: 0.15 }}
                     />
                 ))}
             </svg>
        </div>
      </motion.div>

      {/* TRAILING GHOST (Slight Latency for visual smoothness) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%"
        }}
      >
         <div className="w-12 h-12 bg-cyan-500/10 rounded-full blur-xl" />
      </motion.div>
    </>
  );
};