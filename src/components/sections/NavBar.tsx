'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useReplayIntro } from '@/components/providers/IntroProvider';

const navItems = [
  { label: 'Home', href: '/#hero' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Contact', href: '/#footer' },
];

export default function NavBar() {
  const pathname = usePathname();
  const { showIntro } = useReplayIntro();

  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const timer = setTimeout(() => {
          const el = document.querySelector(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 250); // slight delay to allow rendering and Lenis mount
        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      const hash = href.substring(1); // '#hero', '#projects', '#footer'
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isActive = (item: typeof navItems[number]) => {
    if (item.href === '/about') {
      return pathname === '/about';
    }
    return pathname === '/' && item.label === 'Home';
  };

  if (showIntro) return null;

  const isHome = pathname === '/';

  return (
    <motion.nav
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
      initial={isHome ? { opacity: 0, y: -20, scale: 0.9 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={isHome ? { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 } : { duration: 0 }}
    >
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.1]">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={(e) => handleClick(e, item.href)}
            className={`relative px-5 py-2 text-sm rounded-full transition-all duration-300 ${
              isActive(item)
                ? 'text-white border border-white/[0.15] bg-white/[0.04]'
                : 'text-white/40 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}
