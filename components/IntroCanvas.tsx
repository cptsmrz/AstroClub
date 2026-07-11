"use client";

import { useEffect, useRef } from "react";

export type IntroPhase = "telemetry" | "matrix" | "black" | "none";

interface IntroCanvasProps {
  phase: IntroPhase;
}

export default function IntroCanvas({ phase }: IntroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Start fully transparent so stars show through before trails accumulate
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const fontSize = 16;
    const spacing = 22;
    const cols = () => Math.floor(canvas.width / spacing);

    let yPos: number[] = [];
    let speeds: number[] = [];

    const initColumns = () => {
      const n = cols();
      yPos = Array.from({ length: n }, () =>
        Math.random() * -(canvas.height / fontSize) * 1.5
      );
      speeds = Array.from({ length: n }, () => 0.7 + Math.random() * 1.3);
    };
    initColumns();

    window.addEventListener("resize", initColumns);

    const charPool =
      "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

    const draw = () => {
      if (phase !== "matrix") {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Trail fade
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      const n = cols();
      // Grow arrays if window resized
      while (yPos.length < n) {
        yPos.push(Math.random() * -(canvas.height / fontSize));
        speeds.push(0.7 + Math.random() * 1.3);
      }

      for (let i = 0; i < n; i++) {
        const x = i * spacing;
        const row = Math.floor(yPos[i]);
        const y = row * fontSize;

        if (y > 0) {
          // Trail char (Matrix green)
          ctx.fillStyle = "#00ff41";
          ctx.fillText(
            charPool[Math.floor(Math.random() * charPool.length)],
            x,
            y - fontSize
          );
          // Head char (light green)
          ctx.fillStyle = "#a7f3d0";
          ctx.fillText(
            charPool[Math.floor(Math.random() * charPool.length)],
            x,
            y
          );
        }

        yPos[i] += speeds[i];

        if (yPos[i] * fontSize > canvas.height) {
          yPos[i] = Math.random() * -12;
          speeds[i] = 0.7 + Math.random() * 1.3;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", initColumns);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: phase === "matrix" ? "block" : "none" }}
    />
  );
}
