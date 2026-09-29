// Single source of truth for profile content. Read by the UI sections,
// JSON-LD (app/page.tsx), and the /llms.txt + /llms-full.txt routes.

export const SITE_URL = "https://www.rudrax.me";

export const profile = {
  name: "Rudramadhab Panda",
  shortName: "Rudra",
  handle: "pandarudra",
  title: "Full-Stack Developer",
  email: "rudrapanda8206@gmail.com",
  bio: "I build digital experiences that don't just work, they resonate. From lightning-fast interfaces to battle-tested backend systems, I create products that are elegant, scalable, and impossible to ignore.",
  philosophy:
    "I thrive at the intersection of performance and aesthetics. From orchestrating distributed backends to compiling lightning-fast reactive UIs, I engineer digital experiences that scale without compromising on pixel-perfect design.",
  resume: "/files/rudra_resume.pdf",
};

export const socials = {
  github: "https://github.com/pandarudra",
  linkedin: "https://www.linkedin.com/in/rudra826/",
  x: "https://x.com/rudra_826",
};

export const education = {
  degree: "B.Tech in Information Technology",
  school: "Odisha University of Technology and Research",
  cgpa: "9.178 / 10",
};

export const experiences = [
  {
    role: "Full Stack Developer Intern",
    company: "Orbits+",
    companyUrl: "https://www.linkedin.com/company/orbits-plus/posts/?feedView=all",
    location: "Cardiff, UK (Remote)",
    date: "Feb 2026 - Present",
    desc: [
      "Designed scalable component architectures and state-management solutions across 20+ reusable components, reducing UI defects by 20% and improving development velocity.",
      "Architected high-performance interfaces in SvelteKit, cutting bundle size by 25% and improving page-load speed by 15% through compile-time optimization.",
      "Integrated frontend applications with 15+ backend APIs, reducing response latency by 30% and improving real-time data synchronization across distributed user workflows.",
    ],
    tech: ["SvelteKit", "TypeScript", "Docker", "Azure"],
  },
  {
    role: "Full Stack Developer Intern",
    company: "GoMind AI LLC",
    companyUrl: "https://www.linkedin.com/company/aigomind/posts/?feedView=all",
    location: "Austin, Texas (Remote)",
    date: "Oct 2025 – Dec 2025",
    desc: [
      "Optimized backend services with NestJS and PostgreSQL, improving API performance and cutting average response times by 35%.",
      "Managed AWS deployment workflows and CI/CD pipelines, improving release reliability and reducing deployment time by 40%.",
      "Led frontend development in React Native, delivering 10+ production features across MVP and post-MVP releases.",
    ],
    tech: ["React Native", "NestJS", "PostgreSQL", "AWS"],
  },
];

export const services = [
  {
    num: "01",
    title: "Frontend Engineering",
    desc: "Building highly performant, reactive user interfaces with React, Next.js, and SvelteKit. Focused on scalable architectures and smooth UX.",
  },
  {
    num: "02",
    title: "Backend Architecture",
    desc: "Designing robust, scalable APIs and microservices using Node.js, Express, and NestJS, with real-time capabilities via Socket.IO.",
  },
  {
    num: "03",
    title: "Cloud & DevOps",
    desc: "Configuring and managing deployments on AWS and Azure, Dockerizing applications, and implementing CI/CD pipelines.",
  },
];

export const skillCategories = [
  { title: "Languages", skills: ["C", "C++", "JavaScript", "TypeScript"] },
  {
    title: "Core CS",
    skills: ["Data Structures", "Algorithms", "OOP", "Operating Systems", "Complexity Analysis"],
  },
  {
    title: "Backend & Distributed Systems",
    skills: ["Node.js", "Express.js", "NestJS", "Socket.IO", "WebRTC", "BullMQ"],
  },
  { title: "Frontend", skills: ["React.js", "Next.js", "SvelteKit", "React Native", "Tailwind CSS"] },
  { title: "Databases", skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma"] },
  { title: "Cloud & Tools", skills: ["AWS", "Azure", "Docker", "Git", "GitHub", "Linux", "Postman"] },
];

export const codingStats: { label: string; highlight?: string; value: string; width: string }[] = [
  { label: "LeetCode Rating", highlight: "1717", value: "Top 11% Globally", width: "89%" },
  { label: "CodeChef Starters 175", value: "Rank 606 / 30,523", width: "98%" },
  { label: "HackNITR Hackathon", value: "Top 200 / 3,000", width: "93.3%" },
];

export const milestones = [
  { title: "SAP Certified Associate", desc: "Back-End Developer, ABAP Cloud." },
  { title: "Hacktoberfest Contributor", desc: "Active open-source contributor ('24, '25 editions)." },
  { title: "Top HackNITR Innovator", desc: "Ranked in the top 200 out of over 3000 competitors." },
];
