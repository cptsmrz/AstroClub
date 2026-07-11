"use client";

import { useEffect, useRef } from "react";

interface GargantuaCanvasProps {
  isActive: boolean;
  collapseProgress: number; // 0 (normal) to 1 (fully collapsed into singularity)
}

class Particle {
  radius: number;
  initialRadius: number;
  angle: number;
  angularSpeed: number;
  yOffset: number;
  size: number;
  color: string;
  z: number = 0;

  constructor() {
    // Radial band: 65px to 290px
    this.initialRadius = 65 + Math.random() * 225;
    this.radius = this.initialRadius;
    this.angle = Math.random() * Math.PI * 2;
    // Keplerian speed: closer orbits spin faster
    this.angularSpeed = (0.012 + Math.random() * 0.01) * (110 / this.radius);
    this.yOffset = (Math.random() - 0.5) * 8; // thicker gas plane
    this.size = 1.3 + Math.random() * 2.8; // larger particles to overlap and blur

    const heat = Math.max(0, 1 - (this.radius - 65) / 95);
    if (heat > 0.78) {
      this.color = `rgba(225, 245, 255, ${0.5 + Math.random() * 0.4})`; // blazing hot white-blue core
    } else if (heat > 0.4) {
      this.color = `rgba(255, 220, 110, ${0.45 + Math.random() * 0.4})`; // gold-yellow plasma
    } else {
      this.color = `rgba(240, 105, 30, ${0.3 + Math.random() * 0.45})`; // warm orange-red gas
    }
  }

  update(collapseProgress: number) {
    // Gravitational collapse: pull particles closer and orbit faster as collapseProgress increases
    this.radius = this.initialRadius * (1 - collapseProgress * 0.82);
    this.angle += this.angularSpeed * (1 + collapseProgress * 3.5);
    this.z = Math.sin(this.angle) * this.radius;
  }

  draw(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const x = Math.cos(this.angle) * this.radius;
    const y = this.yOffset;
    const z = this.z;

    // 1. Einstein Ring (Bent background light wrapping around top and bottom)
    if (z < 0) {
      // Calculate lensed projection curve: squashed halo ring wrapping higher over the black hole
      const lensY = Math.abs(x) * 0.12 + (this.radius - Math.abs(x)) * 0.45;
      
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Upper lensed arc
      ctx.arc(cx + x, cy - lensY + y, this.size * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      // Lower lensed arc
      ctx.arc(cx + x, cy + lensY + y, this.size * 0.85, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Direct Accretion Disk (Foreground and un-lensed projection)
    // Symmetrical perspective tilt (tilt ratio = 0.13)
    const sx = cx + x;
    const sy = cy + y + z * 0.13;

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(sx, sy, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function GargantuaCanvas({ isActive, collapseProgress }: GargantuaCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle canvas resizing
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Instantiate particles with higher density
    const particleCount = 2200;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    particlesRef.current = particles;

    // Accretion disk center coordinates
    const render = () => {
      const cx = canvas.width * 0.28;
      const cy = canvas.height / 2;

      // Draw faint background gravitational lensing fog
      ctx.fillStyle = "rgba(0, 0, 0, 0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Accretion background glow
      const glowGrad = ctx.createRadialGradient(cx, cy, 35, cx, cy, 300);
      glowGrad.addColorStop(0, "rgba(240, 110, 35, 0.05)");
      glowGrad.addColorStop(0.3, "rgba(255, 215, 120, 0.02)");
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 300, 0, Math.PI * 2);
      ctx.fill();

      // Sort particles by Z-depth (from back to front) to implement Painter's Algorithm
      particles.forEach(p => p.update(collapseProgress));
      particles.sort((a, b) => a.z - b.z);

      // Enable blur filter for volumetric gaseous plasma look
      ctx.filter = "blur(1.6px)";

      // Render sorted particles
      const horizonRadius = Math.max(8, 48 * (1 - collapseProgress * 0.75));

      particles.forEach(p => {
        // Once we cross from background (z < 0) to foreground (z >= 0),
        // we render the solid black event horizon sphere blocking the background disk.
        if (p.z >= 0 && p.z - p.angularSpeed * p.radius < 0) {
          // Temporarily disable filter to keep event horizon sphere sharp
          ctx.filter = "none";
          ctx.fillStyle = "#000000";
          ctx.beginPath();
          ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
          ctx.fill();

          // Blazing corona glow directly surrounding the event horizon
          const coronaGlow = ctx.createRadialGradient(cx, cy, horizonRadius, cx, cy, horizonRadius + 14);
          coronaGlow.addColorStop(0, "rgba(255, 230, 160, 0.45)");
          coronaGlow.addColorStop(0.3, "rgba(240, 110, 30, 0.2)");
          coronaGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = coronaGlow;
          ctx.beginPath();
          ctx.arc(cx, cy, horizonRadius + 14, 0, Math.PI * 2);
          ctx.fill();

          // Event horizon outer gravitational lensing shadow boundary
          ctx.strokeStyle = "rgba(255, 215, 120, 0.35)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, horizonRadius + 0.8, 0, Math.PI * 2);
          ctx.stroke();

          // Re-enable blur filter for subsequent foreground particles
          ctx.filter = "blur(1.6px)";
        }
        p.draw(ctx, cx, cy);
      });

      // Event horizon final draw override to guarantee the center is solid black
      ctx.filter = "none";
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(cx, cy, horizonRadius, 0, Math.PI * 2);
      ctx.fill();

      requestRef.current = requestAnimationFrame(render);
    };

    if (isActive) {
      requestRef.current = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isActive, collapseProgress]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
