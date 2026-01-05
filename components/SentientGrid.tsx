import React, { useEffect, useRef } from 'react';

export const SentientGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    // Grid Configuration
    const spacing = 40;
    const rows = Math.ceil(height / spacing);
    const cols = Math.ceil(width / spacing);
    const mouse = { x: -1000, y: -1000 };
    
    // Physics Configuration
    const stiffness = 0.15;
    const damping = 0.85; // Lower = more oscillation
    const reach = 150; // Radius of influence

    interface Point {
      x: number;
      y: number;
      ox: number; // Origin X
      oy: number; // Origin Y
      vx: number;
      vy: number;
    }

    const points: Point[] = [];

    // Initialize Points
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const px = x * spacing;
        const py = y * spacing;
        points.push({ x: px, y: py, ox: px, oy: py, vx: 0, vy: 0 });
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Relative position adjustment if canvas isn't full screen, 
      // but here we assume full screen or handling rect
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Note: A full re-init of points would be better here for strict responsiveness,
      // but strictly resizing canvas works for the effect without crashing.
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Styling
      ctx.strokeStyle = '#29D8FF'; // Cyan
      ctx.lineWidth = 0.3; 

      const colsCount = cols + 1;

      // Update Physics
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Distance to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Repulsion force (Sentient reaction)
        if (dist < reach) {
          const force = (reach - dist) / reach;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 5; // Strength
          const pushY = Math.sin(angle) * force * 5;
          p.vx -= pushX;
          p.vy -= pushY;
        }

        // Spring force (Return to origin)
        const dxHome = p.ox - p.x;
        const dyHome = p.oy - p.y;
        
        p.vx += dxHome * stiffness;
        p.vy += dyHome * stiffness;

        // Apply friction
        p.vx *= damping;
        p.vy *= damping;

        // Move
        p.x += p.vx;
        p.y += p.vy;
      }

      // Draw Lines
      ctx.beginPath();
      
      // Horizontal Lines
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Draw to right neighbor
        if ((i + 1) % colsCount !== 0 && i + 1 < points.length) {
          const next = points[i + 1];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(next.x, next.y);
        }
        // Draw to bottom neighbor
        if (i + colsCount < points.length) {
          const bottom = points[i + colsCount];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(bottom.x, bottom.y);
        }
      }
      
      ctx.stroke();

      // Opacity mask (fade edges)
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
      gradient.addColorStop(0, 'rgba(5, 5, 5, 0)'); // Transparent center
      gradient.addColorStop(0.8, 'rgba(5, 5, 5, 0.8)'); // Fade out edges
      gradient.addColorStop(1, 'rgba(5, 5, 5, 1)'); 
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0,0,width,height);

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-auto opacity-[0.15]" 
    />
  );
};