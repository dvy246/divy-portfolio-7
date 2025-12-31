import React from 'react';
import { motion } from 'framer-motion';

export const Starfield: React.FC = () => {
  // Generate random stars
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-black via-[#090014] to-[#050505]">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut"
          }}
        />
      ))}
      {/* Nebula effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 to-transparent mix-blend-screen" />
    </div>
  );
};