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
    
    // Grid Configuration - TIGHTER AND BRIGHTER
    const spacing = 45;
    const rows = Math.ceil(height / spacing);
    const cols = Math.ceil(width / spacing);
    const mouse = { x: -1000, y: -1000 };
    
    // Physics Configuration - MORE REACTIVE
    const stiffness = 0.1;
    const damping = 0.88; 
    const reach = 250; // Larger influence radius

    interface Point {
      x: number;
      y: number;
      ox: number; 
      oy: number; 
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
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const colsCount = cols + 1;

      // Update Physics
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Distance to mouse
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Repulsion force
        if (dist < reach) {
          const force = (reach - dist) / reach;
          const angle = Math.atan2(dy, dx);
          
          // Move points AWAY from mouse
          const pushX = Math.cos(angle) * force * 8; 
          const pushY = Math.sin(angle) * force * 8;
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

      // Draw Grid Lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(41, 216, 255, 0.35)'; // Higher base opacity
      ctx.lineWidth = 1; // Thicker lines

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        // Draw Dot at intersection
        // ctx.fillStyle = 'rgba(41, 216, 255, 0.5)';
        // ctx.fillRect(p.x - 1, p.y - 1, 2, 2);

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

      // Opacity mask (Vignette)
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
      gradient.addColorStop(0, 'rgba(2, 6, 23, 0)'); // Transparent center
      gradient.addColorStop(0.8, 'rgba(2, 6, 23, 0.5)'); 
      gradient.addColorStop(1, 'rgba(2, 6, 23, 1)'); // Solid edges
      
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

  // Removed low opacity class, handling opacity in canvas context for better control
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-auto mix-blend-screen" 
    />
  );
};