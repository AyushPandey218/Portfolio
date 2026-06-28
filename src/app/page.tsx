import NavBar from '@/components/sections/NavBar';
import Hero from '@/components/sections/Hero';
import Experience from '@/components/sections/Experience';
import TechStack from '@/components/sections/TechStack';
import Projects from '@/components/sections/Projects';
import Footer from '@/components/sections/Footer';
import SectionDivider from '@/components/ui/SectionDivider';

export default function Home() {
  return (
    <main id="main-content">
      <NavBar />
      <Hero />
      <SectionDivider className="-mt-8" />
      <Experience />
      <SectionDivider />
      <TechStack />
      <SectionDivider />
      <Projects />
      <Footer />
    </main>
  );
}
