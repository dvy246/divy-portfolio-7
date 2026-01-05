import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { CircularStorm } from './CircularStorm';
import { ThunderStrike } from './ThunderStrike';

// --- Sub-Component: Decryption Text Effect ---
const DecryptionText: React.FC<{ text: string; start: boolean }> = ({ text, start }) => {
    const [displayText, setDisplayText] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

    useEffect(() => {
        if (!start) return;

        let iteration = 0;
        let interval: any = null;

        interval = setInterval(() => {
            setDisplayText(prev => 
                text.split("").map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }
            
            iteration += 1 / 3; // Speed of decoding
        }, 30);

        return () => clearInterval(interval);
    }, [start, text]);

    // Initial placeholder before animation starts
    if (!start) return <span className="opacity-0">{text}</span>;

    return <span>{displayText}</span>;
}

// --- Sub-Component: Sketch Marker Underline (Yellow + Cyan) ---
const SketchUnderline = () => (
    <svg className="absolute -bottom-6 left-0 w-full h-12 pointer-events-none overflow-visible z-[-1]" viewBox="0 0 300 30" preserveAspectRatio="none">
        {/* Yellow Marker Line (Reference Style) */}
        <motion.path 
            d="M5,15 Q75,5 145,18 T295,10"
            fill="none"
            stroke="#FFE81F" // Bright Yellow
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "circOut" }}
        />
        {/* Sci-Fi Cyan Accent Line */}
        <motion.path 
            d="M10,25 Q80,18 150,28 T280,22"
            fill="none"
            stroke="#29D8FF" // Sci-Fi Cyan
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "circOut" }}
            style={{ filter: "blur(1px)" }}
        />
    </svg>
);

// --- Main Hero Component ---
export const Hero: React.FC<{ startAnimation?: boolean }> = ({ startAnimation = false }) => {
  const { personalInfo } = usePortfolio();
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [showThunder, setShowThunder] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

  // If startAnimation is not passed (direct navigation), default to true after mount
  const [internalStart, setInternalStart] = useState(false);
  useEffect(() => {
      if (startAnimation) {
          const t = setTimeout(() => setInternalStart(true), 200);
          return () => clearTimeout(t);
      } else {
          // If no intro controls us, just start immediately
          setInternalStart(true);
      }
  }, [startAnimation]);

  const handleShockNavigation = (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      setShowThunder(true);
      setPendingLink(href);
  };

  const onThunderComplete = () => {
      setShowThunder(false);
      if (pendingLink) {
          window.location.href = pendingLink;
          setPendingLink(null);
      }
  };

  // Hologram Glitch Keyframes
  const glitchVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          skewX: [0, 2, -2, 0], 
          scale: [0.95, 1],
          transition: { duration: 0.8, ease: "circOut" }
      },
      hover: {
          scale: 1.05
      }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-24 px-4 overflow-hidden selection:bg-cyan-500/30">
        <ThunderStrike isActive={showThunder} onComplete={onThunderComplete} />

        {/* --- Background Atmosphere (Sci-Fi Blue Mixture) --- */}
        {/* Base Layer: Deep Void */}
        <div className="absolute inset-0 bg-[#020617]" />
        
        {/* Layer 1: Deep Blue Gradient Mesh */}
        <div className="absolute top-0 left-0 w-full h-[120%] bg-gradient-to-br from-blue-950/50 via-[#0a0a0a] to-transparent pointer-events-none" />
        
        {/* Layer 2: Cyber Cyan Glows (Mixture) */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-800/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-indigo-900/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Layer 3: Technical Grid */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:50px_50px] opacity-[0.07] pointer-events-none" />
        
        {/* Layer 4: Vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)] pointer-events-none" />

      <div className="max-w-5xl w-full flex flex-col items-center gap-12 relative z-10">
        
        <div className="flex flex-col items-center relative z-10">
            
            {/* AVATAR CONTAINER */}
            <motion.div
                variants={glitchVariants}
                initial="hidden"
                animate={internalStart ? "visible" : "hidden"}
                className="relative group w-64 h-64 flex-shrink-0 cursor-pointer mb-12"
                onHoverStart={() => setIsHoveringAvatar(true)}
                onHoverEnd={() => setIsHoveringAvatar(false)}
            >
                {/* LAYER 0: The Storm/Lightning Layer (Behind) */}
                <CircularStorm isHovering={isHoveringAvatar} />

                {/* LAYER 0: The Back Glow */}
                <motion.div 
                    animate={{ opacity: isHoveringAvatar ? 0.8 : 0.4 }} 
                    className="absolute inset-0 bg-cyan-500/20 blur-[50px] rounded-full z-0" 
                />
                
                {/* LAYER 1: The Rotating Gradient Ring (Outer Border) */}
                <motion.div
                    className="absolute -inset-[3px] rounded-full z-10 pointer-events-none"
                    style={{ background: "conic-gradient(from 0deg, transparent 0%, #00FFFF 50%, transparent 100%)" }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                {/* LAYER 2: The Image Container */}
                <div className="absolute inset-1 rounded-full overflow-hidden z-20 bg-[#050505] border-2 border-white/5">
                    <img 
                        src={personalInfo.avatarUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover object-top opacity-100"
                        style={{ filter: 'none' }} 
                    />
                </div>
            </motion.div>

            {/* TEXT: SYSTEM BOOT-UP */}
            <div className="flex flex-col items-center text-center max-w-4xl">
                
                {/* --- SKETCH STYLE HEADLINE --- */}
                <div className="relative mb-8 p-2 inline-block">
                    <h1 className="text-7xl md:text-9xl text-white leading-[1.1] font-sketch font-extrabold tracking-tighter relative z-20 transform -rotate-2"
                        style={{ 
                            textShadow: "5px 5px 0px #000, -2px -2px 0px rgba(0,0,0,0.5)",
                            filter: "drop-shadow(0px 0px 20px rgba(41,216,255,0.15))" // Subtle Blue Glow behind text
                        }}
                    >
                        <DecryptionText text={personalInfo.headline} start={internalStart} />
                    </h1>
                    
                    {/* The Marker Underline */}
                    {internalStart && <SketchUnderline />}
                </div>
                
                <div className="text-xl md:text-2xl text-gray-300 leading-relaxed font-sans font-medium tracking-wide max-w-2xl min-h-[3rem] drop-shadow-lg">
                {internalStart && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                    >
                        {personalInfo.subHeadline}
                    </motion.p>
                )}
                </div>
                
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={internalStart ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="mt-12 flex gap-6 justify-center"
                >
                    <a href="#projects" onClick={(e) => handleShockNavigation(e, '#projects')} className="group relative px-8 py-4 bg-white text-black font-sketch font-bold text-lg tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform shadow-[4px_4px_0px_0px_rgba(41,216,255,1)] hover:shadow-[2px_2px_0px_0px_rgba(41,216,255,1)]">
                    <span className="relative z-10">View Work</span>
                    <div className="absolute inset-0 bg-cyan-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    </a>
                    <a href="#contact" onClick={(e) => handleShockNavigation(e, '#contact')} className="group px-8 py-4 border-2 border-white/20 hover:border-white text-white font-sketch font-bold text-lg tracking-widest uppercase transition-all hover:scale-105 backdrop-blur-sm">
                    Let's Talk
                    </a>
                </motion.div>
            </div>
        </div>

      </div>

      {/* --- BOTTOM TAGLINE (Learn -> Build -> Repeat) --- */}
      {/* Positioned bottom-left to match reference screenshot */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={internalStart ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-8 left-6 md:bottom-12 md:left-12 z-20 pointer-events-none hidden md:block"
      >
        <h2 className="text-4xl md:text-5xl font-sketch font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Learn <span className="text-white/40 text-3xl align-middle mx-1">→</span> Build <span className="text-white/40 text-3xl align-middle mx-1">→</span> Repeat
        </h2>
      </motion.div>

      {/* Mobile Center Version */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={internalStart ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-6 md:hidden z-20 pointer-events-none w-full text-center px-4"
      >
        <h2 className="text-2xl font-sketch font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400">
            Learn → Build → Repeat
        </h2>
      </motion.div>

    </section>
  );
};