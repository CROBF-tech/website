'use client';

import { useTransform, useSpring, motion, useScroll, MotionValue } from 'motion/react';
import { useEffect, useRef, forwardRef } from 'react';

interface ProjectData {
  title: string;
  subtitle?: string;
  description: string;
  link: string;
  color: string;
}

interface CardProps {
  i: number;
  total: number;
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
  total,
  title,
  subtitle,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const restY = i * 14;
  const isLast = i === total - 1;
  const rawScale = useTransform(progress, range, [1, targetScale]);
  const rawY = useTransform(progress, range, [restY, isLast ? restY : restY - 640]);

  const spring = { stiffness: 260, damping: 32, mass: 0.6 };
  const scale = useSpring(rawScale, spring);
  const y = useSpring(rawY, spring);

  // Parse bullet points from description (separated by |)
  const bullets = description.split('|').map(b => b.trim());
  const stepNumber = String(i + 1).padStart(2, '0');

  return (
      <motion.div
        style={{
          scale,
          y,
          zIndex: total - i,
        }}
        className={`absolute top-8 sm:top-12 left-0 right-0 mx-auto w-[calc(100%-1.5rem)] sm:w-[85%] max-w-[1200px] h-[440px] sm:h-[420px] max-h-[calc(100%-2rem)] rounded-[1.25rem] sm:rounded-[1.5rem] origin-top`}
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
              </div>
            </div>
          </div>
        </div>
      </motion.div>
  );
};

interface ComponentRootProps {
  projects: ProjectData[];
}

const Component = forwardRef<HTMLElement, ComponentRootProps>(
  ({ projects }, ref) => {
    const container = useRef<HTMLElement>(null);
    const pinRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
      target: container,
      offset: ['start start', 'end end'],
    });

    // CSS `position: sticky` is unreliable here (breaks under GSAP
    // ScrollTrigger + Astro's client-island wrapper), so the pin is done
    // manually with position: fixed, the same technique GSAP's own
    // ScrollTrigger `pin: true` uses under the hood.
    useEffect(() => {
      const wrap = container.current;
      const pin = pinRef.current;
      if (!wrap || !pin) return;

      const update = () => {
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;

        // position:fixed is relative to the viewport, not the (centered,
        // width-constrained) content column, so left/width must be copied
        // over by hand whenever the pin is fixed to avoid a horizontal jump.
        if (rect.top > 0) {
          pin.style.position = 'absolute';
          pin.style.top = '0px';
          pin.style.bottom = '';
          pin.style.left = '0px';
          pin.style.width = '100%';
        } else if (rect.bottom < vh) {
          pin.style.position = 'absolute';
          pin.style.top = '';
          pin.style.bottom = '0px';
          pin.style.left = '0px';
          pin.style.width = '100%';
        } else {
          pin.style.position = 'fixed';
          pin.style.top = '0px';
          pin.style.bottom = '';
          pin.style.left = `${rect.left}px`;
          pin.style.width = `${rect.width}px`;
        }
      };

      update();
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      return () => {
        window.removeEventListener('scroll', update);
        window.removeEventListener('resize', update);
      };
    }, []);

    // Each card gets a full screen height of scroll to shrink/exit in, but
    // the last one just sits still (nothing to animate), so give it a much
    // shorter hold instead of a full screen — otherwise the section drags
    // on with a long static pause before the next section appears.
    const lastVh = 25;
    const perCardVh = 75;
    const totalVh = (projects.length - 1) * perCardVh + lastVh;
    const segmentStart = (i: number) => (i * perCardVh) / totalVh;

    return (
      <main ref={container} style={{ height: `${totalVh}vh` }} className='relative'>
        <section ref={pinRef} className='absolute left-0 h-screen w-full'>
          {projects.map((project, i) => {
            const isLast = i === projects.length - 1;
            const targetScale = isLast ? 1 : 0.9;
            return (
              <Card
                key={`p_${i}`}
                i={i}
                total={projects.length}
                url={project.link}
                title={project.title}
                subtitle={project.subtitle}
                color={project.color}
                description={project.description}
                progress={scrollYProgress}
                range={[segmentStart(i), isLast ? 1 : segmentStart(i + 1)]}
                targetScale={targetScale}
              />
            );
          })}
        </section>
      </main>
    );
  }
);

Component.displayName = 'Component';

export default Component;
