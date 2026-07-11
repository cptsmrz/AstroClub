"use client";

import { useEffect, useRef } from "react";

interface MatrixRainCanvasProps {
  isActive: boolean;
  collapseProgress: number; // 0 (normal speed) to 1 (warp drop velocity)
}

class RainDrop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  depth: number;
  fontSize: number;
  opacity: number;
  nextChange: number;

  constructor(canvasWidth: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * -800 - 50; // start off-screen
    this.depth = 0.25 + Math.random() * 1.25; // 3D depth parallax scale
    this.fontSize = Math.floor(10 + this.depth * 11);
    this.speed = (1.8 + Math.random() * 3.2) * this.depth; // closer streams fall faster
    this.opacity = 0.15 + this.depth * 0.65;
    this.chars = [];
    this.nextChange = 0;
    
    // Generate trail of characters
    const trailLength = Math.floor(10 + Math.random() * 16);
    for (let i = 0; i < trailLength; i++) {
      this.chars.push(this.getRandomChar());
    }
  }

  getRandomChar(): string {
    const charPool = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ΘΞΦΨΩ";
    return charPool[Math.floor(Math.random() * charPool.length)];
  }

  update(canvasHeight: number, collapseProgress: number) {
    // Warp speed drop: accelerate columns downward exponentially during warp phase
    const currentSpeed = this.speed * (1 + collapseProgress * 22);
    this.y += currentSpeed;

    // Reset when stream tail clears the bottom
    if (this.y - (this.chars.length * this.fontSize) > canvasHeight) {
      this.y = Math.random() * -200 - 50;
      this.speed = (1.8 + Math.random() * 3.2) * this.depth;
    }

    // Randomize trail characters periodically
    this.nextChange++;
    if (this.nextChange > 5) {
      this.nextChange = 0;
      for (let i = 0; i < this.chars.length; i++) {
        if (Math.random() < 0.14) {
          this.chars[i] = this.getRandomChar();
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.font = `bold ${this.fontSize}px monospace`;

    for (let i = 0; i < this.chars.length; i++) {
      const charY = this.y - i * this.fontSize;
      if (charY < 0) continue;

      const trailOpacity = this.opacity * (1 - i / this.chars.length);
      
      if (i === 0) {
        // Blazing white/green leading character
        ctx.fillStyle = `rgba(235, 255, 235, ${this.opacity})`;
        ctx.shadowColor = "#10b981";
        ctx.shadowBlur = this.depth * 9;
      } else {
        // Falling emerald green trail
        ctx.fillStyle = `rgba(16, 185, 129, ${trailOpacity})`;
        ctx.shadowBlur = 0;
      }

      ctx.fillText(this.chars[i], this.x, charY);
    }
  }
}

export default function MatrixRainCanvas({ isActive, collapseProgress }: MatrixRainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dropsRef = useRef<RainDrop[]>([]);
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

    // Densely populate streams for widescreen code drop immersion
    const streamCount = Math.floor(canvas.width / 11);
    const drops: RainDrop[] = [];
    for (let i = 0; i < streamCount; i++) {
      drops.push(new RainDrop(canvas.width));
    }
    dropsRef.current = drops;

    const render = () => {
      // Clear with slight alpha to preserve trailing glow
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reset shadows for background rendering
      ctx.shadowBlur = 0;

      // Update and draw code drops
      drops.forEach(drop => {
        drop.update(canvas.height, collapseProgress);
        drop.draw(ctx);
      });

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
