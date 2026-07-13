'use client';

import { motion } from 'framer-motion';
import NavBar from '@/components/sections/NavBar';
import TechStack from '@/components/sections/TechStack';
import Footer from '@/components/sections/Footer';
import SectionDivider from '@/components/ui/SectionDivider';

const easing = [0.16, 1, 0.3, 1] as const;

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white overflow-hidden pb-16">
      {/* Background radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0d1b2a] blur-[150px] opacity-70 animate-ambient" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#0f766e] blur-[120px] opacity-30 animate-ambient" />

        <div className="noise pointer-events-none absolute inset-0 opacity-20" />
        <div className="vignette pointer-events-none absolute inset-0" />
      </div>

      {/* Floating Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12">
        {/* Hero Section */}
<motion.div
  className="
    flex
    flex-col
    justify-center
    items-center
    text-center
    py-32

  "
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    duration: 0.8,
    ease: easing,
  }}
>
<h1
  style={{
    fontSize: '100px',
    fontWeight: 700,
    lineHeight: 0.9,
    letterSpacing: '-0.06em',
    color: '#fff',
    marginBottom: '48px', 
  }}
>
  Hi, I&apos;m Ayush Pandey.
</h1>

  <p
    className="
      text-[18px]
      md:text-[22px]
      text-white/60
      max-w-4xl
      leading-[1.8]
      font-light
    "
  >
    A Full-Stack Developer passionate about building modern web applications,
    developer tools, and digital products. I enjoy turning ideas into polished
    experiences and working across the entire product journey — from concept and
    design to development and deployment. I&apos;m constantly exploring new
    technologies and pushing myself to create products that solve real problems
    and deliver great user experiences.
  </p>
</motion.div>

        <SectionDivider />

        <div className="mt-12">
          <TechStack />
        </div>

        <SectionDivider />

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </main>
  );
}