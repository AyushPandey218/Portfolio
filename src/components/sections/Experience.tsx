'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const easing = [0.16, 1, 0.3, 1] as const;

interface Entry {
  company: string;
  role: string;
  period: string;
  description: string;
  logo: string;
  logoImage?: string;
}

const workData: Entry[] = [
  {
    company: 'FlyRank AI',
    role: 'Front-end AI Engineering Intern',
    period: 'Jun 2026 — Present',
    description:
      'Currently interning at FlyRank AI as an AI intern, focusing on Front-end AI Engineering. Working remotely from Bosnia and Herzegovina.',
    logo: 'A',
    logoImage: '/flyrank_logo.jpeg',
  },
];

const educationData: Entry[] = [
  {
    company: 'K.R. Mangalam University',
    role: 'Master of Computer Applications (AI & ML)',
    period: 'Sept 2026 — Present',
    description:
      'Pursuing specialization in Artificial Intelligence and Machine Learning, focusing on advanced neural networks, deep learning, and advanced intelligent systems.',
    logo: 'K',
    logoImage: '/krmu-logo.jpeg',
  },
  {
    company: 'K.R. Mangalam University',
    role: 'Bachelor of Computer Applications (AI & DS)',
    period: 'Sept 2023 — May 2026 · Graduated',
    description:
      'Specialized in Artificial Intelligence and Data Science with coursework in machine learning, deep learning, data analytics, and intelligent systems.',
    logo: 'K',
    logoImage: '/krmu-logo.jpeg',
  },
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState<'work' | 'education'>('work');
  const data = activeTab === 'work' ? workData : educationData;

  return (
    <motion.section
      id="experience"
      className="relative py-32 md:py-40 overflow-hidden"
      initial={{ opacity: 0, y: 30, scale: 0.9, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: easing }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto px-8 md:px-16 lg:px-24">
        {/* Title */}
        <motion.h2
          className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easing }}
        >
          Experience
        </motion.h2>

        {/* Tab switcher */}
        <div className="flex bg-white/[0.04] rounded-xl p-[6px] w-full mb-8">
          <button
            onClick={() => setActiveTab('work')}
            className={`flex-1 px-6 py-2 text-sm rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'work' ? 'bg-white text-[#0a0a0a]' : 'text-[#a1a1aa] font-medium'
            }`}
          >
            Work
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`flex-1 px-6 py-2 text-sm rounded-full font-semibold transition-all duration-300 ${
              activeTab === 'education' ? 'bg-white text-[#0a0a0a]' : 'text-[#a1a1aa] font-medium'
            }`}
          >
            Education
          </button>
        </div>

        {/* Timeline container */}
        <motion.div
          className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 md:p-8"
          style={{ backdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easing, delay: 0.1 }}
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: easing }}
            className="space-y-8"
          >
            {data.map((entry, i) => (
              <motion.div
                key={`${entry.company}-${entry.role}`}
                className="group relative flex gap-5 rounded-xl p-3 -mx-3 transition-colors duration-300 hover:bg-white/[0.06]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: easing, delay: i * 0.1 }}
              >
                {/* Left: logo + vertical line */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-12 h-12 md:w-[48px] md:h-[48px] rounded-full bg-white shrink-0 overflow-hidden">
                    {entry.logoImage ? (
                      <Image
                        src={entry.logoImage}
                        alt={entry.company}
                        fill
                        className={activeTab === 'work' ? 'object-cover' : 'object-contain p-1.5'}
                        sizes="48px"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[#0a0a0a]">{entry.logo}</span>
                    )}
                  </div>
                  {i === data.length - 1 && (
                    <div className="w-[2px] h-8 bg-gradient-to-b from-white/[0.15] to-transparent" />
                  )}
                </div>

                {i < data.length - 1 && (
                  <div className="absolute left-[35px] top-[60px] bottom-[-44px] w-[2px] bg-white/[0.15]" />
                )}

                {/* Right: content */}
                <motion.div
                  className="pb-8 group-hover:translate-x-1 transition-transform duration-300"
                >
                  <p className="text-sm text-[#a1a1aa] mb-1">{entry.period}</p>
                  <h3 className="text-lg font-semibold text-white">{entry.role}</h3>
                  <p className="text-sm text-[#a1a1aa] mb-1.5">{entry.company}</p>
                  <p className="text-sm text-[#d4d4d8] leading-relaxed">
                    {entry.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
