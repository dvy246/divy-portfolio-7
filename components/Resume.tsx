import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, Paperclip, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Resume: React.FC = () => {
  const { resume } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll progress for the drawing line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="resume" className="py-24 px-4 relative bg-light-bg dark:bg-dark-bg overflow-hidden">
      {/* Technical Graph Paper Background */}
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:20px_20px] opacity-10 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10" ref={containerRef}>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
        >
            <h2 className="text-4xl md:text-5xl font-sketch font-bold text-light-accent dark:text-dark-accent mb-4 inline-block relative">
                Blueprints & History
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-light-accent/30 dark:bg-dark-accent/30 skew-x-12" />
            </h2>
            <p className="text-light-text/60 dark:text-dark-text/60 font-sans max-w-2xl mx-auto">
                A chronological timeline of my compilation process and architectural upgrades.
            </p>
            
            {/* Download Resume Button */}
            <motion.a
                href="#"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-0 top-0 hidden md:flex items-center gap-2 px-4 py-2 border-2 border-dashed border-light-accent dark:border-dark-accent text-sm font-mono font-bold text-light-accent dark:text-dark-accent bg-light-bg dark:bg-dark-bg"
                style={{ borderRadius: "5px 15px 5px 15px" }}
            >
                <Paperclip size={16} />
                RESUME.PDF
            </motion.a>
        </motion.div>

        <div className="relative">
            {/* Central Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] bg-light-text/10 dark:bg-dark-text/10 -translate-x-1/2">
                <motion.div 
                    style={{ scaleY, transformOrigin: "top" }}
                    className="w-full h-full bg-light-accent dark:bg-dark-accent shadow-[0_0_10px_rgba(41,216,255,0.5)]"
                />
            </div>

            <div className="space-y-12">
                {resume.map((item, index) => (
                    <div key={item.id} className={`flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 relative`}>
                        
                        {/* Center Node */}
                        <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-light-bg dark:border-dark-bg bg-light-accent dark:bg-dark-accent z-20 flex items-center justify-center shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>

                        {/* Spacer for the other side */}
                        <div className="hidden md:block flex-1" />

                        {/* Content Card with Unfold Animation */}
                        <motion.div 
                            className="flex-1 w-full pl-12 md:pl-0"
                            initial={{ opacity: 0, rotateX: -90, transformPerspective: 1000, transformOrigin: "top" }}
                            whileInView={{ opacity: 1, rotateX: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, type: "spring", bounce: 0.4, delay: index * 0.1 }}
                        >
                            <motion.div 
                                className="relative bg-white dark:bg-[#0a0a0a] p-6 border border-light-text/10 dark:border-dark-text/10 shadow-xl group hover:border-light-accent dark:hover:border-dark-accent transition-colors"
                                style={{ borderRadius: "2px 15px 2px 15px" }}
                            >
                                {/* Fold Crease Visual */}
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-light-text/10 dark:via-dark-text/10 to-transparent" />
                                
                                <div className="flex items-center gap-3 mb-2 text-light-accent dark:text-dark-accent font-mono text-sm">
                                    {item.type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                                    <span>{item.period}</span>
                                </div>
                                
                                <h3 className="text-xl font-bold font-sketch mb-1">{item.title}</h3>
                                <div className="text-lg font-medium text-light-text/80 dark:text-dark-text/80 mb-4 font-sans">{item.company}</div>
                                
                                <p className="text-light-text/60 dark:text-dark-text/60 mb-4 text-sm leading-relaxed">
                                    {item.description}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="text-xs px-2 py-1 bg-light-text/5 dark:bg-dark-text/5 text-light-text/60 dark:text-dark-text/60 font-mono rounded group-hover:text-light-accent dark:group-hover:text-dark-accent group-hover:bg-light-accent/10 dark:group-hover:bg-dark-accent/10 transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};
