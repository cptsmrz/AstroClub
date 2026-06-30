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

    let angleX = 0.4;  // Tilt angle of Saturn's system
    let angleY = 0;    // Continuous orbital spin

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - W / 2;
      const my = e.clientY - rect.top - H / 2;
      mouseRef.current.targetX = mx * 0.0015;
      mouseRef.current.targetY = my * 0.0015;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    const radius = 95; // Radius of Saturn's core sphere
    const cx = W / 2;
    const cy = H / 2;

    // 3D Point Projection Helper (with exact sphere occlusion culling)
    const project = (x: number, y: number, z: number) => {
      // Rotation on Y-axis (Spin + Mouse X offset)
      const cosY = Math.cos(angleY + mouseRef.current.x);
      const sinY = Math.sin(angleY + mouseRef.current.x);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotation on X-axis (Tilt + Mouse Y offset)
      const cosX = Math.cos(angleX + mouseRef.current.y);
      const sinX = Math.sin(angleX + mouseRef.current.y);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      // Perspective scale factor
      const fov = 420;
      const scale = fov / (fov + z2);

      const sx = cx + x1 * scale;
      const sy = cy + y2 * scale;

      // Occlusion check: if the point is behind the planet's center (z2 > 0)
      // and falls within the 2D projected boundaries of the sphere core, it's occluded
      const dist3DToAxis = x1 * x1 + y2 * y2;
      const isOccluded = z2 > 0 && dist3DToAxis < radius * radius;

      return {
        x: sx,
        y: sy,
        z: z2,
        visible: !isOccluded
      };
    };

    let animationFrameId: number;

    // Saturn's actual major moons
    const moons = [
      { name: "Tethys", orbit: radius * 1.35, size: 2.0, speed: 1.8, color: "#94a3b8", tilt: 0.12 },
      { name: "Dione", orbit: radius * 1.70, size: 2.4, speed: 1.3, color: "#cbd5e1", tilt: -0.08 },
      { name: "Rhea", orbit: radius * 2.10, size: 3.0, speed: 0.8, color: "#e2e8f0", tilt: 0.18 },
      { name: "Titan", orbit: radius * 2.65, size: 5.0, speed: 0.4, color: "#f59e0b", tilt: -0.04 }
    ];

    const render = () => {
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      angleY += 0.0035; // Orbital time tick

      ctx.clearRect(0, 0, W, H);

      // 1. Draw glowing atmosphere (Saturn's corona)
      const atmosphereGlow = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.4);
      atmosphereGlow.addColorStop(0, "rgba(224, 242, 254, 0)");
      atmosphereGlow.addColorStop(0.65, "rgba(56, 189, 248, 0.05)");
      atmosphereGlow.addColorStop(1, "rgba(56, 189, 248, 0)");
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw Saturn's Sphere Grid Lines (only front-facing halves compile due to project() visibility checks)
      const numGridLines = 9;
      
      // Latitude Lines
      for (let j = 1; j < numGridLines; j++) {
        const phi = (Math.PI / numGridLines) * j;
        const ringRadius = radius * Math.sin(phi);
        const ringY = radius * Math.cos(phi);

        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= 60; i++) {
          const theta = (Math.PI * 2 / 60) * i;
          const rx = ringRadius * Math.cos(theta);
          const rz = ringRadius * Math.sin(theta);

          const pt = project(rx, ringY, rz);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
        ctx.stroke();
      }

      // Longitude Lines
      for (let j = 0; j < numGridLines; j++) {
        const theta = (Math.PI * 2 / numGridLines) * j;
        
        ctx.beginPath();
        let first = true;
        for (let i = 0; i <= 60; i++) {
          const phi = (Math.PI / 60) * i;
          const rx = radius * Math.sin(phi) * Math.cos(theta);
          const ry = radius * Math.cos(phi);
          const rz = radius * Math.sin(phi) * Math.sin(theta);

          const pt = project(rx, ry, rz);
          if (pt.visible) {
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
        ctx.stroke();
      }

      // 3. Draw Saturn's Flat Rings (rendered as concentric layers in the equatorial plane, y = 0)
      const rings = [
        { inner: radius * 1.35, outer: radius * 1.55, color: "rgba(56, 189, 248, 0.12)" }, // C Ring (Faint Inner)
        { inner: radius * 1.60, outer: radius * 1.95, color: "rgba(186, 230, 253, 0.28)" }, // B Ring (Bright Mid)
        { inner: radius * 2.02, outer: radius * 2.25, color: "rgba(14, 165, 233, 0.18)" }  // A Ring (Outer)
      ];

      rings.forEach((ring) => {
        // Draw concentric segments with 2px increments to fill the disk density
        for (let r = ring.inner; r <= ring.outer; r += 2) {
          ctx.beginPath();
          let first = true;
          for (let i = 0; i <= 90; i++) {
            const theta = (Math.PI * 2 / 90) * i;
            const rx = r * Math.cos(theta);
            const rz = r * Math.sin(theta);
            
            const pt = project(rx, 0, rz);
            if (pt.visible) {
              if (first) {
                ctx.moveTo(pt.x, pt.y);
                first = false;
              } else {
                ctx.lineTo(pt.x, pt.y);
              }
            } else {
              first = true;
            }
          }
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      });

      // 4. Draw Orbiting Moons
      moons.forEach((moon) => {
        const theta = angleY * moon.speed;
        const mx = moon.orbit * Math.cos(theta);
        const mz = moon.orbit * Math.sin(theta);
        
        // Inclined orbit calculations
        const cosTilt = Math.cos(moon.tilt);
        const sinTilt = Math.sin(moon.tilt);
        const my = mx * sinTilt;
        const finalX = mx * cosTilt;

        // Render Orbit Line
        let firstOrbit = true;
        for (let k = 0; k <= 72; k++) {
          const t = (Math.PI * 2 / 72) * k;
          const ox = moon.orbit * Math.cos(t);
          const oz = moon.orbit * Math.sin(t);
          const oy = ox * sinTilt;
          const fx = ox * cosTilt;
          const opt = project(fx, oy, oz);

          ctx.strokeStyle = opt.z > 0 ? "rgba(148, 163, 184, 0.05)" : "rgba(148, 163, 184, 0.18)";

          if (firstOrbit) {
            ctx.beginPath();
            ctx.moveTo(opt.x, opt.y);
            firstOrbit = false;
          } else {
            ctx.lineTo(opt.x, opt.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(opt.x, opt.y);
          }
        }

        // Render Moon Node
        const pt = project(finalX, my, mz);
        if (pt.visible) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, moon.size, 0, Math.PI * 2);
          ctx.fillStyle = moon.color;
          
          // Moons in the foreground glow
          if (pt.z < 0) {
            ctx.shadowColor = moon.color;
            ctx.shadowBlur = moon.size * 2;
          }
          ctx.fill();
          ctx.shadowBlur = 0; // reset glow

          // Draw Label for major moon
          ctx.fillStyle = "rgba(148, 163, 184, 0.75)";
          ctx.font = "9px monospace";
          ctx.fillText(moon.name, pt.x + 6, pt.y + 3);
        }
      });

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
        className="w-full h-full cursor-pointer pointer-events-auto"
      />
    </div>
  );
}
