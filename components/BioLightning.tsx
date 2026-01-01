import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BioLightningProps {
  onClose: () => void;
}

export const BioLightning: React.FC<BioLightningProps> = ({ onClose }) => {
  const [stage, setStage] = useState<'void' | 'strike' | 'reveal'>('void');

  useEffect(() => {
    // TIMELINE ORCHESTRATION
    // 1. Strike Animation starts at 200ms
    const t1 = setTimeout(() => setStage('strike'), 200);
    
    // 2. Data Reveal starts at 700ms (after the flash settles)
    const t2 = setTimeout(() => setStage('reveal'), 700);

    // CLEANUP: Prevent memory leaks if user closes early
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Lightning Path Data (Jagged Bolt)
  const lightningPath = "M 50 -10 L 48 20 L 55 25 L 42 50 L 58 55 L 45 85 L 55 110";

  return (
    <motion.div
        className="fixed inset-0 z-[9999] bg-[#020617] flex items-center justify-center cursor-pointer overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
    >
        {/* --- LAYER 1: ATMOSPHERE --- */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Pulsing Storm Center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e3a8a_0%,_#020617_70%)] opacity-40 animate-pulse" />
            {/* Noise Texture for realism */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>

        {/* --- LAYER 2: THE LIGHTNING STRIKE --- */}
        <AnimatePresence>
            {stage !== 'void' && (
                <div className="absolute inset-0 pointer-events-none z-10">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                         {/* Core Bolt */}
                         <motion.path
                            d={lightningPath}
                            stroke="#22d3ee"
                            strokeWidth="0.5"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0, 0.5, 0] }} // Flicker
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            style={{ filter: "drop-shadow(0 0 8px #22d3ee)" }}
                         />
                         {/* Glow Bolt (Thicker, Blurred) */}
                         <motion.path
                            d={lightningPath}
                            stroke="#06b6d4"
                            strokeWidth="2"
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            style={{ filter: "blur(4px)" }}
                         />
                    </svg>
                </div>
            )}
        </AnimatePresence>

        {/* --- LAYER 3: SCREEN FLASH --- */}
        {stage === 'strike' && (
             <motion.div
                className="absolute inset-0 bg-white z-20 mix-blend-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                transition={{ duration: 0.2 }}
             />
        )}

        {/* --- LAYER 4: THE REVEAL (Glass Card) --- */}
        <AnimatePresence>
            {stage === 'reveal' && (
                <motion.div
                    className="relative z-30 max-w-lg w-full mx-4 p-8 md:p-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_60px_rgba(34,211,238,0.15)] text-center transform-gpu"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    onClick={(e) => e.stopPropagation()} // Click backdrop to close, but card click is safe (optional, mostly user prefers clicking anywhere)
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <motion.h2 
                        className="text-4xl md:text-5xl font-sketch font-bold text-white mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        THE ARCHITECT
                    </motion.h2>

                    <div className="space-y-6 text-left md:text-center">
                         <InfoRow label="Origin" text="B.Com Hons Undergrad" delay={0.2} />
                         <Separator delay={0.25} />
                         <InfoRow label="Superpower" text="Strategic Business Acumen" delay={0.3} />
                         <Separator delay={0.35} />
                         <InfoRow label="Mission" text="Solving complex AI & ML problems" delay={0.4} />
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-10 pt-6 border-t border-white/5 text-white/30 text-xs font-mono uppercase tracking-widest animate-pulse"
                    >
                        [ Click anywhere to dismiss ]
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};

// --- Sub-Components for Cleanliness ---

const InfoRow = ({ label, text, delay }: { label: string, text: string, delay: number }) => (
    <motion.div 
        className="space-y-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.5 }}
    >
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest">{label}</p>
        <p className="text-xl md:text-2xl text-white font-sans font-medium tracking-tight">{text}</p>
    </motion.div>
);

const Separator = ({ delay }: { delay: number }) => (
    <motion.div 
        className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay, duration: 0.5 }}
    />
);
