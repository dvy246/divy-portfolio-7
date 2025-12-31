import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThorIntroProps {
  onComplete: () => void;
}

export const ThorIntro: React.FC<ThorIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'void' | 'beam' | 'impact' | 'aftermath'>('void');

  useEffect(() => {
    // Timeline Sequence
    // 0.0s: Void (Rumble starts via render)
    
    // 0.8s: The Bifrost Slams Down
    const timerBeam = setTimeout(() => setStage('beam'), 800);

    // 0.9s: IMPACT (Flash, Shockwave, Hard Shake)
    const timerImpact = setTimeout(() => setStage('impact'), 900);

    // 1.2s: Aftermath (Reveal content, lingering sparks)
    const timerAftermath = setTimeout(() => setStage('aftermath'), 1400);

    // 2.5s: Cleanup
    const timerEnd = setTimeout(() => {
        onComplete();
    }, 2500);

    return () => {
        clearTimeout(timerBeam);
        clearTimeout(timerImpact);
        clearTimeout(timerAftermath);
        clearTimeout(timerEnd);
    };
  }, [onComplete]);

  return (
    <motion.div 
        className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden pointer-events-none"
        animate={stage === 'aftermath' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* --- STAGE 1: THE GATHERING STORM (Rumble) --- */}
      {/* We apply the shake to a wrapper so everything shakes */}
      <motion.div
        className="absolute inset-0 w-full h-full flex items-center justify-center"
        animate={
            stage === 'void' 
            ? { x: [-2, 2, -1, 1, 0], y: [1, -1, 0] } // Low rumble
            : stage === 'impact'
            ? { x: [-20, 20, -15, 15, -5, 5, 0], y: [-10, 10, -5, 5, 0] } // VIOLENT SHAKE
            : { x: 0, y: 0 }
        }
        transition={
            stage === 'void' 
            ? { repeat: Infinity, duration: 0.1 }
            : { duration: 0.4 }
        }
      >
          {/* Atmosphere Clouds */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(41,216,255,0.15)_0%,_rgba(0,0,0,1)_60%)] animate-pulse" />

          {/* --- STAGE 2: THE BIFROST --- */}
          {/* A massive beam cutting through the center */}
          <AnimatePresence>
            {(stage === 'beam' || stage === 'impact') && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "100vh", opacity: 1 }}
                    exit={{ opacity: 0, scaleX: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="w-16 md:w-32 relative"
                    style={{
                        background: "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(41,216,255,0.6) 20%, #FFFFFF 50%, rgba(41,216,255,0.6) 80%, rgba(0,0,0,0) 100%)",
                        boxShadow: "0 0 50px 20px rgba(41, 216, 255, 0.4), inset 0 0 20px #FFFFFF"
                    }}
                >
                    {/* Rainbow Bridge Edge Detail */}
                    <div className="absolute inset-y-0 left-2 w-1 bg-purple-500/50 blur-sm" />
                    <div className="absolute inset-y-0 right-2 w-1 bg-purple-500/50 blur-sm" />
                </motion.div>
            )}
          </AnimatePresence>

          {/* --- STAGE 3: MJOLNIR IMPACT --- */}
          {stage === 'impact' || stage === 'aftermath' ? (
              <>
                {/* 1. The Blinding Flash */}
                <motion.div 
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />

                {/* 2. The Shockwave Ring */}
                <motion.div
                    className="absolute rounded-full border-[20px] md:border-[50px] border-cyan-400"
                    initial={{ width: 0, height: 0, opacity: 1 }}
                    animate={{ width: "200vw", height: "200vw", opacity: 0 }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    style={{ boxShadow: "0 0 100px rgba(41, 216, 255, 0.8), inset 0 0 50px rgba(255, 255, 255, 0.5)" }}
                />

                {/* 3. Flying Debris Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_cyan]"
                        initial={{ x: 0, y: 0, opacity: 1 }}
                        animate={{ 
                            x: (Math.random() - 0.5) * 1500, 
                            y: (Math.random() - 0.5) * 1500,
                            opacity: 0 
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                ))}
              </>
          ) : null}

          {/* --- STAGE 4: AFTERMATH (Residual Electricity) --- */}
          {/* Lingering arcs on the edges of the screen */}
          {stage === 'aftermath' && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  <filter id="glow-bolt">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                  </filter>
                  <ResidualBolt startX="5%" startY="95%" />
                  <ResidualBolt startX="95%" startY="95%" />
                  <ResidualBolt startX="5%" startY="5%" />
                  <ResidualBolt startX="95%" startY="5%" />
              </svg>
          )}

      </motion.div>
    </motion.div>
  );
};

// Helper for residual lightning
const ResidualBolt = ({ startX, startY }: { startX: string, startY: string }) => {
    // Create a random jagged path near the coordinate
    const generatePath = () => {
        // This is a simplified logic to create a localized crackle
        // We'll assume the bolt is roughly 100-200px long moving towards center
        return `M 0 0 l ${Math.random()*40-20} ${Math.random()*40-20} l ${Math.random()*40-20} ${Math.random()*40-20} l ${Math.random()*40-20} ${Math.random()*40-20}`;
    }

    return (
        <motion.path 
            d={generatePath()}
            stroke="#29D8FF"
            strokeWidth="2"
            fill="none"
            filter="url(#glow-bolt)"
            style={{ x: startX, y: startY }} // Position wrapper, path is relative
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        />
    )
}