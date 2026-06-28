'use client';

import { motion } from 'framer-motion';

const easing = [0.16, 1, 0.3, 1] as const;

interface TechItem {
  name: string;
  icon: string;
}

const techItems: TechItem[] = [
  { name: 'Java', icon: 'java' },
  { name: 'C++', icon: 'cplusplus' },
  { name: 'TypeScript', icon: 'typescript' },
  { name: 'Python', icon: 'python' },
  { name: 'FastAPI', icon: 'fastapi' },
  { name: 'React', icon: 'react' },
  { name: 'Next.js', icon: 'nextdotjs' },
  { name: 'Node.js', icon: 'nodedotjs' },
  { name: 'Tailwind CSS', icon: 'tailwindcss' },
  { name: 'MongoDB', icon: 'mongodb' },
  { name: 'SQL', icon: 'mysql' },
  { name: 'TensorFlow', icon: 'tensorflow' },
  { name: 'Zod', icon: 'zod' },
  { name: 'Rust', icon: 'rust' },
  { name: 'Git', icon: 'git' },
  { name: 'Firebase', icon: 'firebase' },
  { name: 'Vercel', icon: 'vercel' },
  { name: 'JavaScript', icon: 'javascript' },
];

function TechPill({ item, index }: { item: TechItem; index: number }) {
  return (
    <motion.div
      className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-white/[0.08] cursor-default"
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, ease: easing, delay: index * 0.05 }}
      whileHover={{
        scale: 1.05,
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderColor: 'rgba(255,255,255,0.18)',
        boxShadow: '0 0 20px rgba(99,102,241,0.2)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
    >
      <img
        src={`/tech-icons/${item.icon}.svg`}
        alt=""
        width={20}
        height={20}
        className="w-5 h-5 shrink-0"
        style={{ filter: 'brightness(0) invert(0.8)' }}
        loading="lazy"
      />
      <span className="text-sm font-medium text-[#e5e7eb]">{item.name}</span>
    </motion.div>
  );
}

export default function TechStack() {
  return (
    <motion.section
      className="relative py-28 md:py-36 overflow-hidden"
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: easing }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easing }}
        >
          Tech Stack
        </motion.h2>

        <div className="flex flex-wrap gap-3">
          {techItems.map((item, i) => (
            <TechPill key={item.name} item={item} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
