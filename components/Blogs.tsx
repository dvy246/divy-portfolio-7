
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import { ElectricOverlay } from './ElectricOverlay';

export const Blogs: React.FC = () => {
  const { blogs } = usePortfolio();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="blogs" className="py-24 px-4 bg-light-bg dark:bg-dark-bg relative overflow-hidden">
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
                    My Articles
                </h2>
                <p className="text-light-text/60 dark:text-dark-text/60 font-sans max-w-2xl mx-auto">
                    Deep dives into AI architectures, algorithms, and system design patterns.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                    <div 
                        key={blog.id} 
                        className="h-full"
                        onMouseEnter={() => setHoveredId(blog.id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <CardContainer className="inter-var w-full h-full" containerClassName="w-full h-full">
                            <CardBody className="bg-white/5 dark:bg-[#0a0a0a] relative group/card border-2 border-dashed border-light-text/10 dark:border-dark-text/20 w-full h-auto rounded-xl overflow-hidden hover:border-light-accent dark:hover:border-dark-accent dark:hover:shadow-[0_0_30px_rgba(41,216,255,0.2)] transition-colors flex flex-col">
                                
                                {/* THUNDER GLOW EFFECT (Only visible on hover) */}
                                {hoveredId === blog.id && (
                                    <div className="absolute inset-0 opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                                        <ElectricOverlay />
                                    </div>
                                )}

                                {/* Image Section */}
                                <CardItem translateZ="50" className="w-full h-48 relative border-b border-light-text/10 dark:border-dark-text/10 overflow-hidden">
                                    <img 
                                        src={blog.image} 
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className="p-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 group-hover/card:bg-dark-accent group-hover/card:text-black transition-colors">
                                            <FileText size={16} />
                                        </div>
                                    </div>
                                </CardItem>

                                {/* Content Section */}
                                <div className="p-6 relative z-20 flex flex-col flex-grow">
                                    <div className="flex items-center gap-2 text-xs font-mono text-light-accent dark:text-dark-accent mb-3">
                                        <Calendar size={12} />
                                        <span>{blog.date}</span>
                                    </div>

                                    <CardItem translateZ="40" className="text-xl font-sketch font-bold text-light-text dark:text-dark-text mb-4 leading-tight flex-grow">
                                        {blog.title}
                                    </CardItem>
                                    
                                    <div className="mt-auto pt-4 border-t border-white/5">
                                        <CardItem 
                                            translateZ="30"
                                            as="a"
                                            href={blog.link}
                                            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-light-text/60 dark:text-dark-text/60 group-hover/card:text-light-accent dark:group-hover/card:text-dark-accent transition-colors"
                                        >
                                            Read Article <ArrowUpRight size={16} />
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
