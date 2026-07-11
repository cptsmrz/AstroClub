"use client";

import { useEffect, useRef } from "react";

interface MatrixRainCanvasProps {
  isActive: boolean;
}

export default function MatrixRainCanvas({ isActive }: MatrixRainCanvasProps) {
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

      for (let i = 0; i < yPositions.length; i++) {
        const x = i * fontSize;
        const y = yPositions[i] * fontSize;

        // Draw green character at previous position to turn the white head green
        ctx.fillStyle = "#39ff14"; // neon green
        ctx.fillText(charPool[Math.floor(Math.random() * charPool.length)], x, y - fontSize);

        // Draw white/light-green character at new head position
        ctx.fillStyle = "#d1fec3"; // light green tint
        ctx.fillText(charPool[Math.floor(Math.random() * charPool.length)], x, y);

        // Update position (uniform constant speed)
        yPositions[i] += 1;

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
  }, [isActive]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
