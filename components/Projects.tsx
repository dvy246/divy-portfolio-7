import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Projects: React.FC = () => {
  const { projects } = usePortfolio();

  return (
    <section id="projects" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-sketch font-bold mb-16 text-center text-light-accent dark:text-dark-accent"
        >
            Selected Works
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white dark:bg-[#0a0a0a] border-2 border-light-text/10 dark:border-dark-text/10 overflow-hidden flex flex-col"
              style={{
                 borderRadius: "2px 20px 2px 25px / 25px 2px 20px 2px"
              }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden border-b-2 border-dashed border-light-text/10 dark:border-dark-text/10">
                <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-light-accent/10 dark:bg-dark-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-sketch font-bold">{project.title}</h3>
                </div>
                
                <p className="text-light-text/70 dark:text-dark-text/70 mb-6 flex-grow font-sans leading-relaxed">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                        <span key={tag} className="text-xs font-mono px-2 py-1 border border-light-text/20 dark:border-dark-text/20 rounded-md text-light-accent dark:text-dark-accent">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex gap-4 mt-auto">
                    <a href={project.liveLink} className="flex-1 py-2 flex items-center justify-center gap-2 border-2 border-light-text dark:border-dark-text font-bold text-sm uppercase tracking-wider hover:bg-light-text hover:text-white dark:hover:bg-dark-text dark:hover:text-black transition-colors" style={{ borderRadius: "255px 15px 225px 15px/15px 225px 15px 255px" }}>
                        <ExternalLink size={16} /> Demo
                    </a>
                    <a href={project.githubLink} className="flex-1 py-2 flex items-center justify-center gap-2 border-2 border-light-text/30 dark:border-dark-text/30 font-bold text-sm uppercase tracking-wider hover:border-light-accent dark:hover:border-dark-accent hover:text-light-accent dark:hover:text-dark-accent transition-colors" style={{ borderRadius: "15px 225px 15px 255px/255px 15px 225px 15px" }}>
                        <Github size={16} /> Code
                    </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
