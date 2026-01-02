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
          opacity: [0, 1, 0.5, 1, 0, 1],
          skewX: [0, 10, -10, 0, 5, 0],
          scale: [0.9, 1.1, 0.95, 1],
          filter: ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"],
          transition: { duration: 0.8, ease: "linear" }
      },
      hover: {
          scale: 1.05
      }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-24 px-4 overflow-hidden selection:bg-cyan-500/30">
        <ThunderStrike isActive={showThunder} onComplete={onThunderComplete} />

        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:40px_40px] opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />

      <div className="max-w-5xl w-full flex flex-col items-center gap-12 relative z-10">
        
        {/* CLEAN LAYOUT: No Box Frame, just content */}
        <div className="flex flex-col items-center relative z-10">
            
            {/* AVATAR: HOLOGRAPHIC GLITCH */}
            <motion.div
                variants={glitchVariants}
                initial="hidden"
                animate={internalStart ? "visible" : "hidden"}
                className="relative group w-64 h-64 flex-shrink-0 cursor-pointer mb-8"
                onHoverStart={() => setIsHoveringAvatar(true)}
                onHoverEnd={() => setIsHoveringAvatar(false)}
            >
                <CircularStorm isHovering={isHoveringAvatar} />

                <motion.div 
                animate={{ opacity: isHoveringAvatar ? 1 : 0.6, scale: isHoveringAvatar ? 1.2 : 1 }} 
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-cyan-500/30 blur-[60px] rounded-full z-0" 
                />
                
                <motion.div
                className="absolute -inset-[3px] rounded-full z-10"
                style={{ background: "conic-gradient(from 0deg, transparent 0%, #00FFFF 50%, transparent 100%)" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="absolute inset-[2px] bg-[#050505] rounded-full z-10" />

                <div className={`absolute inset-[6px] rounded-full overflow-hidden relative z-20 shadow-2xl bg-black`}>
                <img 
                    src={personalInfo.avatarUrl} 
                    alt="Avatar" 
                    className={`w-full h-full object-cover object-center transition-all duration-500 ${isHoveringAvatar ? 'scale-110' : 'scale-100'}`}
                />
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent z-30"
                    animate={{ top: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                />
                </div>
            </motion.div>

            {/* TEXT: SYSTEM BOOT-UP */}
            <div className="flex flex-col items-center text-center max-w-3xl">
                <h1 className="text-5xl md:text-7xl mb-6 text-white leading-[1.1] font-bold tracking-tight drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <DecryptionText text={personalInfo.headline} start={internalStart} />
                </h1>
                
                <div className="text-xl md:text-2xl text-gray-400 leading-relaxed font-normal tracking-wide max-w-2xl min-h-[3rem]">
                {internalStart && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }} // Wait for decryption to mostly finish
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
                    <a href="#projects" onClick={(e) => handleShockNavigation(e, '#projects')} className="group relative px-8 py-3 bg-white text-black font-sans font-bold text-sm tracking-widest uppercase overflow-hidden hover:scale-105 transition-transform">
                    <span className="relative z-10">View Work</span>
                    <div className="absolute inset-0 bg-cyan-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    </a>
                    <a href="#contact" onClick={(e) => handleShockNavigation(e, '#contact')} className="group px-8 py-3 border border-white/20 hover:border-white text-white font-sans font-bold text-sm tracking-widest uppercase transition-all hover:scale-105">
                    Let's Talk
                    </a>
                </motion.div>
            </div>
        </div>

      </div>

      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
      </motion.div>
    </section>
  );
};