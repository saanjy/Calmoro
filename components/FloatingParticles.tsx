import React, { useEffect, useRef } from 'react';
import { TimerMode } from '../types';

interface FloatingParticlesProps {
  isDarkMode: boolean;
  mode?: TimerMode;
  count?: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  vx: number;
  vy: number;
  wobbleSpeed: number;
  wobblePhase: number;
  wobbleAmp: number;
  isAccent: boolean;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  isDarkMode,
  mode = TimerMode.POMODORO,
  count = 42,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Color definitions based on mode & dark/light theme
    const getAccentRGB = (m: TimerMode, dark: boolean): [number, number, number] => {
      switch (m) {
        case TimerMode.SHORT_BREAK:
          return dark ? [94, 234, 212] : [13, 148, 136]; // Teal
        case TimerMode.LONG_BREAK:
          return dark ? [165, 180, 252] : [79, 70, 229]; // Indigo
        case TimerMode.POMODORO:
        default:
          return dark ? [253, 164, 175] : [225, 29, 72]; // Rose / Coral
      }
    };

    const getBaseRGB = (dark: boolean): [number, number, number] => {
      // Warm white/cream in dark mode, subtle warm slate/amber in light mode
      return dark ? [245, 240, 235] : [120, 113, 108];
    };

    // Create particles
    const particles: Particle[] = [];
    const particleCount = Math.max(20, Math.min(count, Math.floor((width * height) / 28000)));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8, // 0.8px - 3px
        baseAlpha: Math.random() * 0.28 + 0.08, // Subtle: 0.08 - 0.36
        alpha: Math.random() * 0.28 + 0.08,
        pulseSpeed: Math.random() * 0.015 + 0.006,
        pulsePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.16, // Very slight lateral drift
        vy: -(Math.random() * 0.22 + 0.08), // Upward floating motion like dust in calm sunbeam
        wobbleSpeed: Math.random() * 0.012 + 0.006,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleAmp: Math.random() * 0.6 + 0.2,
        isAccent: Math.random() < 0.35, // ~35% of particles carry subtle mode accent
      });
    }

    // Render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 16.67, 2.5); // Normalized to ~60fps
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const accentRGB = getAccentRGB(mode, isDarkMode);
      const baseRGB = getBaseRGB(isDarkMode);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Pulse alpha smoothly
          p.pulsePhase += p.pulseSpeed * delta;
          const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5; // 0 to 1
          p.alpha = p.baseAlpha * (0.65 + 0.5 * pulse);

          // Lateral wave + upward drift
          p.wobblePhase += p.wobbleSpeed * delta;
          const wobble = Math.sin(p.wobblePhase) * p.wobbleAmp;

          p.x += (p.vx + wobble * 0.15) * delta;
          p.y += p.vy * delta;

          // Wrap boundaries
          if (p.y < -15) {
            p.y = height + 10;
            p.x = Math.random() * width;
          } else if (p.y > height + 15) {
            p.y = -10;
          }

          if (p.x < -15) {
            p.x = width + 10;
          } else if (p.x > width + 15) {
            p.x = -10;
          }
        }

        const [r, g, b] = p.isAccent ? accentRGB : baseRGB;

        // Draw soft particle
        if (p.radius > 1.6) {
          // Soft glowing aura for larger particles
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.2);
          grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.alpha})`);
          grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.4})`);
          grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Crisp delicate mote for tiny particles
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha * 0.85})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    if (prefersReducedMotion) {
      // Just render one calm static frame
      render(performance.now());
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDarkMode, mode, count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none select-none z-[1]"
      style={{
        mixBlendMode: isDarkMode ? 'screen' : 'multiply',
      }}
      aria-hidden="true"
    />
  );
};

export default FloatingParticles;
