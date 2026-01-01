import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThorIntroProps {
  onComplete: () => void;
}

export const ThorIntro: React.FC<ThorIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'void' | 'charge' | 'beam' | 'impact' | 'handover'>('void');

  useEffect(() => {
    // Phase 1: Atmosphere (0ms) - Already rendered by default state
    
    // Phase 2: The Charge (500ms) - Lightning flickers
    const t1 = setTimeout(() => setStage('charge'), 500);

    // Phase 3: The Bifrost Strike (1000ms) - Beam slams down
    const t2 = setTimeout(() => setStage('beam'), 1000);

    // Phase 4: The Impact (1050ms) - Flash & Shake (Slightly after beam starts for weight)
    const t3 = setTimeout(() => setStage('impact'), 1050);

    // Phase 5: Handover (1800ms) - Fade out
    const t4 = setTimeout(() => setStage('handover'), 1800);

    // Cleanup (2100ms)
    const t5 = setTimeout(() => onComplete(), 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  // Shake Keyframes for the camera impact
  const shakeKeyframes = {
    x: [0, -20, 20, -10, 10, -5, 5, 0],
    y: [0, 15, -15, 10, -10, 5, -5, 0]
  };

  return (
    <motion.div 
        className="fixed inset-0 z-[99999] bg-[#050505] flex items-center justify-center overflow-hidden"
        animate={stage === 'handover' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.3, ease: "linear" }}
    >
      {/* CONTAINER: Handles the violent shake */}
      <motion.div
        className="relative w-full h-full"
        animate={stage === 'impact' ? shakeKeyframes : { x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: "linear" }}
      >
          {/* --- PHASE 1: ATMOSPHERE --- */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#050505_70%)] opacity-40 animate-pulse" />
          
          {/* --- PHASE 2: CHARGE (Peripheral Lightning) --- */}
          <AnimatePresence>
            {stage === 'charge' && (
                <>
                    <LightningBolt className="top-0 left-[20%] w-48 h-96" delay={0} />
                    <LightningBolt className="top-[10%] right-[20%] w-48 h-96 scale-x-[-1]" delay={0.1} />
                    <LightningBolt className="bottom-0 left-[10%] w-64 h-64 rotate-180" delay={0.2} />
                </>
            )}
          </AnimatePresence>

          {/* --- PHASE 3: THE BIFROST (Vertical Beam) --- */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
             <AnimatePresence>
                {(stage === 'beam' || stage === 'impact') && (
                    <>
                        {/* 1. The Core Beam (Pure White) - GPU SCALED */}
                        <motion.div
                            initial={{ scaleY: 0, opacity: 1 }}
                            animate={{ scaleY: 1, opacity: 1 }}
                            exit={{ scaleY: 2, opacity: 0 }}
                            transition={{ duration: 0.15, ease: "circIn" }}
                            style={{ originY: 0 }} // Scale from top
                            className="w-[60px] h-screen bg-white shadow-[0_0_100px_rgba(255,255,255,1)] relative z-50"
                        />
                        
                        {/* 2. The Outer Glow (Cyan) - GPU SCALED */}
                        <motion.div
                            initial={{ scaleY: 0, opacity: 0.5 }}
                            animate={{ scaleY: 1, opacity: 0.8 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "circIn", delay: 0.02 }}
                            style={{ originY: 0 }}
                            className="absolute w-[200px] h-screen bg-cyan-400 blur-2xl z-40"
                        />
                    </>
                )}
             </AnimatePresence>
          </div>

          {/* --- PHASE 4: THE IMPACT --- */}
          {stage === 'impact' && (
            <>
                {/* 1. Retinal Flash (Blinding White) */}
                <motion.div 
                    className="absolute inset-0 bg-white z-[60]"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />

                {/* 2. Shockwave Ripple */}
                <div className="absolute inset-0 flex items-center justify-center z-30">
                    <motion.div
                        className="rounded-full border-[20px] border-cyan-300"
                        initial={{ width: 0, height: 0, opacity: 1 }}
                        animate={{ width: "150vmax", height: "150vmax", opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </>
          )}

      </motion.div>
    </motion.div>
  );
};

// --- SUB-COMPONENT: Optimized Lightning Bolt ---
const LightningBolt: React.FC<{ className?: string, delay: number }> = ({ className, delay }) => {
    // A jagged path for the bolt
    const d = "M50,0 L60,20 L40,40 L70,60 L30,80 L50,100";

    return (
        <svg viewBox="0 0 100 100" className={`absolute ${className} drop-shadow-[0_0_15px_#22d3ee]`}>
            <motion.path
                d={d}
                stroke="#A5F3FC"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0, 1, 0] }}
                transition={{ duration: 0.2, delay: delay }}
            />
        </svg>
    )
}