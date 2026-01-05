import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, ChevronRight, Terminal, Layers } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ElectricOverlay } from './ElectricOverlay';
import { ThunderStrike } from './ThunderStrike';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';

export const Skills: React.FC = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<typeof skills[0] | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [thunderActive, setThunderActive] = useState(false);

  const handleCardClick = (category: typeof skills[0]) => {
      // 1. Trigger Thunder
      setThunderActive(true);

      // 2. Open Modal after shock delay
      setTimeout(() => {
          setSelectedCategory(category);
      }, 500);

      // 3. Reset Thunder
      setTimeout(() => {
          setThunderActive(false);
      }, 1200);
  };

  return (
    <section id="skills" className="py-24 px-4 bg-light-bg/80 dark:bg-dark-bg/80 relative overflow-hidden backdrop-blur-sm">
        {/* Thunder Effect */}
        <ThunderStrike isActive={thunderActive} onComplete={() => {}} />

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 border-l border-b border-light-text/5 dark:border-dark-text/5 rounded-bl-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 border-r border-t border-light-text/5 dark:border-dark-text/5 rounded-tr-[50px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-sketch font-bold text-light-accent dark:text-dark-accent mb-4">
                The AI Toolbox
            </h2>
            <p className="text-light-text/60 dark:text-dark-text/60 font-sans max-w-2xl mx-auto">
                Click on a domain to inspect the blueprints and schematic details of my technical stack.
            </p>
        </motion.div>

        {/* Main Grid with 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category, index) => (
            <div 
                key={category.id} 
                className="h-[300px]" 
                onClick={() => handleCardClick(category)}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
            >
                <CardContainer className="inter-var w-full h-full" containerClassName="w-full h-full">
                    <CardBody 
                        className="bg-white/5 dark:bg-[#0a0a0a]/90 relative group/card border-2 border-dashed border-light-text/10 dark:border-dark-text/20 w-full h-full rounded-xl p-8 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-light-accent dark:hover:border-dark-accent dark:hover:shadow-[0_0_20px_rgba(41,216,255,0.15)] transition-colors"
                    >
                        {/* PERFORMANCE OPTIMIZATION: Only render ElectricOverlay when hovered */}
                        {hoveredCard === category.id && (
                            <div className="absolute inset-0 opacity-100 transition-opacity z-0 pointer-events-none">
                                <ElectricOverlay />
                            </div>
                        )}
                        
                        {/* Technical Corners */}
                        <div className="absolute top-2 left-2 w-2 h-2 border border-light-text/20 dark:border-dark-text/20 rounded-full" />
                        <div className="absolute top-2 right-2 w-2 h-2 border border-light-text/20 dark:border-dark-text/20 rounded-full" />
                        <div className="absolute bottom-2 left-2 w-2 h-2 border border-light-text/20 dark:border-dark-text/20 rounded-full" />
                        <div className="absolute bottom-2 right-2 w-2 h-2 border border-light-text/20 dark:border-dark-text/20 rounded-full" />

                        {/* Top Section */}
                        <div className="flex items-start justify-between relative z-10">
                            <CardItem translateZ="60">
                                <div className="p-3 bg-light-accent/10 dark:bg-dark-accent/10 rounded-lg group-hover/card:bg-light-accent group-hover/card:text-white dark:group-hover/card:bg-dark-accent dark:group-hover/card:text-black transition-colors duration-300">
                                    <category.icon size={32} strokeWidth={1.5} />
                                </div>
                            </CardItem>
                            <CardItem translateZ="30">
                                <ChevronRight className="text-light-text/20 dark:text-dark-text/20 group-hover/card:text-light-accent dark:group-hover/card:text-dark-accent transition-colors" />
                            </CardItem>
                        </div>

                        {/* Middle Section */}
                        <div className="relative z-10 mt-4">
                            <CardItem translateZ="50" className="text-2xl font-sketch font-bold mb-2 text-light-text dark:text-dark-text">
                                {category.name}
                            </CardItem>
                            <CardItem translateZ="40" className="text-sm font-sans text-light-text/60 dark:text-dark-text/60 leading-relaxed">
                                {category.description}
                            </CardItem>
                        </div>

                        {/* Bottom Section */}
                        <div className="mt-4 pt-4 border-t border-dashed border-light-text/10 dark:border-dark-text/10 flex items-center gap-2 relative z-10">
                            <CardItem translateZ="30" className="flex items-center gap-2 text-xs font-mono text-light-text/40 dark:text-dark-text/40">
                                <Cpu size={12} />
                                <span>{category.techStack.length} MODULES INSTALLED</span>
                            </CardItem>
                        </div>
                    </CardBody>
                </CardContainer>
            </div>
          ))}
        </div>

        {/* Detailed Modal Overlay - OPTIMIZED */}
        <AnimatePresence>
          {selectedCategory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                {/* Backdrop - High quality blur and dark tint */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedCategory(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                />

                {/* Modal Container - "Cyberdeck" style */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="relative w-full max-w-4xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[85vh] rounded-2xl ring-1 ring-white/5"
                >
                    {/* Grid Background Inside Modal */}
                    <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:30px_30px] opacity-5 pointer-events-none" />

                    {/* High-Tech Header */}
                    <div className="relative p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-dark-accent/20 rounded-md border border-dark-accent/30 text-dark-accent">
                                <Terminal size={20} />
                            </div>
                            <div>
                                <h3 className="text-xl font-mono font-bold text-white tracking-tight uppercase">
                                    SYS_MODULE: {selectedCategory.name}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-mono tracking-widest">
                                    ID: {selectedCategory.id.toUpperCase()}_REV.01
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="relative p-8 overflow-y-auto custom-scrollbar">
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                             <div className="flex-shrink-0">
                                 <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-dark-accent/20 to-transparent border border-dark-accent/30 flex items-center justify-center">
                                     <selectedCategory.icon size={48} className="text-dark-accent" strokeWidth={1} />
                                 </div>
                             </div>
                             <div>
                                 <h4 className="text-sm text-dark-accent font-bold font-mono mb-2 uppercase flex items-center gap-2">
                                     <Layers size={14} /> Description
                                 </h4>
                                 <p className="text-gray-300 leading-relaxed font-sans text-lg">
                                     {selectedCategory.description}
                                 </p>
                             </div>
                        </div>

                        <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                            <span className="w-4 h-[1px] bg-dark-accent" />
                            INSTALLED PACKAGES
                            <span className="flex-1 h-[1px] bg-white/10" />
                        </h4>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {selectedCategory.techStack.map((tech, i) => (
                                <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative p-3 border border-white/10 hover:border-dark-accent/50 bg-black/40 hover:bg-dark-accent/5 rounded transition-all cursor-default"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-sm text-gray-300 group-hover:text-white truncate">
                                            {tech}
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-dark-accent transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                         {/* Footer Decoration */}
                         <div className="mt-12 flex justify-between text-[10px] font-mono text-gray-600">
                            <span>MEMORY_USAGE: OPTIMIZED</span>
                            <span>STATUS: OPERATIONAL</span>
                         </div>
                    </div>
                </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};