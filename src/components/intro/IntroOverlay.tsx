'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GREETINGS = [
  'Hello.',
  'Bonjour.',
  'Hola.',
  'Ciao.',
  '\u0928\u092e\u0938\u094d\u0924\u0947.',
  '\u3053\u3093\u306b\u3061\u306f.',
  '\uc548\ub155\ud558\uc138\uc694.',
  '\u0645\u0631\u062d\u0628\u0627.',
];

type Phase = 'loading' | 'greeting' | 'outro' | 'done';

const easing = [0.16, 1, 0.3, 1] as const;

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'loading';
    return 'greeting';
  });
  const [greetingIndex, setGreetingIndex] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (phase === 'done' && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete();
    }
  }, [phase, onComplete]);

  useEffect(() => {
    if (phase !== 'greeting') return;

    if (greetingIndex < GREETINGS.length - 1) {
      const timer = setTimeout(() => setGreetingIndex((i) => i + 1), 600); // 600ms per greeting (readable sweet spot)
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase('outro'), 700); // 700ms pause on last greeting
      return () => clearTimeout(timer);
    }
  }, [phase, greetingIndex]);

  useEffect(() => {
    if (phase !== 'done') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  if (phase === 'done') return null;

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 z-50" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0d1b2a] blur-[150px] opacity-70 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#0f766e] blur-[120px] opacity-30 pointer-events-none" />
        <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[300px] h-[600px] rounded-full bg-[#6b21a8] blur-[140px] opacity-25 pointer-events-none" />
        <div className="noise pointer-events-none absolute inset-0" />
        <div className="vignette pointer-events-none absolute inset-0" />
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
      initial={{ y: '0%' }}
      animate={{
        y: phase === 'outro' ? '-100%' : '0%',
      }}
      transition={{
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1], // premium solid curtain slide up
      }}
      onAnimationComplete={() => {
        if (phase === 'outro') {
          setPhase('done');
          onComplete();
        }
      }}
    >
      {/* Blue/Teal radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0d1b2a] blur-[150px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#0f766e] blur-[120px] opacity-30 pointer-events-none" />

      {/* Purple accent left */}
      <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[300px] h-[600px] rounded-full bg-[#6b21a8] blur-[140px] opacity-25 pointer-events-none" />

      {/* Noise texture */}
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {phase === 'greeting' && (
            <motion.span
              key={GREETINGS[greetingIndex]}
              initial={{ opacity: 0, scale: 0.9, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: -12, filter: 'blur(2px)' }}
              transition={{ duration: 0.45, ease: easing }}
              className="text-5xl md:text-6xl lg:text-7xl font-light text-white/90 tracking-tight select-none"
            >
              {GREETINGS[greetingIndex]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
