import dynamic from "next/dynamic";
import { HeroSection } from "./sections/HeroSection";
import { MarqueeSection } from "./sections/MarqueeSection";

// Above-the-fold: eagerly loaded (HeroSection, MarqueeSection above)
// Below-the-fold: lazy-loaded on demand — each becomes its own JS chunk

const AboutSection = dynamic(
  () => import("./sections/AboutSection").then((m) => ({ default: m.AboutSection })),
  { ssr: false }
);
const ServicesSection = dynamic(
  () => import("./sections/ServicesSection").then((m) => ({ default: m.ServicesSection })),
  { ssr: false }
);
const ExperienceSection = dynamic(
  () => import("./sections/ExperienceSection").then((m) => ({ default: m.ExperienceSection })),
  { ssr: false }
);
const SkillsLeetCodeSection = dynamic(
  () => import("./sections/SkillsLeetCodeSection").then((m) => ({ default: m.SkillsLeetCodeSection })),
  { ssr: false }
);
const ProjectsSection = dynamic(
  () => import("./sections/ProjectsSection").then((m) => ({ default: m.ProjectsSection })),
  { ssr: false }
);
const GithubSection = dynamic(
  () => import("./sections/GithubSection").then((m) => ({ default: m.GithubSection })),
  { ssr: false }
);
const CertificatesSection = dynamic(
  () => import("./sections/CertificatesSection").then((m) => ({ default: m.CertificatesSection })),
  { ssr: false }
);
const Footer = dynamic(
  () => import("./ui/Footer").then((m) => ({ default: m.Footer })),
  { ssr: false }
);

const MainPage = () => {
  return (
    <main className="w-full overflow-x-clip bg-background">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ExperienceSection />
      <SkillsLeetCodeSection />
      <ProjectsSection />
      <GithubSection />
      <CertificatesSection />
      <Footer />
    </main>
  );
};

export default MainPage;
