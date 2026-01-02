import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { ElectricOverlay } from './ElectricOverlay';

export const Certificates: React.FC = () => {
  const { certificates } = usePortfolio();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="certificates" className="py-24 px-4 bg-light-bg dark:bg-dark-bg relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark bg-[length:30px_30px] opacity-5 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-sketch font-bold text-light-accent dark:text-dark-accent mb-4">
                    Credentials
                </h2>
                <p className="text-light-text/60 dark:text-dark-text/60 font-sans max-w-2xl mx-auto">
                    Verified qualifications and specialized training modules.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                    <div 
                        key={cert.id} 
                        className="h-full"
                        onMouseEnter={() => setHoveredId(cert.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <CardContainer className="inter-var w-full h-full" containerClassName="w-full h-full">
                            <CardBody className="bg-white/5 dark:bg-[#0a0a0a] relative group/card border-2 border-dashed border-light-text/10 dark:border-dark-text/20 w-full h-auto rounded-xl overflow-hidden hover:border-light-accent dark:hover:border-dark-accent dark:hover:shadow-[0_0_30px_rgba(41,216,255,0.2)] transition-colors">
                                
                                {/* THUNDER GLOW EFFECT (Only visible on hover) - OPTIMIZED */}
                                {hoveredId === cert.id && (
                                    <div className="absolute inset-0 opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                        <ElectricOverlay />
                                    </div>
                                )}

                                {/* Image Section */}
                                <CardItem translateZ="50" className="w-full h-48 relative border-b border-light-text/10 dark:border-dark-text/10">
                                    <img 
                                        src={cert.image} 
                                        alt={cert.title}
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    
                                    <div className="absolute bottom-4 left-4 right-4 z-20">
                                        <div className="flex items-center gap-2 text-xs font-mono text-light-accent dark:text-dark-accent mb-1">
                                            <Award size={14} />
                                            <span className="uppercase tracking-wider">{cert.issuer}</span>
                                        </div>
                                    </div>
                                </CardItem>

                                {/* Content Section */}
                                <div className="p-6 relative z-20">
                                    <CardItem translateZ="40" className="text-xl font-sketch font-bold text-light-text dark:text-dark-text mb-2 leading-tight">
                                        {cert.title}
                                    </CardItem>
                                    
                                    <div className="flex items-center justify-between mt-4">
                                        <CardItem translateZ="30" className="flex items-center gap-2 text-sm text-light-text/50 dark:text-dark-text/50 font-mono">
                                            <Calendar size={14} />
                                            <span>{cert.date}</span>
                                        </CardItem>

                                        <CardItem 
                                            translateZ="40"
                                            as="a"
                                            href={cert.link}
                                            target="_blank"
                                            className="px-4 py-2 rounded-full border border-light-text/20 dark:border-dark-text/20 text-xs font-bold uppercase tracking-wider hover:bg-light-accent dark:hover:bg-dark-accent hover:text-white dark:hover:text-black transition-colors flex items-center gap-2"
                                        >
                                            Verify <ExternalLink size={12} />
                                        </CardItem>
                                    </div>
                                </div>
                            </CardBody>
                        </CardContainer>
                    </div>
                ))}
            </div>
        </div>
    </section>
  );
};