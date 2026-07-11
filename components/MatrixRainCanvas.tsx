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
    // Restrict width to leave exactly 0.75 inches (~72 pixels) on each side
    this.x = 72 + Math.random() * (canvasWidth - 144);
    this.y = Math.random() * -800 - 50; // start off-screen
    this.depth = 0.25 + Math.random() * 1.25; // 3D depth parallax scale
    this.fontSize = Math.floor(10 + this.depth * 11);
    
    // High-contrast speeds: some rain very slow, some very fast
    if (this.depth < 0.65) {
      // Slow background rain
      this.speed = (0.8 + Math.random() * 1.2) * this.depth;
    } else if (this.depth > 1.15) {
      // Fast foreground rain
      this.speed = (5.5 + Math.random() * 4.5) * this.depth;
    } else {
      // Medium rain
      this.speed = (2.2 + Math.random() * 2.5) * this.depth;
    }

    this.opacity = 0.15 + this.depth * 0.65;
    this.chars = [];
    this.nextChange = 0;
    
    // Generate shorter character trails to save RAM
    const trailLength = Math.floor(6 + Math.random() * 8);
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
      
      // Re-initialize speed with high-contrast properties
      if (this.depth < 0.65) {
        this.speed = (0.8 + Math.random() * 1.2) * this.depth;
      } else if (this.depth > 1.15) {
        this.speed = (5.5 + Math.random() * 4.5) * this.depth;
      } else {
        this.speed = (2.2 + Math.random() * 2.5) * this.depth;
      }
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
        // Blazing light emerald leading character (simulates glow without heavy shadow rendering)
        ctx.fillStyle = `rgba(209, 250, 229, ${this.opacity})`;
      } else {
        // Falling green trail
        ctx.fillStyle = `rgba(16, 185, 129, ${trailOpacity})`;
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

    // Stream count relative to 75% width coverage area (spaced out for 50% fewer columns)
    const streamCount = Math.floor((canvas.width - 144) / 24);
    const drops: RainDrop[] = [];
    for (let i = 0; i < streamCount; i++) {
      drops.push(new RainDrop(canvas.width));
    }
    dropsRef.current = drops;

    const render = () => {
      // Clear with slight alpha to preserve trailing glow
      ctx.fillStyle = "rgba(0, 0, 0, 0.16)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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
