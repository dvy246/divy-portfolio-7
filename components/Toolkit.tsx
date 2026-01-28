
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TOOLKIT_ITEMS } from '../data';

// Custom Hook to manage sketch jitter animation
const useSketchJitter = (isHovered: boolean) => {
    // We animate the seed/frequency to create the "boiling" line effect
    return {
        filter: isHovered ? "url(#toolkit-sketch-active)" : "url(#toolkit-sketch-idle)",
        scale: isHovered ? 1.1 : 1,
    };
};

export const Toolkit: React.FC = () => {
  return (
    <section id="toolkit" className="py-24 px-4 bg-[#0a0a0a] relative overflow-hidden">
        {/* SVG Filters for Sketch Effect */}
        <svg className="absolute w-0 h-0">
            <defs>
                {/* Idle: Slight roughness */}
                <filter id="toolkit-sketch-idle">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
                {/* Active: High frequency jitter (simulates vibrating ink) */}
                <filter id="toolkit-sketch-active">
                    <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="2" result="noise">
                         <animate attributeName="baseFrequency" values="0.1;0.15;0.1" dur="0.2s" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
            </defs>
        </svg>

        <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-sketch font-bold text-light-accent dark:text-dark-accent mb-4">
                    My Toolkit
                </h2>
                <p className="text-light-text/60 dark:text-dark-text/60 font-sans max-w-2xl mx-auto">
                    The technologies and tools I use to bring ideas to life.
                </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8">
                {TOOLKIT_ITEMS.map((item, index) => (
                    <ToolkitItem key={item.name} item={item} index={index} />
                ))}
            </div>
        </div>
    </section>
  );
};

const ToolkitItem: React.FC<{ item: typeof TOOLKIT_ITEMS[0], index: number }> = ({ item, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const jitterStyle = useSketchJitter(isHovered);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex flex-col items-center justify-center gap-3 group cursor-pointer"
        >
            <div className="relative w-16 h-16 flex items-center justify-center">
                {/* Background Glow (Visible on Hover) */}
                <motion.div 
                    animate={{ opacity: isHovered ? 0.6 : 0 }}
                    className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300"
                    style={{ backgroundColor: item.color }}
                />
                
                {/* The Icon Container with Sketch Filter */}
                <motion.div
                    animate={jitterStyle}
                    className="relative z-10 p-3"
                >
                    <item.icon 
                        size={40} 
                        strokeWidth={1.5}
                        color={isHovered ? item.color : "#64748b"} // Grey when idle, Colored when hovered
                        className="transition-colors duration-200"
                    />
                </motion.div>
            </div>
            
            <motion.span 
                className="text-sm font-mono font-bold tracking-wide transition-colors duration-200"
                style={{ color: isHovered ? item.color : "#94a3b8" }}
            >
                {item.name}
            </motion.span>
        </motion.div>
    );
}
