'use client';

import { motion } from 'framer-motion';

export default function SectionDivider({ className }: { className?: string }) {
  return (
    <div className={`relative w-full flex items-center justify-center py-8 px-6 ${className ?? ''}`}>
      <motion.div
        className="w-full max-w-5xl h-[2px]"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
