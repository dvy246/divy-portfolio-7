import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PlasmaStormProps {
  isHovering: boolean;
}

export const PlasmaStorm: React.FC<PlasmaStormProps> = ({ isHovering }) => {
  // We use refs to manipulate the SVG filter directly for max performance (no React re-renders)
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  
  useEffect(() => {
    let frameId: number;
    let baseFreqX = 0.02;
    let baseFreqY = 0.03;

    const animate = () => {
      if (turbulenceRef.current) {
        // Subtle shift in noise frequency creates the "flowing" electricity look
        // We increase speed significantly when hovering
        const speed = isHovering ? 0.0005 : 0.0001; 
        baseFreqX += speed;
        // Keep frequency within a specific "electric" range
        if (baseFreqX > 0.06) baseFreqX = 0.02;

        // Update the filter attributes directly
        turbulenceRef.current.setAttribute('baseFrequency', `${baseFreqX} ${baseFreqY}`);
        turbulenceRef.current.setAttribute('seed', Math.floor(Math.random() * 100).toString());
      }
      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [isHovering]);

  return (
    <div className="absolute -inset-16 z-0 pointer-events-none mix-blend-screen overflow-visible">
      <motion.svg 
        viewBox="0 0 200 200" 
        className="w-full h-full overflow-visible"
        animate={{ opacity: isHovering ? 1 : 0.3, scale: isHovering ? 1.1 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <defs>
          {/* THE SECRET SAUCE: SVG Turbulence Filter */}
          <filter id="plasma-filter" x="-50%" y="-50%" width="200%" height="200%">
            {/* Generates Noise */}
            <feTurbulence 
              ref={turbulenceRef}
              type="fractalNoise" 
              baseFrequency="0.02 0.03" 
              numOctaves="3" 
              result="noise" 
            />
            {/* Displaces the SourceGraphic (Circles) using the Noise */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="noise" 
              scale={isHovering ? "25" : "10"} 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
            {/* Adds a glow to the result */}
            <feGaussianBlur stdDeviation="1.5" result="blurred" />
            <feColorMatrix 
                type="matrix" 
                values="0 0 0 0 0  
                        0 0 0 0 0.8  
                        0 0 0 0 1  
                        0 0 0 18 -7" 
                result="goo" 
            />
            <feMerge>
                <feMergeNode in="blurred" />
                <feMergeNode in="goo" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="electric-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stopColor="#29D8FF" />
             <stop offset="50%" stopColor="#FFFFFF" />
             <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* 
            Container Group with Filter Applied. 
            We draw simple circles, but the filter distorts them into electric arcs.
        */}
        <g filter="url(#plasma-filter)">
            {/* Core Energy Ring */}
            <circle 
                cx="100" cy="100" r="48" 
                fill="none" 
                stroke="url(#electric-gradient)" 
                strokeWidth={isHovering ? "3" : "2"}
                opacity="0.8"
            />
            
            {/* Outer Chaos Ring (Only visible on hover) */}
            <motion.circle 
                cx="100" cy="100" r="55" 
                fill="none" 
                stroke="#29D8FF" 
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 0.6 : 0 }}
            />

            {/* Orbiting Particles that get distorted into lightning arcs */}
            <motion.circle 
                cx="100" cy="100" r="60"
                stroke="#fff"
                strokeWidth="2"
                strokeDasharray="10 40"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                opacity={isHovering ? 0.4 : 0}
            />
        </g>
      </motion.svg>
      
      {/* Decorative Rotating Tech Ring (No distortion, crisp UI element) */}
      <motion.div 
        className="absolute inset-8 rounded-full border border-cyan-500/30 border-dashed"
        animate={{ rotate: -360, scale: isHovering ? 1.05 : 1 }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" } }}
      />
    </div>
  );
};