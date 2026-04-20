'use client';

import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, MotionValue } from 'motion/react';
import { useRef, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ProjectData {
  title: string;
  subtitle?: string;
  description: string;
  link: string;
  color: string;
}

interface CardProps {
  i: number;
  title: string;
  subtitle?: string;
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
  subtitle,
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
      className='h-[55vh] sm:h-[75vh] flex items-center justify-center sticky top-0'
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`relative -top-[10%] sm:-top-[25%] w-[calc(100%-1.5rem)] sm:w-[85%] max-w-[1200px] mx-auto min-h-[320px] sm:h-[420px] rounded-[1.25rem] sm:rounded-[1.5rem] origin-top`}
      >

        {/* Main card body */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 'inherit',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
        >
          {/* Light mode background and border */}
          <div
            className='absolute inset-0 dark:hidden'
            style={{
              background: `
                radial-gradient(90% 62% at 18% 2%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 55%),
                linear-gradient(135deg, #ffffff 0%, #f6f9ff 52%, #eef3ff 100%)
              `,
              border: '1px solid rgba(70, 103, 190, 0.28)',
              borderRadius: '24px',
              boxShadow: `
                0 0 0 1px rgba(255, 255, 255, 0.5) inset,
                0 0 14px rgba(69, 109, 236, 0.2),
                0 10px 24px rgba(26, 44, 94, 0.14)
              `,
            }}
          >
            {/* Inner border effect for light mode */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '24px',
                boxShadow: '0 0 0 1px rgba(59, 108, 244, 0.22) inset',
                pointerEvents: 'none',
              }}
            />
          </div>
          
          {/* Dark mode background and border */}
          <div
            className='absolute inset-0 hidden dark:block'
            style={{
              background: `linear-gradient(180deg, rgba(16, 18, 24, 1), rgba(11, 13, 18, 1))`,
              border: '1px solid rgba(90, 104, 140, 0.28)',
              borderRadius: '24px',
              boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.04) inset`,
            }}
          />

          {/* Animated gradient bottom border - Light mode */}
          <div
            className='absolute bottom-0 left-0 right-0 h-5 dark:hidden z-20'
            style={{
              borderRadius: '0 0 24px 24px',
              pointerEvents: 'none',
              overflow: 'hidden',
              animation: 'borderFlow 8s linear infinite',
              backgroundImage: `repeating-linear-gradient(90deg, 
                rgba(59, 130, 246, 0.8) 0%, 
                rgba(96, 165, 250, 0.9) 12.5%, 
                rgba(147, 197, 253, 0.7) 25%, 
                rgba(59, 130, 246, 0.8) 37.5%, 
                rgba(30, 64, 175, 0.9) 50%, 
                rgba(59, 130, 246, 0.8) 62.5%, 
                rgba(147, 197, 253, 0.7) 75%, 
                rgba(96, 165, 250, 0.9) 87.5%, 
                rgba(59, 130, 246, 0.8) 100%
              )`,
              backgroundSize: '200% 100%',
            }}
          />

          {/* Animated gradient bottom border - Dark mode */}
          <div
            className='absolute bottom-0 left-0 right-0 h-5 hidden dark:block z-20'
            style={{
              borderRadius: '0 0 24px 24px',
              pointerEvents: 'none',
              overflow: 'hidden',
              animation: 'borderFlow 8s linear infinite',
              backgroundImage: `repeating-linear-gradient(90deg, 
                rgba(59, 130, 246, 1) 0%, 
                rgba(96, 165, 250, 1) 12.5%, 
                rgba(147, 197, 253, 0.8) 25%, 
                rgba(59, 130, 246, 1) 37.5%, 
                rgba(37, 99, 235, 1) 50%, 
                rgba(59, 130, 246, 1) 62.5%, 
                rgba(147, 197, 253, 0.8) 75%, 
                rgba(96, 165, 250, 1) 87.5%, 
                rgba(59, 130, 246, 1) 100%
              )`,
              backgroundSize: '200% 100%',
            }}
          />

          {/* Add keyframes for animation */}
          <style>{`
            @keyframes borderFlow {
              from { 
                background-position: 0% 0;
              }
              to { 
                background-position: 200% 0;
              }
            }
          `}</style>

          {/* ── Mobile Layout (flow) ── */}
          <div className='flex sm:hidden flex-col p-5 pt-6 relative z-10 h-full'>
            <p
              style={{
                fontSize: 'clamp(2rem, 10vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1,
                background: `linear-gradient(135deg, #3b82f6, #60a5fa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.25rem',
              }}
            >
              {stepNumber}
            </p>
            <h2 className='text-lg font-bold mb-2 leading-tight text-[rgba(16,24,48,0.96)] dark:text-[rgba(246,248,255,0.96)]'>{title}</h2>
            {subtitle && (
              <p className='text-sm mb-3 text-[rgba(33,48,84,0.85)] dark:text-[rgba(233,239,255,0.85)] leading-relaxed'>
                {subtitle}
              </p>
            )}
            {bullets.length > 0 && bullets[0] !== '' && (
              <ul className='space-y-1.5 flex-1'>
                {bullets.map((bullet, idx) => (
                  <li key={idx} className='flex items-start gap-2 text-sm text-[rgba(33,48,84,0.9)] dark:text-[rgba(233,239,255,0.9)]'>
                    <span style={{ color: '#3b82f6', marginTop: '2px', fontSize: '10px' }}>●</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
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
                  background: `linear-gradient(135deg, #3b82f6, #60a5fa)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                {stepNumber}
              </p>
              <h2 className='text-2xl font-bold mb-3 leading-tight text-[rgba(16,24,48,0.96)] dark:text-[rgba(246,248,255,0.96)]'>{title}</h2>
              {subtitle && (
                <p className='text-base mb-4 text-[rgba(33,48,84,0.85)] dark:text-[rgba(233,239,255,0.85)] leading-relaxed'>
                  {subtitle}
                </p>
              )}
              {bullets.length > 0 && bullets[0] !== '' && (
                <ul className='space-y-2.5'>
                  {bullets.map((bullet, idx) => (
                    <li key={idx} className='flex items-start gap-2.5 text-[0.95rem] leading-snug text-[rgba(33,48,84,0.9)] dark:text-[rgba(233,239,255,0.9)]'>
                      <span style={{ color: '#3b82f6', marginTop: '4px', fontSize: '8px', flexShrink: 0 }}>●</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
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
                  subtitle={project.subtitle}
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
