import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || target.getAttribute('role') === 'button') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      {/* Main Cursor Dot - The "Nib" */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div 
            animate={{ 
                scale: isHovering ? 2.5 : 1,
                rotate: isHovering ? 45 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
        >
             {/* Crosshair / Pen Nib Look */}
            <div className="absolute w-[2px] h-4 bg-light-accent dark:bg-dark-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-4 h-[2px] bg-light-accent dark:bg-dark-accent top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            
            {/* Outer Ring */}
            <div className={`w-4 h-4 border border-light-accent dark:border-dark-accent rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
        </motion.div>
      </motion.div>
      
      {/* Trailing Trace */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-light-accent dark:bg-dark-accent pointer-events-none z-[9998] hidden md:block opacity-50"
        style={{
            x: mouseX,
            y: mouseY,
            translateX: 12,
            translateY: 12
        }}
        transition={{ delay: 0.1 }}
      />
    </>
  );
};