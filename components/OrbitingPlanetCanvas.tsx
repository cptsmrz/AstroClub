"use client";

import { useEffect, useRef } from "react";

export default function OrbitingPlanetCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 480;
    const H = 480;
    canvas.width = W;
    canvas.height = H;

    // Load Real Saturn Photo (tilted oblique side-view)
    const saturnImg = new Image();
    saturnImg.src = "/images/saturn_real.png";
    let imgLoaded = false;
    saturnImg.onload = () => {
      imgLoaded = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - W / 2;
      const my = e.clientY - rect.top - H / 2;
      mouseRef.current.targetX = mx * 0.0015;
      mouseRef.current.targetY = my * 0.0015;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const cx = W / 2;
    const cy = H / 2;

    let animationFrameId: number;

    const render = () => {
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, W, H);

      // 1. Draw glowing background aura
      const spaceGlow = ctx.createRadialGradient(cx, cy, 50, cx, cy, 220);
      spaceGlow.addColorStop(0, "rgba(56, 189, 248, 0.0)");
      spaceGlow.addColorStop(0.6, "rgba(56, 189, 248, 0.05)");
      spaceGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = spaceGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Saturn Real-Photo (rendered with Screen composite operation to blend dark backgrounds)
      if (imgLoaded) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.translate(cx, cy);
        // Responsive tilt based on mouse coordinate shifts
        ctx.rotate(mouse.x * 0.05);
        const imgSize = 370;
        ctx.drawImage(saturnImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      }

      // 3. Draw Stargazer Silhouette on Saturn's Ring (Pinterest Accretion Disk Concept)
      // Placed on the lower-left edge of the rings
      const px = cx - 128 + mouse.x * 15;
      const py = cy + 28 + mouse.y * 15;

      ctx.save();
      
      // Draw a subtle, soft glowing light ray pointing from the stargazer's direction towards Saturn
      const beam = ctx.createLinearGradient(px, py - 4, cx - 10, cy);
      beam.addColorStop(0, "rgba(56, 189, 248, 0.45)");
      beam.addColorStop(0.4, "rgba(56, 189, 248, 0.12)");
      beam.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(px, py - 4);
      ctx.lineTo(cx - 30, cy - 35);
      ctx.lineTo(cx - 15, cy + 30);
      ctx.closePath();
      ctx.fill();

      // Draw Stargazer figure (12px tall)
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(56, 189, 248, 0.8)";
      ctx.shadowBlur = 4;
      
      // Torso
      ctx.beginPath();
      ctx.ellipse(px, py - 3.5, 1.6, 3.2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Head
      ctx.beginPath();
      ctx.arc(px, py - 8.2, 1.2, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.shadowBlur = 0; // reset

      // Legs
      ctx.beginPath();
      ctx.moveTo(px - 0.8, py - 1);
      ctx.lineTo(px - 1.2, py + 3.8);
      ctx.moveTo(px + 0.8, py - 1);
      ctx.lineTo(px + 1.2, py + 3.8);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Small portable telescope setup standing next to the stargazer
      ctx.beginPath();
      ctx.moveTo(px - 4, py + 3.8);
      ctx.lineTo(px - 2.5, py - 1);
      ctx.lineTo(px - 1, py + 3.8);
      ctx.strokeStyle = "rgba(148, 163, 184, 0.9)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Telescope tube pointing towards Saturn's bands
      ctx.beginPath();
      ctx.moveTo(px - 3.5, py - 1.2);
      ctx.lineTo(px + 4, py - 4.5);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] flex items-center justify-center shrink-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer pointer-events-auto animate-fade-in"
      />
    </div>
  );
}
