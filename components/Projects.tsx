import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Lock, Unlock, Cpu } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ElectricOverlay } from './ElectricOverlay';
import { ThunderStrike } from './ThunderStrike';
import { Starfield } from './Starfield';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { NeuralLink } from './NeuralLink';

export const Projects: React.FC = () => {
  const { projects } = usePortfolio();
  const [revealedProjects, setRevealedProjects] = useState<number[]>([]);
  const [thunderActive, setThunderActive] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  
  // Refs for Neural Link connection points
  const cardRefs = useRef<Map<number, HTMLDivElement | null>>(new Map());

  // Handle the "Decrypt" click
  const handleDecrypt = (id: number) => {
    if (revealedProjects.includes(id)) return;

    setThunderActive(true);
    
    // Time the reveal to match the "shock" of the thunder (approx 300-500ms in)
    setTimeout(() => {
        setRevealedProjects(prev => [...prev, id]);
    }, 400);

    // Reset thunder after animation
    setTimeout(() => {
        setThunderActive(false);
    }, 1200);
  };

  return (
    <section id="projects" className="py-20 px-4 relative min-h-screen bg-black/80 backdrop-blur-sm">
      {/* Full Screen Shock Effect for Projects */}
      <ThunderStrike isActive={thunderActive} onComplete={() => {}} />

      {/* NEURAL LINK OVERLAY */}
      <NeuralLink activeId={hoveredProject} cardRefs={cardRefs} />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-sketch font-bold text-light-accent dark:text-dark-accent mb-4">
                Mission Archives
            </h2>
            <p className="text-light-text/60 dark:text-dark-text/60 font-mono text-sm uppercase tracking-widest">
                // Decrypt files to view operational data
            </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => {
            const isRevealed = revealedProjects.includes(project.id);
            const isHovered = hoveredProject === project.id;

            return (
              <div 
                  key={project.id} 
                  ref={(el) => { cardRefs.current.set(project.id, el) }}
                  className="min-h-[450px]"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
              >
                <CardContainer className="inter-var w-full h-full" containerClassName="w-full h-full">
                    {!isRevealed ? (
                        // --- LOCKED STATE (3D) ---
                        <CardBody className="bg-[#050505]/95 relative group/card border-2 border-dashed border-dark-accent/30 w-full h-full rounded-xl p-8 flex flex-col items-center justify-center overflow-hidden hover:border-dark-accent hover:shadow-[0_0_30px_rgba(41,216,255,0.1)] transition-all duration-300">
                             {/* Sketchy Corners */}
                             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-dark-accent" />
                             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-dark-accent" />
                             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-dark-accent" />
                             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-dark-accent" />

                             <div className="absolute inset-0 bg-grid-dark opacity-20" />
                             
                             {/* Hover Electric Effect - OPTIMIZED */}
                             {isHovered && <ElectricOverlay className="opacity-50" />}

                             <div onClick={() => handleDecrypt(project.id)} className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                <CardItem translateZ="50" className="mb-6 relative">
                                    <div className={`p-8 rounded-full border border-dark-accent/30 bg-dark-accent/5 transition-all duration-300 ${isHovered ? 'bg-dark-accent/20 shadow-[0_0_20px_rgba(41,216,255,0.5)]' : ''}`}>
                                        {isHovered ? (
                                            <Unlock size={64} className="text-dark-accent" />
                                        ) : (
                                            <Lock size={64} className="text-gray-600" />
                                        )}
                                    </div>
                                </CardItem>

                                <CardItem translateZ="60" className="text-2xl font-mono font-bold text-white mb-2 text-center">
                                    {isHovered ? "READY TO DECRYPT" : "FILE ENCRYPTED"}
                                </CardItem>
                                
                                <CardItem translateZ="40" className="text-dark-accent font-mono text-xs uppercase tracking-widest text-center">
                                    {isHovered ? ">>> INITIATE NEURAL LINK <<<" : `SECURE_ID: ${project.id}X-AF`}
                                </CardItem>

                                {isHovered && (
                                    <CardItem translateZ="30" className="mt-8 px-4 py-2 border border-dark-accent text-dark-accent text-xs font-sketch animate-pulse">
                                        CLICK TO ACCESS
                                    </CardItem>
                                )}
                             </div>
                        </CardBody>
                    ) : (
                        // --- REVEALED STATE (3D) ---
                        <CardBody className="bg-[#080808]/95 relative group/card border border-dark-accent/50 w-full h-full rounded-xl overflow-hidden flex flex-col">
                             {/* Space Background Layer */}
                             <div className="absolute inset-0 z-0">
                                 <Starfield />
                             </div>
                             
                             {/* Header Image with 3D Pop */}
                             <CardItem translateZ="50" className="w-full h-48 relative border-b border-dark-accent/30 group-hover/card:h-56 transition-all duration-500 overflow-hidden">
                                <img 
                                    src={project.image} 
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-dark-accent/10 mix-blend-overlay" />
                                
                                {/* Sci-Fi UI Overlay on Image */}
                                <div className="absolute top-2 left-2 flex gap-1 bg-black/50 p-1 rounded backdrop-blur-sm">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75" />
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                                </div>
                             </CardItem>

                             {/* Content Area */}
                             <div className="p-6 relative z-10 flex flex-col flex-grow bg-black/40 backdrop-blur-[2px]">
                                <div className="flex justify-between items-start mb-4">
                                    <CardItem translateZ="60" className="text-2xl font-sketch font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                        {project.title}
                                    </CardItem>
                                    <CardItem translateZ="40">
                                        <Cpu size={20} className="text-dark-accent" />
                                    </CardItem>
                                </div>

                                <CardItem translateZ="30" className="text-gray-300 text-sm mb-6 font-sans leading-relaxed flex-grow">
                                    {project.description}
                                </CardItem>

                                <CardItem translateZ="20" className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-[10px] font-mono px-2 py-1 border border-dark-accent/40 bg-dark-accent/10 rounded text-dark-accent">
                                            {tag}
                                        </span>
                                    ))}
                                </CardItem>

                                <div className="flex gap-4 mt-auto">
                                    <CardItem 
                                        translateZ="40"
                                        as="a"
                                        href={project.liveLink}
                                        className="flex-1 py-2 flex items-center justify-center gap-2 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-dark-accent transition-colors rounded-sm"
                                    >
                                        <ExternalLink size={16} /> Launch
                                    </CardItem>
                                    <CardItem 
                                        translateZ="40"
                                        as="a"
                                        href={project.githubLink}
                                        className="flex-1 py-2 flex items-center justify-center gap-2 border border-white/30 text-white font-bold text-sm uppercase tracking-wider hover:border-dark-accent hover:text-dark-accent transition-colors bg-black/50 rounded-sm"
                                    >
                                        <Github size={16} /> Source
                                    </CardItem>
                                </div>
                             </div>
                        </CardBody>
                    )}
                </CardContainer>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};