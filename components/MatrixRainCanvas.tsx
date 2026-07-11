"use client";

import { useEffect, useRef } from "react";

interface MatrixRainCanvasProps {
  isActive: boolean;
  collapseProgress: number; // 0 (normal speed) to 1 (warp drop velocity)
}

export default function MatrixRainCanvas({ isActive, collapseProgress }: MatrixRainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    
    // yPositions array tracks the current vertical row index for each column
    const yPositions = new Array(columns).fill(0).map(() => 
      Math.floor(Math.random() * -(canvas.height / fontSize) * 1.5)
    );

    const charPool = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

    const render = () => {
      // Classic semi-transparent black fill to draw trails organically
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      // Warp speed drop: advance more steps per frame during collapse phase
      const steps = 1 + Math.floor(collapseProgress * 7);

      for (let i = 0; i < yPositions.length; i++) {
        // Draw the character sequence for the current step
        for (let s = 0; s < steps; s++) {
          const char = charPool[Math.floor(Math.random() * charPool.length)];
          const x = i * fontSize;
          const y = (yPositions[i] + s) * fontSize;

          if (s === steps - 1) {
            // Brighter leading character
            ctx.fillStyle = "#d1fec3"; // light neon green tint
          } else {
            // Pure neon green trail
            ctx.fillStyle = "#39ff14"; // neon green
          }

          ctx.fillText(char, x, y);
        }

        // Update position
        yPositions[i] += steps;

        // Reset column to the top once it goes off the bottom of the screen
        if (yPositions[i] * fontSize > canvas.height && Math.random() > 0.975) {
          yPositions[i] = Math.floor(Math.random() * -4);
        }
      }

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
