'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { Globe } from 'lucide-react';


const easing = [0.16, 1, 0.3, 1] as const;

interface Project {
  name: string;
  year: string;
  tech: string[];
  accent: string;
  link: string;
  code: string;
  tip: string;
}

const projects: Project[] = [
  {
    name: 'FlowDeck',
    year: 'June 2026',
    tech: ['TypeScript', 'Rust', 'JavaScript', 'Kotlin', 'CSS', 'PowerShell'],
    accent: '#0ea5e9',
    link: 'https://github.com/AyushPandey218/FlowDeck/releases/tag/v1.2.0',
    code: 'https://github.com/AyushPandey218/FlowDeck',
    tip: 'Control your Windows PC from your Android phone over your local network',
  },
  {
    name: 'CodeQuest',
    year: 'April 2026',
    tech: ['React', 'Vite', 'Firebase', 'Tailwind CSS'],
    accent: '#22c55e',
    link: 'https://codequest.co.in/',
    code: 'https://github.com/AyushPandey218/Codequest',
    tip: 'Gamified coding platform with real-time execution',
  },
  {
    name: 'Swift Speak',
    year: 'April 2026',
    tech: ['Rust', 'TypeScript', 'CSS'],
    accent: '#3b82f6',
    link: 'https://github.com/AyushPandey218/swift-speak/releases/tag/v0.1.0',
    code: 'https://github.com/AyushPandey218/swift-speak',
    tip: 'High-performance local dictation app for Windows powered by Whisper AI',
  },
  {
    name: 'ResuMate',
    year: 'Dec 2025',
    tech: ['JavaScript', 'CSS', 'HTML'],
    accent: '#f59e0b',
    link: 'https://resumate-murex.vercel.app/',
    code: 'https://github.com/AyushPandey218/ResuMate',
    tip: 'A fully client-side, privacy-first resume builder with live preview',
  },
  {
    name: 'Lexis',
    year: 'Oct 2025',
    tech: ['JavaScript', 'CSS', 'HTML'],
    accent: '#f43f5e',
    link: 'https://lexis-sigma.vercel.app/',
    code: 'https://github.com/AyushPandey218/LEXIS',
    tip: 'Lexis is a fun and interactive word-guessing game inspired by Wordle',
  },
  {
    name: 'Verbo',
    year: 'Jan 2025',
    tech: ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
    accent: '#a855f7',
    link: 'https://verbo-ochre.vercel.app/',
    code: 'https://github.com/AyushPandey218/Verbo',
    tip: 'A real-time chat application with instant messaging, user authentication, and live message sync',
  },
];

function TechList({ tech, accent }: { tech: string[]; accent: string }) {
  return (
    <div
      className="grid grid-cols-2 gap-1.5 max-w-[220px] ml-auto"
      style={{ '--project-accent': accent } as React.CSSProperties}
    >
      {tech.map((t) => (
        <span
          key={t}
          className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-wider uppercase text-[#c8a882]/60 border border-[#c8a882]/20 bg-[#c8a882]/5 transition-all duration-300 group-hover:text-[var(--project-accent)] group-hover:border-[var(--project-accent)]/40 group-hover:bg-[var(--project-accent)]/10 group-hover:shadow-[0_0_8px_var(--project-accent)]/15 group-hover:scale-[1.03] text-center"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const mouseX = useMotionValue(-999);
  const mouseY = useMotionValue(-999);

  useEffect(() => {
    if (!activeProject) return;
    const handleClick = (e: MouseEvent) => {
      const card = cardRefs.current.get(activeProject);
      if (card && !card.contains(e.target as Node)) {
        setActiveProject(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [activeProject]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  const handleMouseLeaveSection = useCallback(() => {
    setHoveredProject(null);
    mouseX.set(-999);
    mouseY.set(-999);
  }, [mouseX, mouseY]);

  return (
    <>
    <motion.section
      id="projects"
      className="relative py-32 md:py-40 overflow-hidden scroll-mt-28 md:scroll-mt-36"
      initial={{ opacity: 0, y: 30, scale: 0.95, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: easing }}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeaveSection}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/2 w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-8 md:px-16 lg:px-24">
        {/* Header */}
        <div className="mb-10">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: easing }}
          >
            My Projects
          </motion.h2>
        </div>

        {/* Project list */}
        <div>
          {projects.map((project, i) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, ease: easing, delay: i * 0.06 }}
              style={i < projects.length - 1 ? { borderBottom: '0.5px solid rgba(200, 168, 130, 0.35)' } : undefined}
              ref={(el) => { if (el) cardRefs.current.set(project.name, el); else cardRefs.current.delete(project.name); }}
            >
              <div
                className="block relative cursor-pointer select-none group"
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => setActiveProject(activeProject === project.name ? null : project.name)}
              >
                <div className="relative rounded-xl -mx-6 px-6 py-12">
                  <div className="flex w-full" style={activeProject === project.name ? { filter: 'blur(4px)' } : undefined}>
                      {/* Left: name + year — slides right on hover */}
                      <motion.div
                        className="flex-1 max-w-[calc(100%-400px)]"
                        animate={{
                          x: hoveredProject?.name === project.name ? 100 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 0.8 }}
                      >
                        <h3
                          className="text-[30px] md:text-[38px] font-semibold leading-tight truncate"
                          style={{ color: project.accent }}
                        >
                          {project.name}
                        </h3>
                        <p className="text-[18px] mt-0.5 text-[#a1a1aa]">
                          {project.year}
                        </p>
                        <motion.p
                          className="text-base text-[#a1a1aa]/60 mt-1.5 leading-relaxed"
                          style={{
                            maxWidth: '360px',
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                          initial={false}
                          animate={{
                            y: hoveredProject?.name === project.name ? 0 : 8,
                            opacity: hoveredProject?.name === project.name ? 1 : 0,
                          }}
                          transition={{ duration: 0.35, ease: easing }}
                        >
                          {project.tip}
                        </motion.p>
                      </motion.div>

                      {/* Right: tech stack — slides left on hover */}
                      <motion.div
                        className="text-right shrink-0 ml-auto"
                        animate={{
                          x: hoveredProject?.name === project.name ? -100 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 200, damping: 30, mass: 0.8 }}
                      >
                        <TechList tech={project.tech} accent={project.accent} />
                      </motion.div>
                    </div>
                  </div>

                {/* Pill dialog popover */}
                <AnimatePresence>
                  {activeProject === project.name && (
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-white/[0.08] shadow-2xl"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.25, ease: easing }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-white bg-white/[0.1] hover:bg-white/[0.18] transition-colors"
                        onClick={() => window.open(project.code, '_blank', 'noopener,noreferrer')}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                        GitHub
                      </button>
                      <span className="text-white/[0.15] text-[8px]">|</span>
                      <button
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-white bg-white/[0.1] hover:bg-white/[0.18] transition-colors"
                        onClick={() => window.open(project.link, '_blank', 'noopener,noreferrer')}
                      >
                        <Globe className="w-3 h-3" />
                        Live
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

      {/* Glass tooltip that follows mouse — only on project hover */}
      <motion.div
        className="fixed z-50 pointer-events-none"
        style={{
          left: mouseX,
          top: mouseY,
          translate: '14px 10px',
          opacity: hoveredProject && !activeProject ? 1 : 0,
        }}
      >
        <div className="px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/[0.06] shadow-lg shadow-black/20">
          <span className="text-[10px] font-medium text-white/50 whitespace-nowrap">click for more info</span>
        </div>
      </motion.div>
    </>
  );
}
