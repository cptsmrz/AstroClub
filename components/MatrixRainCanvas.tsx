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
    
    // yPositions tracks the current row index (fractional for smooth speed variations)
    const yPositions = new Array(columns).fill(0).map(() => 
      Math.random() * -(canvas.height / fontSize) * 1.5
    );

    // Each column has a distinct speed to ensure natural desynchronized drop rates (prevents density jolts)
    const speeds = new Array(columns).fill(0).map(() => 
      0.65 + Math.random() * 1.35
    );

    const charPool = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

    const render = () => {
      // Classic trailing fade using transparent black overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < yPositions.length; i++) {
        const x = i * fontSize;
        const currentYIndex = Math.floor(yPositions[i]);
        const y = currentYIndex * fontSize;

        if (y >= 0) {
          // 1. Draw classic Matrix green character at the previous position to turn the white head green
          ctx.fillStyle = "#00ff41"; // Original Matrix green
          ctx.fillText(charPool[Math.floor(Math.random() * charPool.length)], x, y - fontSize);

          // 2. Draw white highlight character at the new head position
          ctx.fillStyle = "#ffffff"; // White head
          ctx.fillText(charPool[Math.floor(Math.random() * charPool.length)], x, y);
        }

        // Advance position by speed (fractional value, creates organic falling offsets)
        yPositions[i] += speeds[i];

        // Reset column to top when it clears the bottom of the screen
        if (yPositions[i] * fontSize > canvas.height) {
          yPositions[i] = Math.random() * -12;
          speeds[i] = 0.65 + Math.random() * 1.35; // re-randomize speed
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
