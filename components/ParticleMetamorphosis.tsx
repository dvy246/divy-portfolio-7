import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ParticleMetamorphosis: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION REFINED FOR SUBTLETY ---
    const PARTICLE_COUNT = window.innerWidth < 768 ? 800 : 1800; // Less clutter
    const MOUSE_REPULSION = 150;
    const ROTATION_SPEED = 0.0005; // Very slow rotation
    const TRANSITION_SPEED = 0.02; // Slower morphing

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- STATE ---
    let currentScrollY = 0;
    let targetShape = 0; // 0: Head, 1: Brain, 2: Globe
    const mouse = { x: 0, y: 0, isActive: false };

    interface Particle {
      x: number; y: number; z: number;
      tx: number; ty: number; tz: number;
      vx: number; vy: number; vz: number;
      color: string;
      baseAlpha: number;
      size: number;
    }
    
    const particles: Particle[] = [];

    // Initialize Particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isAccent = Math.random() > 0.85; // Only 15% Accent particles
      particles.push({
        x: (Math.random() - 0.5) * 1200,
        y: (Math.random() - 0.5) * 1200,
        z: (Math.random() - 0.5) * 1200,
        tx: 0, ty: 0, tz: 0,
        vx: 0, vy: 0, vz: 0,
        // Darker colors: Grey-blue for standard, dim cyan for accent
        color: isAccent ? '#22d3ee' : '#64748b', 
        baseAlpha: isAccent ? 0.4 : 0.2, // Very transparent
        size: isAccent ? 1.5 : 0.8 // Very small particles
      });
    }

    // --- SHAPE GENERATORS ---
    
    // 1. Cyber Head 
    const setHeadShape = () => {
      const radius = 320; // Widen radius to keep clear of text center
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const u = Math.random() * Math.PI;
        const v = Math.random() * Math.PI * 2;
        
        let x = radius * Math.sin(u) * Math.cos(v);
        let y = radius * Math.sin(u) * Math.sin(v);
        let z = radius * Math.cos(u);

        if (y > 0) { x *= 0.85; z *= 0.9; } 
        if (y > 150) { x *= 0.7; } 
        if (y > -50 && y < 100 && z > 0) {
            if (Math.abs(x) < 60) { z += 50 * (1 - Math.abs(x)/60); }
        }
        
        p.tx = x; p.ty = y; p.tz = z;
      }
    };

    // 2. Digital Brain
    const setBrainShape = () => {
      const radius = 280;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        const hemisphere = i % 2 === 0 ? 1 : -1;
        const u = Math.random() * Math.PI;
        const v = Math.random() * Math.PI * 2;
        
        let x = (radius * 0.8) * Math.sin(u) * Math.cos(v);
        let y = (radius * 0.9) * Math.sin(u) * Math.sin(v);
        let z = (radius * 1.1) * Math.cos(u);

        x += hemisphere * 60; 
        const noise = Math.sin(x * 0.12) * Math.cos(y * 0.12) * 15;
        x += noise; y += noise; z += noise;

        p.tx = x; p.ty = y; p.tz = z;
      }
    };

    // 3. Networked Globe
    const setGlobeShape = () => {
        const radius = 400; // Large globe
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          const u = Math.random() * Math.PI * 2;
          const v = Math.acos((Math.random() * 2) - 1);
          
          p.tx = radius * Math.sin(v) * Math.cos(u);
          p.ty = radius * Math.sin(v) * Math.sin(u);
          p.tz = radius * Math.cos(v);
        }
    };

    setHeadShape();

    // --- ANIMATION LOOP ---
    let rotationAngle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const scrollPct = currentScrollY / (document.body.scrollHeight - window.innerHeight || 1);
      
      let nextShape = 0;
      if (scrollPct > 0.15 && scrollPct < 0.5) nextShape = 1; 
      if (scrollPct >= 0.5) nextShape = 2; 

      if (nextShape !== targetShape) {
          targetShape = nextShape;
          if (targetShape === 0) setHeadShape();
          if (targetShape === 1) setBrainShape();
          if (targetShape === 2) setGlobeShape();
      }

      const cx = width / 2;
      const cy = height / 2;

      // Interaction Rotation
      const targetRotX = (mouse.y - cy) * 0.00005;
      const targetRotY = (mouse.x - cx) * 0.00005;

      rotationAngle += ROTATION_SPEED;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];

        // Physics
        p.x += (p.tx - p.x) * TRANSITION_SPEED;
        p.y += (p.ty - p.y) * TRANSITION_SPEED;
        p.z += (p.tz - p.z) * TRANSITION_SPEED;

        // Rotation
        let x = p.x;
        let y = p.y;
        let z = p.z;

        const angleY = rotationAngle + targetRotY;
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;

        const angleX = targetRotX;
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        let y1 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        // Projection - Push Z back slightly for depth
        const scale = 800 / (1000 + z2); 
        const projX = x1 * scale + cx;
        const projY = y1 * scale + cy;

        // Mouse Repulsion
        const dx = mouse.x - projX;
        const dy = mouse.y - projY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        let drawX = projX;
        let drawY = projY;

        if (dist < MOUSE_REPULSION) {
            const force = (MOUSE_REPULSION - dist) / MOUSE_REPULSION;
            const angle = Math.atan2(dy, dx);
            drawX -= Math.cos(angle) * force * 30;
            drawY -= Math.sin(angle) * force * 30;
        }

        // Draw with heavily reduced opacity
        const depthAlpha = (scale - 0.2);
        const finalAlpha = Math.min(depthAlpha * p.baseAlpha, 0.4); // Cap max opacity at 0.4

        if (finalAlpha > 0) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = finalAlpha;
            const size = p.size * scale;
            ctx.beginPath();
            ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
            ctx.fill();
        }
      }
      
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    const handleScroll = () => { currentScrollY = window.scrollY; };
    const handleMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[-1] pointer-events-none bg-[#020617]"
      style={{
          // Stronger vignette to fade edges
          background: 'radial-gradient(circle at center, #0f172a 0%, #020617 80%)' 
      }}
    />
  );
};