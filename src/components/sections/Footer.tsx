'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const easing = [0.16, 1, 0.3, 1] as const;

const footerLinks = [
  { label: 'Home', href: '/#hero' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Resume', href: '/resume.pdf', download: 'Ayush_Pandey_Resume.pdf' },
];

export default function Footer() {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.substring(1); // '#hero', '#projects'
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.footer
      id="footer"
      className="relative py-24 md:py-32 overflow-hidden scroll-mt-28 md:scroll-mt-36"
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: easing }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-8 md:px-16 lg:px-24">
        <motion.div
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 md:p-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: easing }}
        >
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            {/* Left: Name */}
            <div>
              <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                AYUSH
                <br />
                PANDEY.
              </h3>
            </div>

            {/* Right: Links */}
            <div className="grid grid-cols-2 gap-10">
              {/* Explore */}
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-white/20 mb-5">
                  Explore
                </p>
                <ul className="space-y-3">
                  {footerLinks.map((link) => (
                    <li key={link.label}>
                      {'download' in link ? (
                        <a
                          href={link.href}
                          download={link.download}
                          className="text-sm text-white/40 hover:text-white transition-all duration-300"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={(e) => handleClick(e, link.href)}
                          className="text-sm text-white/40 hover:text-white transition-all duration-300"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-white/20 mb-5">
                  Connect
                </p>
                <ul className="space-y-3">
                  <li>
                    <a
                      href="mailto:hello@ayushpandey.dev"
                      className="text-sm text-white/40 hover:text-white transition-all duration-300"
                    >
                      Email
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/AyushPandey218"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/40 hover:text-white transition-all duration-300"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://linkedin.com/in/ayushpandey0618"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/40 hover:text-white transition-all duration-300"
                    >
                      LinkedIn
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://instagram.com/ayush_wg218"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/40 hover:text-white transition-all duration-300"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Copyright */}
        <p className="mt-8 text-xs text-white/10 text-center">
          &copy; {new Date().getFullYear()} Ayush Pandey. Built with intention.
        </p>
      </div>
    </motion.footer>
  );
}
