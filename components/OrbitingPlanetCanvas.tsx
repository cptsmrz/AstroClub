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
      mouseRef.current.targetX = mx * 0.0012;
      mouseRef.current.targetY = my * 0.0012;
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
        // Responsive tilt based on mouse drag coordinates
        ctx.rotate(mouse.x * 0.06);
        const imgSize = 370;
        ctx.drawImage(saturnImg, -imgSize / 2, -imgSize / 2, imgSize, imgSize);
        ctx.restore();
      }

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
