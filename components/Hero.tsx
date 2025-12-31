import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { CircularStorm } from './CircularStorm';
import { ThunderStrike } from './ThunderStrike';

const TypewriterText: React.FC<{ text: string; delay?: number }> = ({ text, delay = 0 }) => {
  const letters = Array.from(text);

  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
        hidden: {},
      }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 10 },
          }}
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
      // 1. Trigger the Thunder
      setShowThunder(true);
      
      // 2. Set the link to navigate to after the shock
      setPendingLink(href);
  };

  const onThunderComplete = () => {
      setShowThunder(false);
      // 3. Navigate after visual effect finishes
      if (pendingLink) {
          window.location.href = pendingLink;
          setPendingLink(null);
      }
  };

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-24 px-4 overflow-hidden">
        {/* Full Screen Shock Effect */}
        <ThunderStrike isActive={showThunder} onComplete={onThunderComplete} />

        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:40px_40px] opacity-10 pointer-events-none" />

      {/* Main Vertical Stack Container */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-10 relative z-10">
        
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ 
              opacity: 1, 
              scale: isHoveringAvatar ? 1.05 : 1, // Slight scale up on hover
              rotate: 0,
              // Subtle vibration when storm is active
              x: isHoveringAvatar ? [0, -1, 1, -1, 1, 0] : 0,
              y: isHoveringAvatar ? [0, -1, 1, -1, 1, 0] : 0
          }}
          transition={{ 
              duration: isHoveringAvatar ? 0.2 : 1, 
              type: isHoveringAvatar ? "tween" : "spring",
              repeat: isHoveringAvatar ? Infinity : 0
          }}
          className="relative group w-64 h-64 flex-shrink-0 cursor-pointer"
          onHoverStart={() => setIsHoveringAvatar(true)}
          onHoverEnd={() => setIsHoveringAvatar(false)}
        >
          {/* Circular Storm Overlay */}
          <CircularStorm isHovering={isHoveringAvatar} />

          {/* Subtle Blue Glow Behind Avatar (Base State) */}
          <motion.div 
            animate={{ opacity: isHoveringAvatar ? 0 : 1 }} 
            className="absolute inset-0 bg-light-accent/20 dark:bg-dark-accent/20 blur-[50px] rounded-full z-0 transform scale-110" 
          />
          
          {/* Intense Dark Blue Glow (Hover State) */}
          <motion.div 
            animate={{ opacity: isHoveringAvatar ? 1 : 0, scale: isHoveringAvatar ? 1.2 : 1 }} 
            className="absolute inset-0 bg-blue-900/60 blur-[60px] rounded-full z-0 transition-all duration-300" 
          />

          {/* Rotating sketch rings - Hide when storm is active to reduce clutter */}
          <motion.div
            animate={{ rotate: 360, opacity: isHoveringAvatar ? 0 : 1 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-light-accent/40 dark:border-dark-accent/40 rounded-full z-10"
            style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          />
          <motion.div
            animate={{ rotate: -360, opacity: isHoveringAvatar ? 0 : 1 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border border-light-accent/60 dark:border-dark-accent/60 rounded-full z-10"
            style={{ borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" }}
          />
          
          <div className={`w-full h-full rounded-full overflow-hidden border-4 ${isHoveringAvatar ? 'border-cyan-400' : 'border-light-bg dark:border-dark-bg'} relative z-20 shadow-2xl transition-colors duration-300`}>
            <img 
                src={personalInfo.avatarUrl} 
                alt="Avatar" 
                className={`w-full h-full object-cover transition-all duration-500 ${isHoveringAvatar ? 'grayscale-0 contrast-125' : 'filter grayscale'}`}
            />
          </div>
        </motion.div>

        {/* Text Section */}
        <div className="flex flex-col items-center text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-sketch font-bold mb-6 text-light-text dark:text-dark-text">
            <TypewriterText text={personalInfo.headline} delay={0.5} />
          </h1>
          
          <div className="text-lg md:text-xl font-sans text-light-text/80 dark:text-dark-text/80 leading-relaxed font-medium">
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
            className="mt-10 flex gap-6 justify-center"
          >
             <a 
                href="#projects" 
                onClick={(e) => handleShockNavigation(e, '#projects')}
                className="px-8 py-3 bg-light-accent dark:bg-dark-accent text-white dark:text-black font-sketch font-bold text-lg rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
             >
                View Work
             </a>
             <a 
                href="#contact" 
                onClick={(e) => handleShockNavigation(e, '#contact')}
                className="px-8 py-3 border-2 border-light-text dark:border-dark-text font-sketch font-bold text-lg rounded-sm hover:bg-light-text hover:text-white dark:hover:bg-dark-text dark:hover:text-black transition-all"
             >
                Let's Talk
             </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-light-text/30 dark:border-dark-text/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-light-accent dark:bg-dark-accent rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};