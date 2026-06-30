"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// Types & Definitions
// ─────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface Point {
  x: number;
  y: number;
  size?: number; // Relative size of the star
}

interface ConstellationDef {
  name: string;
  points: Point[];
  edges: [number, number][]; // Indices of points to connect
  scale: number;
}

// Local coordinates for constellations
const CONSTELLATIONS: ConstellationDef[] = [
  {
    name: "Ursa Major (Big Dipper)",
    scale: 2.5,
    points: [
      { x: -50, y: -20, size: 1.2 },
      { x: -25, y: -15, size: 1.1 },
      { x: -5, y: -5, size: 1.0 },
      { x: 10, y: 15, size: 1.0 },
      { x: 15, y: 35, size: 1.2 },
      { x: 45, y: 40, size: 1.4 },
      { x: 55, y: 15, size: 1.5 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: "Orion",
    scale: 3,
    points: [
      { x: 40, y: -20, size: 1.8 }, // Betelgeuse (L Shoulder)
      { x: 35, y: 20, size: 1.2 },  // Bellatrix (R Shoulder)
      { x: 0, y: -10, size: 1.0 },  // Alnitak (Belt L)
      { x: 0, y: 0, size: 1.0 },    // Alnilam (Belt M)
      { x: 2, y: 10, size: 1.0 },   // Mintaka (Belt R)
      { x: -40, y: -15, size: 1.2 },// Saiph (L Knee)
      { x: -35, y: 25, size: 1.8 }, // Rigel (R Knee)
      { x: 55, y: 0, size: 0.8 },   // Meissa (Head)
    ],
    edges: [
      [0, 2], [1, 4],     // Shoulders to Belt
      [2, 3], [3, 4],     // Belt
      [2, 5], [4, 6],     // Belt to Knees
      [0, 7], [1, 7],     // Shoulders to Head
      [0, 1]              // Shoulder to Shoulder
    ],
  },
  {
    name: "Cassiopeia",
    scale: 2,
    points: [
      { x: -30, y: -20, size: 1.2 },
      { x: -15, y: 15, size: 1.1 },
      { x: 0, y: -10, size: 1.4 },
      { x: 15, y: 10, size: 1.3 },
      { x: 30, y: -25, size: 1.2 },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: "Ursa Minor",
    scale: 2.2,
    points: [
      { x: 40, y: 40, size: 1.6 },   // Polaris (North Star)
      { x: 20, y: 25, size: 0.8 },   // Yildun
      { x: 5, y: 10, size: 0.9 },    // Epsilon UMi
      { x: -5, y: -5, size: 1.0 },   // Zeta UMi
      { x: -20, y: -10, size: 1.4 }, // Kochab
      { x: -25, y: -25, size: 1.2 }, // Pherkad
      { x: -10, y: -20, size: 0.9 }, // Eta UMi
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: "Cygnus",
    scale: 2.5,
    points: [
      { x: 0, y: -40, size: 1.6 }, // Deneb
      { x: 0, y: -10, size: 1.1 }, // Sadr
      { x: 0, y: 30, size: 1.2 },  // Albireo
      { x: -35, y: -12, size: 1.2 }, // Gienah
      { x: 35, y: -8, size: 1.1 },  // Fawaris
    ],
    edges: [[0, 1], [1, 2], [1, 3], [1, 4]],
  }
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
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

    // Generate stars
    const numStars = Math.floor((W * H) / 2000);
    const stars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        radius: 0.3 + Math.random() * 1.3,
        opacity: 0.1 + Math.random() * 0.7,
        baseOpacity: 0.1 + Math.random() * 0.7,
        twinkleSpeed: 0.005 + Math.random() * 0.02,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Quadrants for placing constellations nicely
    const getQuadrants = (width: number, height: number) => [
      { x: width * 0.25, y: height * 0.25, angle: -0.2, driftFactor: 0.8 },
      { x: width * 0.75, y: height * 0.35, angle: 0.1, driftFactor: 1.2 },
      { x: width * 0.20, y: height * 0.75, angle: -0.1, driftFactor: 0.6 },
      { x: width * 0.70, y: height * 0.70, angle: 0.3, driftFactor: 1.0 },
    ];

    // Handle mouse move to calculate targeting coordinates (for parallax)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) - 0.5;
      mouseRef.current.targetY = (e.clientY / window.innerHeight) - 0.5;
    };

    // Touch support for mobile
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

      const bgShiftX = mouse.x * 20;
      const bgShiftY = mouse.y * 20;
      const fgShiftX = mouse.x * 40;
      const fgShiftY = mouse.y * 40;

      // 1. Draw and update background stars
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const twinkleFactor = 0.65 + Math.cos(star.twinklePhase) * 0.35;
        star.opacity = star.baseOpacity * twinkleFactor;

        let sx = star.x + bgShiftX;
        let sy = star.y + bgShiftY;

        if (sx < 0) sx = W + (sx % W);
        if (sx > W) sx = sx % W;
        if (sy < 0) sy = H + (sy % H);
        if (sy > H) sy = sy % H;

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        if (star.radius > 1.2 && star.opacity > 0.5) {
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(148, 163, 184, 0.08)`;
          ctx.fill();
        }
      });

      // 2. Draw Constellations with Parallax drift
      const quadrants = getQuadrants(W, H);

      CONSTELLATIONS.forEach((constellation, index) => {
        const q = quadrants[index % quadrants.length];
        
        const cx = q.x + fgShiftX * q.driftFactor;
        const cy = q.y + fgShiftY * q.driftFactor;
        const scale = constellation.scale;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(q.angle);

        ctx.strokeStyle = "rgba(51, 65, 85, 0.08)";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-80 * scale, -80 * scale, 160 * scale, 160 * scale);

        ctx.beginPath();
        constellation.edges.forEach(([startIdx, endIdx]) => {
          const p1 = constellation.points[startIdx];
          const p2 = constellation.points[endIdx];
          ctx.moveTo(p1.x * scale, p1.y * scale);
          ctx.lineTo(p2.x * scale, p2.y * scale);
        });
        ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
        ctx.lineWidth = 0.75;
        ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
        ctx.shadowBlur = 4;
        ctx.stroke();
        
        ctx.shadowBlur = 0;

        constellation.points.forEach((p) => {
          const px = p.x * scale;
          const py = p.y * scale;
          const starSize = (p.size || 1) * 2.0;

          ctx.beginPath();
          ctx.arc(px, py, starSize, 0, Math.PI * 2);
          ctx.fillStyle = "#ffffff";
          ctx.fill();

          const glow = ctx.createRadialGradient(px, py, 0, px, py, starSize * 5);
          glow.addColorStop(0, "rgba(255, 255, 255, 0.35)");
          glow.addColorStop(0.3, "rgba(148, 163, 184, 0.12)");
          glow.addColorStop(1, "rgba(148, 163, 184, 0)");
          ctx.beginPath();
          ctx.arc(px, py, starSize * 5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        });

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
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