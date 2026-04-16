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

  return (
    <div
      ref={container}
      className='h-screen flex items-center justify-center sticky top-0'
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={`relative -top-[25%] w-[100%] max-w-[2400px] h-[480px] rounded-[2.5rem] origin-top overflow-hidden`}
      >
        <div className='absolute top-6 left-12'>
          <p className='text-lg font-semibold text-white/80'>Paso {i + 1}</p>
        </div>
        <div className='absolute top-14 left-0 right-0'>
          <h2 className='text-4xl text-center font-bold text-white'>{title}</h2>
        </div>
        <div className='absolute top-36 left-12 w-[35%]'>
          <p className='text-xl leading-relaxed text-white'>{description}</p>
        </div>
        <div className='absolute top-32 right-12' style={{ width: '300px', height: '280px' }}>
          <div className='w-full h-full rounded-2xl overflow-hidden'>
            <motion.div
              className='w-full h-full'
              style={{ scale: imageScale }}
            >
              <img
                src={url}
                alt='image'
                style={{ width: '300px', height: '280px', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
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
