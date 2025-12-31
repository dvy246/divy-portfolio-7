import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

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

  return (
    <section className="min-h-screen flex flex-col justify-center items-center relative pt-24 px-4 overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:40px_40px] opacity-10 pointer-events-none" />

      {/* Main Vertical Stack Container */}
      <div className="max-w-4xl w-full flex flex-col items-center gap-10 relative z-10">
        
        {/* Avatar Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="relative group w-64 h-64 flex-shrink-0"
        >
          {/* Subtle Blue Glow Behind Avatar */}
          <div className="absolute inset-0 bg-light-accent/20 dark:bg-dark-accent/20 blur-[50px] rounded-full z-0 transform scale-110" />

          {/* Rotating sketch rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-light-accent/40 dark:border-dark-accent/40 rounded-full z-10"
            style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-2 border border-light-accent/60 dark:border-dark-accent/60 rounded-full z-10"
            style={{ borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" }}
          />
          
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-light-bg dark:border-dark-bg relative z-20 shadow-2xl">
            <img 
                src={personalInfo.avatarUrl} 
                alt="Avatar" 
                className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" 
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
             <a href="#projects" className="px-8 py-3 bg-light-accent dark:bg-dark-accent text-white dark:text-black font-sketch font-bold text-lg rounded-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                View Work
             </a>
             <a href="#contact" className="px-8 py-3 border-2 border-light-text dark:border-dark-text font-sketch font-bold text-lg rounded-sm hover:bg-light-text hover:text-white dark:hover:bg-dark-text dark:hover:text-black transition-all">
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