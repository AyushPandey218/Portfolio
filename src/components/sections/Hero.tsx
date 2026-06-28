'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const easing = [0.16, 1, 0.3, 1] as const;

const prefixes = ['FULLSTACK', 'FRONTEND', 'WEB'];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.5 },
  },
};

const fadeUpScale = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easing },
  },
};

function ImageSwap({
  src1,
  src2,
  alt,
  fallback,
  className,
}: {
  src1: string;
  src2: string;
  alt: string;
  fallback: string;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-white/[0.04]`}>
        <span className="text-lg font-bold text-white/80">{fallback}</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`${className} relative overflow-hidden cursor-pointer`}
      animate={{ rotate: hover ? -20 : 0, scale: hover ? 1.5 : 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        src={hover ? src2 : src1}
        alt={alt}
        fill
        sizes="56px"
        quality={100}
        className="object-cover object-center"
        style={{ rotate: hover ? '20deg' : '0deg' }}
        onError={() => setError(true)}
        priority
      />
    </motion.div>
  );
}

function ContactBtn({ href }: { href: string }) {
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      href={href}
      className="relative shrink-0 inline-flex items-center gap-2.5 px-8 py-4 rounded-full border border-white/20 bg-white/[0.03] text-sm font-medium overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.4)' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ color: hover ? '#ffffff' : 'rgba(255,255,255,0.8)', transition: 'color 0.5s ease' }}
    >
      {/* Shimmer sweep */}
      <motion.span
        className="absolute inset-0 -skew-x-12"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        initial={{ backgroundPosition: '200% 0' }}
        animate={{ backgroundPosition: hover ? '-200% 0' : '200% 0' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <span className="relative z-10">Contact me</span>
      <span className="relative z-10 flex items-center justify-center w-5 h-5">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: hover ? 'translateX(2px)' : 'translateX(0)',
            transition: 'transform 0.4s ease',
          }}
        >
          <path d="M22 2L11 13" />
          <path d="M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </span>
    </motion.a>
  );
}

function TiltIcon({ href, label, path }: { href: string; label: string; path: string }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [shine, setShine] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setRotate({ x: -deltaY * 15, y: deltaX * 15 });
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    setShine({ x: px, y: py });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setHover(false);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/40 overflow-hidden"
      aria-label={label}
      style={{ perspective: 600 }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y, scale: hover ? 1.25 : 1, borderColor: hover ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        className="w-4 h-4 relative z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ color: hover ? '#ffffff' : undefined }}
      >
        <path d={path} />
      </svg>
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: hover
            ? `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`
            : 'transparent',
          transition: 'background 0.1s ease',
        }}
      />
    </motion.a>
  );
}

export default function Hero() {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing');
  const [roleIndex, setRoleIndex] = useState(0);
  const [hover, setHover] = useState(false);


  useEffect(() => {
    const currentPrefix = prefixes[roleIndex];

    if (phase === 'typing') {
      if (text.length < currentPrefix.length) {
        const timeout = setTimeout(
          () => setText(currentPrefix.slice(0, text.length + 1)),
          50 + Math.random() * 60,
        );
        return () => clearTimeout(timeout);
      }
      setTimeout(() => setPhase('pause'));
    } else if (phase === 'pause') {
      const timeout = setTimeout(() => setPhase('deleting'), 2000);
      return () => clearTimeout(timeout);
    } else if (phase === 'deleting') {
      if (text.length > 0) {
        const timeout = setTimeout(
          () => setText(text.slice(0, -1)),
          25 + Math.random() * 25,
        );
        return () => clearTimeout(timeout);
      }
      setTimeout(() => {
        setPhase('typing');
        setRoleIndex((prev) => (prev + 1) % prefixes.length);
      });
    }
  }, [phase, text, roleIndex]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0a0a0a' }}
    >
      {/* Blue/Teal radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0d1b2a] blur-[150px] opacity-70 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#0f766e] blur-[120px] opacity-30 pointer-events-none" />

      {/* Purple accent left */}
      <div className="absolute left-[-10%] top-1/2 -translate-y-1/2 w-[300px] h-[600px] rounded-full bg-[#6b21a8] blur-[140px] opacity-25 pointer-events-none" />

      {/* Noise texture */}
      <div className="noise pointer-events-none absolute inset-0" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Profile section: avatar + name + location */}
          <motion.div
            variants={fadeUpScale}
            className="flex items-center gap-4 mb-10"
          >
            <ImageSwap
              src1="/avatar-1.jpg"
              src2="/avatar-2.jpg"
              alt="Ayush Pandey"
              fallback="AP"
              className="w-14 h-14 rounded-full border-2 border-white/20"
            />
            <div className="text-left">
              <p className="text-lg font-bold text-white">Ayush Pandey.</p>
              <p className="text-sm text-white/50 flex items-center gap-1.5 mt-0.5">
                <svg className="w-5 h-4 inline-block" viewBox="0 0 60 40">
                  <rect width="60" height="40" fill="#FF9933" />
                  <rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
                  <rect y="26.67" width="60" height="13.33" fill="#138808" />
                  <circle cx="30" cy="20" r="5" fill="#000080" />
                  <circle cx="30" cy="20" r="4.5" fill="none" stroke="#000080" strokeWidth="1.5" />
                  {[...Array(24)].map((_, i) => (
                    <line
                      key={i}
                      x1="30"
                      y1="0"
                      x2="30"
                      y2="40"
                      stroke="#000080"
                      strokeWidth="0.3"
                      transform={`rotate(${i * 15} 30 20)`}
                    />
                  ))}
                </svg>
                <motion.span
                  className="cursor-default inline-block"
                  key={hover ? 'h' : 'n'}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  {hover ? '🤍 HALA MADRID!' : 'Based in India'}
                </motion.span>
              </p>
            </div>
          </motion.div>

          {/* Heading + CTA row */}
          <motion.div
            variants={fadeUpScale}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 w-full mb-8"
          >
            <h1 className="relative text-[clamp(2.5rem,10vw,7rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white text-center sm:text-left">
              <span>
                {text}
                <span className="inline-block w-[3px] h-[1em] bg-white/70 ml-1 align-middle -mt-0.5 animate-pulse" />
              </span>
              <br />
              <span className="text-white/70">DEVELOPER</span>
            </h1>
            <ContactBtn href="mailto:ayushpandey0618@gmail.com" />
          </motion.div>

          {/* Social icons */}
          <motion.div
            variants={fadeUpScale}
            className="flex items-center justify-center gap-5"
          >
            {[
              { href: 'https://linkedin.com/in/ayushpandey0618', label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              { href: 'https://instagram.com/ayush_wg218', label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { href: 'https://github.com/AyushPandey218', label: 'GitHub', path: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
            ].map(({ href, label, path }) => (
              <TiltIcon key={label} href={href} label={label} path={path} />
            ))}
          </motion.div>

          {/* Download Resume Button */}
          <motion.div
            variants={fadeUpScale}
            className="mt-6"
          >
            <a
              href="/resume.pdf"
              download="Ayush_Pandey_Resume.pdf"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/20 bg-white/[0.03] text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-white/[0.02]"
            >
              <svg
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Resume</span>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">Scroll</span>
        <svg
          className="w-5 h-8 text-white/30"
          viewBox="0 0 20 32"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="2" width="16" height="28" rx="8" />
          <motion.circle
            cx="10"
            cy="10"
            r="2"
            fill="currentColor"
            stroke="none"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
      </motion.div>
    </section>
  );
}
