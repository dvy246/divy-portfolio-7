import React, { useEffect, useState, useRef } from 'react';

interface NeuralLinkProps {
  activeId: number | null;
  cardRefs: React.MutableRefObject<Map<number, HTMLDivElement | null>>;
}

export const NeuralLink: React.FC<NeuralLinkProps> = ({ activeId, cardRefs }) => {
  const [coords, setCoords] = useState<{ x1: number, y1: number, x2: number, y2: number } | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation Loop to update line coordinates
  useEffect(() => {
    if (activeId === null) {
      setCoords(null);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const update = () => {
      const card = cardRefs.current.get(activeId);
      if (card) {
        const rect = card.getBoundingClientRect();
        // Calculate center of the target card
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        
        setCoords({
            x1: mouseRef.current.x,
            y1: mouseRef.current.y,
            x2: targetX,
            y2: targetY
        });
      }
      rafRef.current = requestAnimationFrame(update);
    };

    update(); // Start loop

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeId, cardRefs]);

  if (!coords) return null;

  // --- MATH FOR SKETCHY CURVE ---
  
  // Calculate midpoint
  const midX = (coords.x1 + coords.x2) / 2;
  const midY = (coords.y1 + coords.y2) / 2;
  
  // Calculate vector
  const dx = coords.x2 - coords.x1;
  const dy = coords.y2 - coords.y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Add a slight curve (Bézier Control Point)
  // We use perpendicular offset to create an arc
  // Offset depends on distance to make it look proportional
  const curvature = Math.min(dist * 0.15, 60); 
  
  // Deterministic direction for curve so it doesn't flip wildly
  const offsetDir = (coords.x2 > coords.x1) ? 1 : -1;
  
  // Control Point logic: Midpoint + Perpendicular Vector
  const cpX = midX - (dy / dist) * curvature * offsetDir;
  const cpY = midY + (dx / dist) * curvature * offsetDir;

  // Primary Line (Strong)
  const pathD = `M ${coords.x1} ${coords.y1} Q ${cpX} ${cpY} ${coords.x2} ${coords.y2}`;
  
  // Secondary Line (Messy/Sketchy Duplicate)
  // Slight random offset for the control point of the ghost line
  const pathD2 = `M ${coords.x1} ${coords.y1} Q ${cpX + 15} ${cpY - 15} ${coords.x2} ${coords.y2}`;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-visible">
        <svg className="w-full h-full overflow-visible">
            <defs>
                {/* 
                   Sketch Filter: Creates a rough, jagged edge on the stroke.
                   This mimics the texture of a pencil or marker on paper.
                */}
                <filter id="sketch-roughness">
                    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
                </filter>
            </defs>

            {/* Target Area Scribble */}
            <g transform={`translate(${coords.x2}, ${coords.y2})`}>
                <circle 
                    r="25" 
                    stroke="#29D8FF" 
                    strokeWidth="1.5" 
                    fill="none" 
                    filter="url(#sketch-roughness)" 
                    opacity="0.5" 
                />
                 <circle 
                    r="18" 
                    stroke="white" 
                    strokeWidth="1" 
                    fill="none" 
                    filter="url(#sketch-roughness)" 
                    opacity="0.3" 
                    strokeDasharray="4 2"
                />
            </g>

            {/* Main Connecting Line (Cyan Marker Style) */}
            <path 
                d={pathD} 
                stroke="#29D8FF" 
                strokeWidth="2.5" 
                fill="none" 
                filter="url(#sketch-roughness)"
                strokeLinecap="round"
                opacity="0.8"
            />

            {/* Ghost Line (White Pencil Style) */}
            <path 
                d={pathD2} 
                stroke="white" 
                strokeWidth="1" 
                fill="none" 
                filter="url(#sketch-roughness)"
                opacity="0.4"
                strokeDasharray="8 4"
            />

            {/* Mouse Scribble */}
            <g transform={`translate(${coords.x1}, ${coords.y1})`}>
                {/* A small 'X' or crosshair at the mouse */}
                <path 
                    d="M -6 -6 L 6 6 M -6 6 L 6 -6" 
                    stroke="#29D8FF" 
                    strokeWidth="2" 
                    filter="url(#sketch-roughness)" 
                />
            </g>
        </svg>
    </div>
  );
};