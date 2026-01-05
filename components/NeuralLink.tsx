import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NeuralLinkProps {
  activeId: number | null;
  cardRefs: React.MutableRefObject<Map<number, HTMLDivElement | null>>;
}

export const NeuralLink: React.FC<NeuralLinkProps> = ({ activeId, cardRefs }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (activeId === null) {
      setIsVisible(false);
      return;
    }

    const card = cardRefs.current.get(activeId);
    if (card) {
      const rect = card.getBoundingClientRect();
      // Target the top-left technical corner or center
      setTargetPos({ 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2
      });
      setIsVisible(true);
    }
  }, [activeId, mousePos]); // Re-calc on mouse move to keep it snappy if card moves (3d tilt)

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[90]">
        <svg className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="neural-gradient" gradientUnits="userSpaceOnUse" x1={mousePos.x} y1={mousePos.y} x2={targetPos.x} y2={targetPos.y}>
                    <stop offset="0%" stopColor="#29D8FF" stopOpacity="0" />
                    <stop offset="50%" stopColor="#29D8FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#29D8FF" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glow-line">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* The Main Connecting Line */}
            <motion.path
                d={`M ${mousePos.x} ${mousePos.y} L ${targetPos.x} ${targetPos.y}`}
                stroke="url(#neural-gradient)"
                strokeWidth="1.5"
                fill="none"
                filter="url(#glow-line)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
            />

            {/* Data Packet traveling the line */}
            <motion.circle
                r="3"
                fill="#fff"
                filter="drop-shadow(0 0 4px #29D8FF)"
            >
                <animateMotion 
                    dur="0.5s" 
                    repeatCount="indefinite"
                    path={`M ${mousePos.x} ${mousePos.y} L ${targetPos.x} ${targetPos.y}`}
                />
            </motion.circle>
            
            {/* Terminal node at target */}
            <circle cx={targetPos.x} cy={targetPos.y} r="4" fill="#29D8FF" className="animate-ping" />
        </svg>
    </div>
  );
};