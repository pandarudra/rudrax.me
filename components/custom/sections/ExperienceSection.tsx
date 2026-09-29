"use client";

import { FadeIn } from "../ui/FadeIn";
import { Terminal } from "lucide-react";
import { experiences } from "@/constants";


export const ExperienceSection = () => {
  return (
    <section id="experience" className="bg-[#e8ebe6] dark:bg-[#0e0f0c] transition-colors duration-300 py-14 sm:py-32 px-6 border-t border-[#0e0f0c]/5 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-16">
            <Terminal className="w-7 h-7 sm:w-10 sm:h-10 accent-text" />
            <h2 className="text-4xl sm:text-7xl font-black text-[#0e0f0c] dark:text-white tracking-tight">Experience</h2>
          </div>
        </FadeIn>

        <div className="flex flex-col gap-8 sm:gap-12 border-l-2 border-[#0e0f0c]/10 dark:border-white/10 pl-6 sm:pl-10 ml-4 sm:ml-0">
          {experiences.map((exp, i) => (
            <FadeIn key={i} delay={i * 0.2} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[35px] sm:-left-[51px] top-2 w-5 h-5 rounded-full accent-dot border-4" />

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-3 sm:mb-4 gap-2">
                <h3 className="text-2xl sm:text-4xl font-black text-[#0e0f0c] dark:text-white">{exp.role}</h3>
                <span className="text-sm font-bold accent-text accent-tint px-4 py-1.5 rounded-full whitespace-nowrap w-fit border">
                  {exp.date}
                </span>
              </div>

              <div className="text-lg sm:text-xl font-bold text-[#0e0f0c] dark:text-white mb-4 sm:mb-6">
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline underline-offset-4"
                >
                  {exp.company}
                </a>{" "}
                <span className="opacity-50 text-[#454745] dark:text-[#868685]">| {exp.location}</span>
              </div>

              <ul className="space-y-3 sm:space-y-4 text-[#454745] dark:text-[#868685] font-medium mb-5 sm:mb-8">
                {exp.desc.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="accent-text mt-1.5 opacity-80">▹</span>
                    <span className="leading-relaxed text-[15px] sm:text-[17px]">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                {exp.tech.map((t, j) => (
                  <span key={j} className="px-4 py-1.5 rounded-[24px] bg-white/40 dark:bg-white/5 border-2 border-[#0e0f0c]/5 dark:border-white/10 text-[14px] font-bold text-[#454745] dark:text-[#a0a0a0]">
                    {t}
                  </span>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};
