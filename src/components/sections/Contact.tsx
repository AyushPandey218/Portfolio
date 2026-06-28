'use client';

import { motion } from 'framer-motion';

const easing = [0.16, 1, 0.3, 1] as const;

const links = [
  {
    label: 'Email',
    href: 'mailto:hello@ayushpandey.dev',
    value: 'hello@ayushpandey.dev',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/AyushPandey218',
    value: 'github.com/AyushPandey218',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/ayushpandey0618',
    value: 'linkedin.com/in/ayushpandey0618',
  },
  {
    label: 'Resume',
    href: '/resume.pdf',
    value: 'Download PDF',
  },
];

export default function Contact() {
  return (
    <section className="relative py-32 md:py-48 overflow-hidden" id="contact">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/[0.04] blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-24 text-center">
        {/* Label */}
        <motion.p
          className="text-xs tracking-[0.2em] uppercase text-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing }}
        >
          Get In Touch
        </motion.p>

        {/* Large CTA */}
        <motion.h2
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1] mb-16"
          initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easing, delay: 0.1 }}
        >
          Let&apos;s build
          <br />
          something
          <br />
          <span className="text-white/20">extraordinary.</span>
        </motion.h2>

        {/* Contact links */}
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easing, delay: 0.3 }}
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex items-center gap-4 py-2 text-sm text-white/30 hover:text-white transition-all duration-300"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 w-20 text-right">
                {link.label}
              </span>
              <span className="w-px h-4 bg-white/[0.06] group-hover:bg-white/20 transition-colors duration-300" />
              <span className="text-white/50 group-hover:text-white transition-colors duration-300">
                {link.value}
              </span>
              <svg
                className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-all duration-300 group-hover:translate-x-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
