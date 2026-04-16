'use client';

import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProjectData {
  title: string;
  description: string;
  link: string;
  color: string;
}

interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

export const Card = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  // Parse bullet points from description (separated by |)
  const bullets = description.split('|').map(b => b.trim());
  const stepNumber = String(i + 1).padStart(2, '0');

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0'
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`relative -top-[25%] w-[calc(100%-1.5rem)] sm:w-[85%] max-w-[1200px] mx-auto min-h-[320px] sm:h-[420px] rounded-[1.25rem] sm:rounded-[1.5rem] origin-top`}
      >
        {/* Colored accent border */}
        <div
          style={{
            position: 'absolute',
            inset: '-1.5px',
            borderRadius: '26px',
            background: `linear-gradient(135deg, ${color}90 0%, ${color}30 40%, transparent 60%, ${color}20 100%)`,
            zIndex: -1,
            pointerEvents: 'none',
          }}
        />

        {/* Main card body — dark glass */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 'inherit',
            borderRadius: '24px',
            background: `linear-gradient(145deg, rgba(20, 20, 28, 0.97), rgba(12, 12, 18, 0.99))`,
            border: `1px solid ${color}25`,
            boxShadow: `
              0 8px 40px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.06)
            `,
            overflow: 'hidden',
          }}
        >
          {/* Subtle inner glow from accent color */}
          <div
            style={{
              position: 'absolute',
              top: '-40%',
              left: '-20%',
              width: '60%',
              height: '80%',
              background: `radial-gradient(ellipse, ${color}12 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* ── Mobile Layout (flow) ── */}
          <div className='flex sm:hidden flex-col p-5 pt-6 relative z-10 h-full'>
            <p
              style={{
                fontSize: 'clamp(2rem, 10vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1,
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}
            >
              {stepNumber}
            </p>
            <h2 className='text-lg font-bold text-white mb-3 leading-tight'>{title}</h2>
            <ul className='space-y-1.5 flex-1'>
              {bullets.map((bullet, idx) => (
                <li key={idx} className='flex items-start gap-2 text-sm text-white/80'>
                  <span style={{ color, marginTop: '2px', fontSize: '10px' }}>●</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Desktop Layout ── */}
          <div className='hidden sm:flex h-full relative z-10'>
            {/* Left side — text content */}
            <div className='flex flex-col justify-center px-10 py-8 w-[55%]'>
              <p
                style={{
                  fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                  fontWeight: 800,
                  lineHeight: 1,
                  background: `linear-gradient(135deg, ${color}, ${color}80)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                {stepNumber}
              </p>
              <h2 className='text-2xl font-bold text-white mb-4 leading-tight'>{title}</h2>
              <ul className='space-y-2.5'>
                {bullets.map((bullet, idx) => (
                  <li key={idx} className='flex items-start gap-2.5 text-[0.95rem] text-white/80 leading-snug'>
                    <span style={{ color, marginTop: '4px', fontSize: '8px', flexShrink: 0 }}>●</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side — media */}
            <div className='w-[45%] flex items-center justify-center p-6'>
              <div
                className='w-full h-full max-h-[320px] rounded-xl overflow-hidden'
                style={{
                  border: `1px solid ${color}20`,
                  boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4), 0 0 60px ${color}10`,
                }}
              >
                <motion.div
                  className='w-full h-full'
                  style={{ scale: imageScale }}
                >
                  {/\.(mp4|webm|mov)(\?|$)/i.test(url) ? (
                    <video
                      src={url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <img
                      src={url}
                      alt={title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface ComponentRootProps {
  projects: ProjectData[];
}

const Component = forwardRef<HTMLElement, ComponentRootProps>(
  ({ projects }, ref) => {
    const container = useRef(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ['start start', 'end end'],
    });

    return (
      <ReactLenis root>
        <main ref={container}>
          <section>
            {projects.map((project, i) => {
              const targetScale = 1 - (projects.length - i) * 0.05;
              return (
                <Card
                  key={`p_${i}`}
                  i={i}
                  url={project.link}
                  title={project.title}
                  color={project.color}
                  description={project.description}
                  progress={scrollYProgress}
                  range={[i * 0.25, 1]}
                  targetScale={targetScale}
                />
              );
            })}
          </section>
        </main>
      </ReactLenis>
    );
  }
);

Component.displayName = 'Component';

export default Component;
