import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const ParticleMetamorphosis: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // --- CONFIGURATION ---
    const PARTICLE_COUNT = window.innerWidth < 768 ? 600 : 1500; // Even cleaner count
    const MOUSE_REPULSION = 150;
    const ROTATION_SPEED = 0.0003; // Very slow drift
    const TRANSITION_SPEED = 0.015; // Smooth morph

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- STATE ---
    let currentScrollY = 0;
    let targetShape = 0; // 0: Field, 1: Brain, 2: Globe
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
      const isAccent = Math.random() > 0.90; // Only 10% Accent
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: (Math.random() - 0.5) * 2000,
        tx: 0, ty: 0, tz: 0,
        vx: 0, vy: 0, vz: 0,
        color: isAccent ? '#22d3ee' : '#475569', 
        baseAlpha: isAccent ? 0.5 : 0.2, 
        size: isAccent ? 1.5 : 0.8
      });
    }

    // --- SHAPE GENERATORS ---
    
    // 1. Cosmic Field (Spread out, void in center)
    const setCosmicField = () => {
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = particles[i];
        
        // Random wide distribution
        let x = (Math.random() - 0.5) * width * 1.5;
        let y = (Math.random() - 0.5) * height * 1.5;
        let z = (Math.random() - 0.5) * 1000;

        // CREATE SAFE ZONE: If particle is in the middle (where profile is), push it out
        const distFromCenter = Math.sqrt(x*x + y*y);
        if (distFromCenter < 350) {
            // Push outwards along angle
            const angle = Math.atan2(y, x);
            x = Math.cos(angle) * (350 + Math.random() * 200);
            y = Math.sin(angle) * (350 + Math.random() * 200);
        }

        p.tx = x; p.ty = y; p.tz = z;
      }
    };

    // 2. Digital Brain (For Skills Section)
    const setBrainShape = () => {
      const radius = 300;
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

    // 3. Networked Globe (For Footer/Contact)
    const setGlobeShape = () => {
        const radius = 450;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = particles[i];
          const u = Math.random() * Math.PI * 2;
          const v = Math.acos((Math.random() * 2) - 1);
          
          p.tx = radius * Math.sin(v) * Math.cos(u);
          p.ty = radius * Math.sin(v) * Math.sin(u);
          p.tz = radius * Math.cos(v);
        }
    };

    // Initialize with Field
    setCosmicField();

    // --- ANIMATION LOOP ---
    let rotationAngle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const scrollPct = currentScrollY / (document.body.scrollHeight - window.innerHeight || 1);
      
      let nextShape = 0;
      if (scrollPct > 0.15 && scrollPct < 0.6) nextShape = 1; 
      if (scrollPct >= 0.6) nextShape = 2; 

      if (nextShape !== targetShape) {
          targetShape = nextShape;
          if (targetShape === 0) setCosmicField();
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

        // Projection
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
        const finalAlpha = Math.min(depthAlpha * p.baseAlpha, 0.4); 

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
    const handleResize = () => { 
        width = canvas.width = window.innerWidth; 
        height = canvas.height = window.innerHeight; 
        if(targetShape === 0) setCosmicField(); // Re-calc field on resize
    };

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
          background: 'radial-gradient(circle at center, #0f172a 0%, #020617 80%)' 
      }}
    />
  );
};