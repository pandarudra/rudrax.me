"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Sparkles, Code2, Cpu, Database, Globe, Layout, Smartphone, Zap } from "lucide-react";

const TechItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
  <div className="flex items-center gap-3 px-8 py-4 bg-secondary/85 rounded-full border border-border shadow-sm">
    <Icon className="w-6 h-6 text-primary" />
    <span className="text-xl font-medium tracking-wide">{label}</span>
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
    { icon: Code2, label: "React.js" },
    { icon: Layout, label: "Next.js" },
    { icon: Zap, label: "Svelte" },
    { icon: Globe, label: "Tailwind CSS" },
    { icon: Code2, label: "TypeScript" },
    { icon: Code2, label: "JavaScript" },
    { icon: Cpu, label: "C++" },
  ];

  const row2 = [
    { icon: Database, label: "Node.js" },
    { icon: Cpu, label: "Express.js" },
    { icon: Zap, label: "Socket.IO" },
    { icon: Database, label: "SQL" },
    { icon: Smartphone, label: "React Native" },
    { icon: Sparkles, label: "NestJS" },
    { icon: Globe, label: "Canvas API" },
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
