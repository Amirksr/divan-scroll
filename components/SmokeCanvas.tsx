'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  speed: number;
  drift: number;
  alpha: number;
}

function makeParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: height + Math.random() * 200,
    r: (40 + Math.random() * 90) * (typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1),
    speed: (0.15 + Math.random() * 0.35) * (typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1),
    drift: (Math.random() - 0.5) * 0.3,
    alpha: 0.02 + Math.random() * 0.05,
  };
}

interface SmokeCanvasProps {
  active: boolean;
  particleCount?: number;
  className?: string;
}

export default function SmokeCanvas({ active, particleCount = 26, className }: SmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof devicePixelRatio !== 'undefined' ? devicePixelRatio : 1;

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      particlesRef.current = Array.from({ length: particleCount }, () =>
        makeParticle(canvas.width, canvas.height)
      );
    };

    resize();
    window.addEventListener('resize', resize);

    if (!active) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return () => window.removeEventListener('resize', resize);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        p.y -= p.speed;
        p.x += p.drift;
        if (p.y + p.r < 0) {
          Object.assign(p, makeParticle(canvas.width, canvas.height), { y: canvas.height + p.r });
        }
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(237,230,214,${p.alpha})`);
        grad.addColorStop(1, 'rgba(237,230,214,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, particleCount]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
