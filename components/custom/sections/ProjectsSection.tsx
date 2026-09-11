"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink, Github, FileCode } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { projects } from "@/constants";

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const ProjectsSection = () => {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <section
      id="projects"
      className="bg-[#e8ebe6] dark:bg-[#0e0f0c] py-24 sm:py-32 px-6 border-t border-[#0e0f0c]/5 dark:border-white/5 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0e0f0c] dark:text-white mb-10">
            Projects
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-3xl border border-[#0e0f0c]/10 dark:border-white/10 overflow-hidden bg-white dark:bg-[#121311]">
            {/* window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#0e0f0c]/10 dark:border-white/10 bg-[#e8ebe6]/60 dark:bg-black/20">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-[#d03238]" />
                <div className="size-2.5 rounded-full bg-[#ffd11a]" />
                <div className="size-2.5 rounded-full bg-[#2ead4b]" />
              </div>
              <span className="ml-3 font-mono text-[12px] text-[#868685]">~/projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
              {/* file list */}
              <div className="border-b md:border-b-0 md:border-r border-[#0e0f0c]/10 dark:border-white/10 p-2 flex md:block gap-2 overflow-x-auto md:overflow-visible">
                {projects.map((p, i) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setActive(i)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-mono text-[13px] text-left whitespace-nowrap transition-colors ${
                      i === active
                        ? "bg-[#0e0f0c] text-white dark:bg-white dark:text-[#0e0f0c]"
                        : "text-[#454745] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    <FileCode className="size-4 shrink-0 opacity-70" />
                    <span className="truncate">{slug(p.name)}.tsx</span>
                  </button>
                ))}
              </div>

              {/* detail pane */}
              <div className="p-6 sm:p-10 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="font-mono text-[11px] uppercase tracking-widest accent-text mb-2">
                      {project.category}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#0e0f0c] dark:text-white mb-5">
                      {project.name}
                    </h3>

                    <div className="rounded-2xl overflow-hidden border border-[#0e0f0c]/10 dark:border-white/10 mb-6 aspect-video bg-[#e8ebe6] dark:bg-black">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-[#454745] dark:text-[#868685] font-medium leading-relaxed mb-8">
                      {project.desc}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#0e0f0c]/10 dark:border-white/10 text-[13px] font-bold text-[#0e0f0c] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      >
                        <Github className="size-4" />
                        Source
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl accent-bg text-[13px] font-bold transition-colors"
                        >
                          <ExternalLink className="size-4" />
                          Live
                        </a>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
