import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThorIntroProps {
  onComplete: () => void;
}

export const ThorIntro: React.FC<ThorIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'void' | 'charge' | 'beam' | 'impact' | 'aftermath'>('void');

  useEffect(() => {
    // 1. The Void (Silence before the storm)
    
    // 2. Charge Up (0.5s) - Sky lights up
    setTimeout(() => setStage('charge'), 500);

    // 3. The Bifrost Slams (1.0s)
    setTimeout(() => setStage('beam'), 1000);

    // 4. IMPACT (1.1s) - The exact moment of contact
    setTimeout(() => setStage('impact'), 1100);

    // 5. Aftermath (1.6s) - Smoke clears, energy lingers
    setTimeout(() => setStage('aftermath'), 1800);

    // 6. Release control (3.0s)
    setTimeout(() => onComplete(), 3000);

  }, [onComplete]);

  return (
    <motion.div 
        className="fixed inset-0 z-[99999] bg-[#020202] flex items-center justify-center overflow-hidden pointer-events-none"
        animate={stage === 'aftermath' ? { opacity: 0, pointerEvents: "none" } : { opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* --- LAYER 1: THE VOID / ATMOSPHERE --- */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        animate={
            stage === 'void' ? { scale: 1 } :
            stage === 'charge' ? { scale: 1.1, filter: "brightness(1.5)" } :
            stage === 'impact' ? { x: [-40, 40, -30, 30, -10, 10, 0], y: [-20, 20, -10, 10, 0] } : // VIOLENT SHAKE
            { x: 0, y: 0 }
        }
        transition={stage === 'impact' ? { duration: 0.4 } : { duration: 2 }}
      >
          {/* Pulsing Dark Cloud Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000000_80%)] opacity-80" />
          
          {/* Charge Up Flash (Sky turns blue/purple) */}
          <motion.div 
             className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 via-purple-900/20 to-transparent"
             initial={{ opacity: 0 }}
             animate={stage === 'charge' ? { opacity: 1 } : { opacity: 0 }}
             transition={{ duration: 0.3 }}
          />
      </motion.div>

      {/* --- LAYER 2: THE BIFROST (Multi-Layer Beam) --- */}
      <AnimatePresence>
        {(stage === 'beam' || stage === 'impact') && (
            <div className="absolute inset-0 flex justify-center items-center">
                {/* Outer Glow (Massive) */}
                <motion.div
                    initial={{ height: 0, width: "20px", opacity: 0 }}
                    animate={{ height: "150vh", width: "300px", opacity: 0.4 }}
                    exit={{ opacity: 0, scaleX: 2, filter: "blur(20px)" }}
                    transition={{ duration: 0.1 }}
                    className="bg-cyan-500 blur-3xl absolute"
                />
                
                {/* Middle Plasma (Blue) */}
                <motion.div
                    initial={{ height: 0, width: "10px", opacity: 0 }}
                    animate={{ height: "120vh", width: "120px", opacity: 0.8 }}
                    exit={{ opacity: 0, width: "0px" }}
                    transition={{ duration: 0.1, delay: 0.02 }}
                    className="bg-gradient-to-r from-transparent via-cyan-400 to-transparent absolute"
                    style={{ mixBlendMode: 'screen' }}
                />

                {/* Core Energy (Pure White Hot) */}
                <motion.div
                    initial={{ height: 0, width: "5px", opacity: 0 }}
                    animate={{ height: "100vh", width: "40px", opacity: 1 }}
                    exit={{ opacity: 0, width: "200px" }} // Explodes outward on exit
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-white relative z-50 shadow-[0_0_100px_white]"
                />
            </div>
        )}
      </AnimatePresence>

      {/* --- LAYER 3: THE IMPACT (Ground Zero) --- */}
      {stage === 'impact' || stage === 'aftermath' ? (
          <>
            {/* 1. NEGATIVE FLASH (Retinal Shock) */}
            <motion.div 
                className="absolute inset-0 z-[100] bg-white mix-blend-difference"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1 }} // Instant flash
            />

            {/* 2. Whiteout Flash */}
            <motion.div 
                className="absolute inset-0 z-[90] bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* 3. Primary Shockwave (Hard Ring) */}
            <motion.div
                className="absolute rounded-full border-[60px] border-cyan-200"
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ width: "250vmax", height: "250vmax", opacity: 0, borderWidth: "0px" }}
                transition={{ duration: 0.6, ease: "circOut" }}
                style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
            />

            {/* 4. Secondary Shockwave (Distortion) */}
            <motion.div
                className="absolute rounded-full border-[20px] border-white blur-md"
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{ width: "150vmax", height: "150vmax", opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                style={{ transform: "translate(-50%, -50%)", left: "50%", top: "50%" }}
            />

            {/* 5. Particle Explosion (Debris) */}
            {[...Array(20)].map((_, i) => (
                <Particle key={i} index={i} />
            ))}
          </>
      ) : null}

      {/* --- LAYER 4: AFTERMATH (Residual Energy) --- */}
      {stage === 'aftermath' && (
          <div className="absolute inset-0 z-50">
               {/* Cracks in reality */}
               <svg className="w-full h-full opacity-30 mix-blend-overlay">
                    <filter id="crack-glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <motion.path 
                        d="M 500 500 L 550 450 L 580 480 L 650 420"
                        stroke="white" strokeWidth="2" fill="none"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        className="drop-shadow-[0_0_10px_cyan]"
                    />
               </svg>
          </div>
      )}

    </motion.div>
  );
};

const Particle: React.FC<{ index: number }> = ({ index }) => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 500 + Math.random() * 1000;
    const endX = Math.cos(angle) * velocity;
    const endY = Math.sin(angle) * velocity;

    return (
        <motion.div
            className="absolute bg-white rounded-full z-40"
            initial={{ x: 0, y: 0, scale: Math.random() * 2 + 1, opacity: 1 }}
            animate={{ 
                x: endX, 
                y: endY, 
                opacity: 0,
                scale: 0 
            }}
            transition={{ duration: 0.8 + Math.random() * 0.5, ease: [0.19, 1, 0.22, 1] }}
            style={{ 
                width: Math.random() > 0.5 ? '4px' : '8px', 
                height: Math.random() > 0.5 ? '4px' : '8px',
                boxShadow: "0 0 20px cyan" 
            }}
        />
    )
}