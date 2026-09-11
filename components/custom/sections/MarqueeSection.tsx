"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiSvelte,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiCplusplus,
  SiNodedotjs,
  SiExpress,
  SiSocketdotio,
  SiPostgresql,
  SiNestjs,
  SiWebrtc,
} from "react-icons/si";

const TechItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
  <div className="flex items-center justify-center gap-3 p-4 sm:px-8 sm:py-4 bg-secondary/85 rounded-full border border-border shadow-sm">
    <Icon className="w-6 h-6 text-primary shrink-0" />
    <span className="hidden sm:inline text-xl font-medium tracking-wide">{label}</span>
  </div>
);

export const MarqueeSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-500, 0]);

  const row1 = [
    { icon: SiReact, label: "React.js" },
    { icon: SiNextdotjs, label: "Next.js" },
    { icon: SiSvelte, label: "SvelteKit" },
    { icon: SiTailwindcss, label: "Tailwind CSS" },
    { icon: SiTypescript, label: "TypeScript" },
    { icon: SiJavascript, label: "JavaScript" },
    { icon: SiCplusplus, label: "C++" },
  ];

  const row2 = [
    { icon: SiNodedotjs, label: "Node.js" },
    { icon: SiExpress, label: "Express.js" },
    { icon: SiSocketdotio, label: "Socket.IO" },
    { icon: SiPostgresql, label: "PostgreSQL" },
    { icon: SiReact, label: "React Native" },
    { icon: SiNestjs, label: "NestJS" },
    { icon: SiWebrtc, label: "WebRTC" },
  ];

  // Tripling for seamless scroll
  const seamlessRow1 = [...row1, ...row1, ...row1];
  const seamlessRow2 = [...row2, ...row2, ...row2];

  return (
    <section ref={containerRef} className="py-24 overflow-hidden bg-background relative">
      <div className="flex flex-col gap-6 w-full">
        <motion.div style={{ x: x1 }} className="flex gap-6 w-max">
          {seamlessRow1.map((item, i) => (
            <TechItem key={`r1-${i}`} icon={item.icon} label={item.label} />
          ))}
        </motion.div>
        
        <motion.div style={{ x: x2 }} className="flex gap-6 w-max">
          {seamlessRow2.map((item, i) => (
            <TechItem key={`r2-${i}`} icon={item.icon} label={item.label} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
