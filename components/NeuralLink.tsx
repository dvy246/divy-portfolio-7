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
      // Target the center of the card
      setTargetPos({ 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2
      });
      setIsVisible(true);
    }
  }, [activeId, mousePos]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-visible">
        <svg className="w-full h-full overflow-visible">
            <defs>
                <linearGradient id="neural-gradient" gradientUnits="userSpaceOnUse" x1={mousePos.x} y1={mousePos.y} x2={targetPos.x} y2={targetPos.y}>
                    <stop offset="0%" stopColor="#29D8FF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="100%" stopColor="#29D8FF" stopOpacity="0.8" />
                </linearGradient>
                <filter id="strong-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            {/* Mouse Reticle (The "Jack" plug) */}
            <motion.circle 
                cx={mousePos.x} 
                cy={mousePos.y} 
                r="6" 
                stroke="#29D8FF" 
                strokeWidth="2" 
                fill="none" 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
            />
             <motion.circle 
                cx={mousePos.x} 
                cy={mousePos.y} 
                r="2" 
                fill="#fff" 
            />

            {/* The Main Connecting Line */}
            <motion.path
                d={`M ${mousePos.x} ${mousePos.y} L ${targetPos.x} ${targetPos.y}`}
                stroke="url(#neural-gradient)"
                strokeWidth="2"
                fill="none"
                filter="url(#strong-glow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Data Packets traveling the line */}
            {/* Packet 1 */}
            <motion.circle r="4" fill="#fff" filter="drop-shadow(0 0 8px #29D8FF)">
                <animateMotion 
                    dur="0.6s" 
                    repeatCount="indefinite"
                    path={`M ${mousePos.x} ${mousePos.y} L ${targetPos.x} ${targetPos.y}`}
                />
            </motion.circle>

            {/* Packet 2 (Delayed) */}
            <motion.circle r="3" fill="#29D8FF">
                <animateMotion 
                    dur="0.6s" 
                    begin="0.3s"
                    repeatCount="indefinite"
                    path={`M ${mousePos.x} ${mousePos.y} L ${targetPos.x} ${targetPos.y}`}
                />
            </motion.circle>
            
            {/* Target Lock Ring on Card */}
            <motion.g transform={`translate(${targetPos.x}, ${targetPos.y})`}>
                <motion.circle 
                    r="20" 
                    stroke="#29D8FF" 
                    strokeWidth="1" 
                    fill="none" 
                    strokeDasharray="5 5"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{ rotate: { duration: 4, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
                />
                <circle r="4" fill="#29D8FF" className="animate-ping" />
            </motion.g>
        </svg>
    </div>
  );
};