import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { CircularStorm } from './CircularStorm';
import { ThunderStrike } from './ThunderStrike';

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const letters = Array.from(text);

  return (
    <motion.span
      className="inline-block font-sans font-extrabold tracking-tight"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.03, delayChildren: delay } },
        hidden: {},
      }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 20 },
          }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const Hero: React.FC = () => {
  const { personalInfo } = usePortfolio();
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [showThunder, setShowThunder] = useState(false);
  const [pendingLink, setPendingLink] = useState<string | null>(null);

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

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-24 px-4 overflow-hidden selection:bg-cyan-500/30">
        {/* Full Screen Shock Effect */}
        <ThunderStrike isActive={showThunder} onComplete={onThunderComplete} />

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:40px_40px] opacity-10 pointer-events-none" />
        
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050505_90%)] pointer-events-none" />

      <div className="max-w-5xl w-full flex flex-col items-center gap-12 relative z-10">
        
        {/* AVATAR: ARC REACTOR STYLE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
              opacity: 1, 
              scale: isHoveringAvatar ? 1.02 : 1,
          }}
          className="relative group w-64 h-64 flex-shrink-0 cursor-pointer"
          onHoverStart={() => setIsHoveringAvatar(true)}
          onHoverEnd={() => setIsHoveringAvatar(false)}
        >
          {/* Circular Storm Overlay */}
          <CircularStorm isHovering={isHoveringAvatar} />

          {/* Core Breathing Glow */}
          <motion.div 
            animate={{ 
                opacity: isHoveringAvatar ? 1 : 0.6,
                scale: isHoveringAvatar ? 1.2 : 1
            }} 
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0 bg-cyan-500/30 blur-[60px] rounded-full z-0" 
          />
          
          {/* Rotating Conic Gradient Ring */}
          <motion.div
            className="absolute -inset-[3px] rounded-full z-10"
            style={{
                background: "conic-gradient(from 0deg, transparent 0%, #00FFFF 50%, transparent 100%)"
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner masking ring to make the conic gradient a border */}
          <div className="absolute inset-[2px] bg-[#050505] rounded-full z-10" />

          {/* The Image Itself */}
          <div className={`absolute inset-[6px] rounded-full overflow-hidden relative z-20 shadow-2xl`}>
            <img 
                src={personalInfo.avatarUrl} 
                alt="Avatar" 
                className={`w-full h-full object-cover transition-all duration-500 ${isHoveringAvatar ? 'grayscale-0 scale-110' : 'filter grayscale scale-100'}`}
            />
            {/* Tech Scan Line Overlay */}
            <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent z-30"
                animate={{ top: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
          </div>
        </motion.div>

        {/* Text Section */}
        <div className="flex flex-col items-center text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl mb-6 text-white leading-[1.1]">
            <TypewriterText text={personalInfo.headline} delay={0.5} />
          </h1>
          
          <div className="text-xl md:text-2xl text-gray-400 leading-relaxed font-normal tracking-wide max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
            >
              {personalInfo.subHeadline}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="mt-12 flex gap-6 justify-center"
          >
             <a 
                href="#projects" 
                onClick={(e) => handleShockNavigation(e, '#projects')}
                className="group relative px-8 py-3 bg-white text-black font-sans font-bold text-sm tracking-widest uppercase overflow-hidden"
             >
                <span className="relative z-10">View Work</span>
                <div className="absolute inset-0 bg-cyan-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
             </a>
             <a 
                href="#contact" 
                onClick={(e) => handleShockNavigation(e, '#contact')}
                className="group px-8 py-3 border border-white/20 hover:border-white text-white font-sans font-bold text-sm tracking-widest uppercase transition-colors"
             >
                Let's Talk
             </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
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