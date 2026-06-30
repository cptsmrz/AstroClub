"use client";

import { useEffect, useRef } from "react";

interface AccretionStar {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  baseOpacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  yOffset: number;
  color: string;
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Center of the stellar accretion disk (anchored to the right side of the screen)
    let cx = W * 0.82;
    let cy = H * 0.50;

    const stars: AccretionStar[] = [];
    const numStars = Math.floor((W * H) / 1400); // Dense star counts

    // Generate stars clustered in a logarithmic-like accretion disk spiral
    for (let i = 0; i < numStars; i++) {
      // Clustered towards the center, but spread outwards
      const randVal = Math.random();
      const radius = 60 + Math.pow(randVal, 2.2) * (W * 0.85);
      
      const angle = Math.random() * Math.PI * 2;
      
      // Speed: Keplerian orbital mechanics (inner stars rotate faster than outer stars)
      const speed = (0.00015 + (12 / (radius + 80)) * 0.001) * (Math.random() * 0.4 + 0.8);
      
      const size = 0.4 + Math.random() * 1.5;
      const baseOpacity = 0.15 + Math.random() * 0.75;
      
      // Faint vertical fluff
      const yOffset = (Math.random() - 0.5) * (30 + (radius * 0.04));

      // Color scheme matches the Pinterest Pin (silver/cyan core with faint red/orange sparks at the outer edges)
      let color = "rgba(255, 255, 255, ";
      if (radius > W * 0.35 && Math.random() > 0.6) {
        // Warm outer sparks (orange/red)
        color = Math.random() > 0.5 ? "rgba(244, 63, 94, " : "rgba(245, 158, 11, ";
      } else if (Math.random() > 0.75) {
        // High-energy blue sparks
        color = "rgba(56, 189, 248, ";
      }

      stars.push({
        angle,
        radius,
        speed,
        size,
        baseOpacity,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.005 + Math.random() * 0.02,
        yOffset,
        color,
      });
    }

    // Parallax tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth) - 0.5;
        mouseRef.current.targetY = (e.touches[0].clientY / window.innerHeight) - 0.5;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    let animationFrameId: number;

    const render = () => {
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, W, H);

      // Parallax shifts
      const bgShiftX = mouse.x * 22;
      const bgShiftY = mouse.y * 22;

      // 1. Draw central void glow (the accretion center / black hole rim)
      const centerX = cx + bgShiftX;
      const centerY = cy + bgShiftY;
      
      const diskGlow = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, W * 0.65);
      diskGlow.addColorStop(0, "rgba(15, 23, 42, 0)");
      diskGlow.addColorStop(0.06, "rgba(255, 255, 255, 0.09)"); // Accretion disk rim
      diskGlow.addColorStop(0.15, "rgba(56, 189, 248, 0.04)");
      diskGlow.addColorStop(0.5, "rgba(56, 189, 248, 0.01)");
      diskGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = diskGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, W * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // 2. Render and update the rotating accretion stars
      stars.forEach((star) => {
        // Twinkle calculations
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = 0.6 + Math.cos(star.twinklePhase) * 0.4;
        const opacity = star.baseOpacity * twinkleFactor;

        // Orbit tick
        star.angle += star.speed;

        const cosA = Math.cos(star.angle);
        const sinA = Math.sin(star.angle);

        // Oblique side tilt: X-axis is stretched; Y-axis is squashed (0.33) and skewed
        const localX = star.radius * cosA;
        const localY = star.radius * sinA * 0.33 + star.yOffset;

        const sx = cx + localX + bgShiftX;
        const sy = cy + localY + bgShiftY;

        // Skip drawing if outside screen boundaries to optimize rendering
        if (sx < -50 || sx > W + 50 || sy < -50 || sy > H + 50) return;

        // Draw star core
        ctx.beginPath();
        ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color.endsWith(", ") ? `${star.color}${opacity})` : `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();

        // Draw halo glow for large/bright stars
        if (star.size > 1.25 && opacity > 0.6) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.size * 3.0, 0, Math.PI * 2);
          ctx.fillStyle = star.color.endsWith(", ") ? `${star.color}${opacity * 0.1})` : `rgba(148, 163, 184, 0.08)`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      cx = W * 0.82;
      cy = H * 0.50;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}