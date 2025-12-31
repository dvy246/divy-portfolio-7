import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Lock, Unlock, Cpu, Disc } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ElectricOverlay } from './ElectricOverlay';
import { ThunderStrike } from './ThunderStrike';
import { Starfield } from './Starfield';

export const Projects: React.FC = () => {
  const { projects } = usePortfolio();
  const [revealedProjects, setRevealedProjects] = useState<number[]>([]);
  const [thunderActive, setThunderActive] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

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
    <section id="projects" className="py-20 px-4 relative min-h-screen bg-black/95">
      {/* Full Screen Shock Effect for Projects */}
      <ThunderStrike isActive={thunderActive} onComplete={() => {}} />

      <div className="max-w-6xl mx-auto">
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
                <motion.div
                    key={project.id}
                    onHoverStart={() => setHoveredProject(project.id)}
                    onHoverEnd={() => setHoveredProject(null)}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group min-h-[400px]"
                >
                    <AnimatePresence mode='wait'>
                        {!isRevealed ? (
                            // --- LOCKED STATE ---
                            <motion.div
                                key="locked"
                                exit={{ opacity: 0, scale: 1.1, filter: "brightness(2)" }}
                                onClick={() => handleDecrypt(project.id)}
                                className="absolute inset-0 bg-[#0a0a0a] border-2 border-dashed border-dark-accent/20 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-8 text-center"
                                style={{
                                    borderRadius: "2px 20px 2px 20px",
                                    boxShadow: isHovered ? "0 0 30px rgba(41, 216, 255, 0.15)" : "none"
                                }}
                            >
                                {/* Scanlines */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none" />
                                
                                {/* Electric Effect on Hover */}
                                {isHovered && <ElectricOverlay />}

                                {/* Animated Lock Icon */}
                                <motion.div
                                    animate={{ 
                                        scale: isHovered ? [1, 1.2, 1] : 1,
                                        rotate: isHovered ? [0, -10, 10, 0] : 0,
                                        filter: isHovered ? "drop-shadow(0 0 15px rgba(41,216,255,0.8))" : "drop-shadow(0 0 0px rgba(0,0,0,0))"
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className="mb-6 relative z-10 p-6 rounded-full border border-dark-accent/30 bg-dark-accent/5"
                                >
                                    {isHovered ? (
                                        <Unlock size={48} className="text-dark-accent" />
                                    ) : (
                                        <Lock size={48} className="text-gray-500" />
                                    )}
                                </motion.div>

                                <h3 className="text-2xl font-mono font-bold text-white mb-2 relative z-10">
                                    {isHovered ? "READY TO DECRYPT" : "FILE ENCRYPTED"}
                                </h3>
                                <p className="text-dark-accent font-mono text-xs uppercase tracking-widest relative z-10">
                                    {isHovered ? ">>> INITIATE NEURAL LINK <<<" : `SECURE_ID: ${project.id}X-AF`}
                                </p>

                                {/* Calling Text */}
                                {isHovered && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute bottom-10 text-xs font-sketch text-dark-accent animate-pulse"
                                    >
                                        CLICK TO ACCESS
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            // --- REVEALED (SPACE) STATE ---
                            <motion.div
                                key="revealed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="absolute inset-0 border border-dark-accent/50 overflow-hidden flex flex-col"
                                style={{
                                    borderRadius: "2px 20px 2px 25px"
                                }}
                            >
                                {/* Space Background */}
                                <Starfield />
                                
                                {/* Content Wrapper */}
                                <div className="relative z-10 flex flex-col h-full bg-black/20 backdrop-blur-[2px]">
                                    
                                    {/* Project Image Area */}
                                    <div className="h-48 relative overflow-hidden border-b border-dark-accent/20 group-hover:h-56 transition-all duration-500">
                                        <div className="absolute inset-0 bg-dark-accent/10 mix-blend-overlay z-10" />
                                        <img 
                                            src={project.image} 
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Sci-Fi Overlay UI on Image */}
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75" />
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-2xl font-sketch font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                                {project.title}
                                            </h3>
                                            <Cpu size={20} className="text-dark-accent" />
                                        </div>

                                        <p className="text-gray-300 text-sm mb-6 flex-grow font-sans leading-relaxed drop-shadow-md">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-mono px-2 py-1 border border-dark-accent/40 bg-dark-accent/10 rounded text-dark-accent backdrop-blur-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-4 mt-auto">
                                            <a href={project.liveLink} className="flex-1 py-2 flex items-center justify-center gap-2 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-dark-accent transition-colors clip-path-polygon">
                                                <ExternalLink size={16} /> Launch
                                            </a>
                                            <a href={project.githubLink} className="flex-1 py-2 flex items-center justify-center gap-2 border border-white/30 text-white font-bold text-sm uppercase tracking-wider hover:border-dark-accent hover:text-dark-accent transition-colors bg-black/50">
                                                <Github size={16} /> Source
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};