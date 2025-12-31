import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, ChevronRight } from 'lucide-react';
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
    <section id="skills" className="py-24 px-4 bg-light-bg dark:bg-dark-bg relative overflow-hidden">
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
            <div key={category.id} className="h-[300px]" onClick={() => handleCardClick(category)}>
                <CardContainer className="inter-var w-full h-full" containerClassName="w-full h-full">
                    <CardBody 
                        className="bg-white/5 dark:bg-[#0a0a0a] relative group/card border-2 border-dashed border-light-text/10 dark:border-dark-text/20 w-full h-full rounded-xl p-8 flex flex-col justify-between overflow-hidden cursor-pointer hover:border-light-accent dark:hover:border-dark-accent dark:hover:shadow-[0_0_20px_rgba(41,216,255,0.15)] transition-colors"
                    >
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity z-0 pointer-events-none">
                            <ElectricOverlay />
                        </div>
                        
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

        {/* Detailed Modal Overlay (Unchanged logic, just keeping it here) */}
        <AnimatePresence>
          {selectedCategory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                {/* Backdrop */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedCategory(null)}
                    className="absolute inset-0 bg-light-bg/80 dark:bg-dark-bg/90 backdrop-blur-md"
                />

                {/* Modal Container */}
                <motion.div 
                    layoutId={`card-${selectedCategory.id}`}
                    className="relative w-full max-w-4xl bg-light-bg dark:bg-[#080808] border-2 border-light-accent dark:border-dark-accent shadow-[0_0_50px_rgba(41,216,255,0.1)] overflow-hidden flex flex-col max-h-[90vh]"
                    style={{ borderRadius: "10px" }}
                >
                    {/* Grid Background Inside Modal */}
                    <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:30px_30px] opacity-10 pointer-events-none" />

                    {/* Header */}
                    <div className="relative p-8 border-b border-light-text/10 dark:border-dark-text/10 flex items-start justify-between bg-light-accent/5 dark:bg-dark-accent/5">
                        <div className="flex items-center gap-6">
                            <motion.div layoutId={`icon-${selectedCategory.id}`} className="p-4 bg-light-accent dark:bg-dark-accent rounded-xl text-white dark:text-black shadow-lg">
                                <selectedCategory.icon size={40} strokeWidth={1.5} />
                            </motion.div>
                            <div>
                                <motion.h3 layoutId={`title-${selectedCategory.id}`} className="text-3xl md:text-4xl font-sketch font-bold">
                                    {selectedCategory.name}
                                </motion.h3>
                                <motion.p layoutId={`desc-${selectedCategory.id}`} className="text-light-text/60 dark:text-dark-text/60 font-mono mt-1">
                                    // {selectedCategory.description}
                                </motion.p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setSelectedCategory(null)}
                            className="p-2 hover:bg-light-text/10 dark:hover:bg-dark-text/10 rounded-full transition-colors"
                        >
                            <X size={28} />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="relative p-8 overflow-y-auto">
                        <h4 className="text-sm font-mono uppercase tracking-widest text-light-accent dark:text-dark-accent mb-6 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-current" />
                            Stack Components
                            <span className="flex-1 h-[1px] bg-light-text/10 dark:bg-dark-text/10" />
                        </h4>

                        <motion.div 
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.05 } }
                            }}
                        >
                            {selectedCategory.techStack.map((tech) => (
                                <motion.div
                                    key={tech}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.8 },
                                        visible: { opacity: 1, scale: 1 }
                                    }}
                                    className="group relative p-4 border border-light-text/20 dark:border-dark-text/20 hover:border-light-accent dark:hover:border-dark-accent bg-white/50 dark:bg-white/5 transition-colors cursor-default"
                                >
                                    {/* Tech Node Look */}
                                    <div className="absolute top-1/2 -left-1 w-2 h-2 bg-light-text/20 dark:bg-dark-text/20 rounded-full group-hover:bg-light-accent dark:group-hover:bg-dark-accent transition-colors" />
                                    
                                    <span className="font-sans font-medium text-lg text-center block">
                                        {tech}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>

                         {/* Footer Decoration */}
                         <div className="mt-12 pt-6 border-t border-dashed border-light-text/10 dark:border-dark-text/10 flex justify-between text-[10px] font-mono opacity-40">
                            <span>SYS_ID: {selectedCategory.id.toUpperCase()}_V1.0</span>
                            <span>STATUS: ACTIVE</span>
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