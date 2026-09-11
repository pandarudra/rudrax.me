"use client";

import { AnimatedText } from "../ui/AnimatedText";
import { FadeIn } from "../ui/FadeIn";
import { motion } from "motion/react";
import {
  GraduationCap,
  Trophy,
  Code2,
  Award,
  ChevronRight,
  BookOpen
} from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="relative sm:min-h-screen flex flex-col justify-center px-6 py-14 sm:py-28 bg-[#e8ebe6] dark:bg-[#0e0f0c] overflow-hidden border-t border-[#0e0f0c]/5 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto w-full z-10">
        <FadeIn>
          <div className="flex flex-col items-center text-center mb-8 sm:mb-20">
            <h2 className="text-4xl sm:text-7xl font-black tracking-tight text-[#0e0f0c] dark:text-white">
              About Me
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 w-full items-stretch">

          {/* LEFT COLUMN: Philosophy & Interactive Code Stats */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">

            {/* Philosophy Card */}
            <FadeIn delay={0.1} className="p-8 sm:p-10 bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 rounded-[24px] hidden md:flex flex-col justify-between flex-1 shadow-sm transition-all duration-300 hover:shadow-xl">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest accent-text mb-5 block">Core Philosophy</span>
                <AnimatedText
                  text="I thrive at the intersection of performance and aesthetics. From orchestrating distributed backends to compiling lightning-fast reactive UIs, I engineer digital experiences that scale without compromising on pixel-perfect design."
                  className="text-2xl sm:text-3xl font-black leading-relaxed text-[#0e0f0c] dark:text-white"
                />
              </div>
            </FadeIn>

            {/* coding metrics */}
            <FadeIn delay={0.2} className="p-5 sm:p-10 bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 rounded-[24px] shadow-sm transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-5 sm:mb-8">
                <Code2 className="w-6 h-6 accent-text" />
                <h3 className="text-lg sm:text-xl font-black text-[#0e0f0c] dark:text-white">Competitive & Algo Stats</h3>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* LeetCode Stat */}
                <div>
                  <div className="flex justify-between text-[14px] mb-2 font-bold">
                    <span className="text-[#0e0f0c] dark:text-white">LeetCode Rating: <span className="accent-text">1717</span></span>
                    <span className="text-[#454745] dark:text-[#868685]">Top 11% Globally</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "89%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                      className="accent-bg h-full rounded-full"
                    />
                  </div>
                </div>

                {/* CodeChef Stat */}
                <div>
                  <div className="flex justify-between text-[14px] mb-2 font-bold">
                    <span className="text-[#0e0f0c] dark:text-white">CodeChef Starters 175</span>
                    <span className="text-[#454745] dark:text-[#868685]">Rank 606 / 30,523</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "98%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                      className="accent-bg h-full rounded-full"
                    />
                  </div>
                </div>

                {/* HackNITR Stat */}
                <div>
                  <div className="flex justify-between text-[14px] mb-2 font-bold">
                    <span className="text-[#0e0f0c] dark:text-white">HackNITR Hackathon</span>
                    <span className="text-[#454745] dark:text-[#868685]">Top 200 / 3,000</span>
                  </div>
                  <div className="w-full bg-black/5 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "93.3%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      className="accent-bg h-full rounded-full"
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT COLUMN: Education & Achievements (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col gap-4 sm:gap-6">

            {/* Education Card */}
            <FadeIn delay={0.3} className="p-5 sm:p-10 bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 rounded-[24px] shadow-sm transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-5 sm:mb-8">
                <GraduationCap className="w-6 h-6 accent-text" />
                <h3 className="text-lg sm:text-xl font-black text-[#0e0f0c] dark:text-white">Education</h3>
              </div>

              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0e0f0c] dark:text-white mb-2">B.Tech in Information Technology</p>
                <div className="flex items-center gap-2 text-[#454745] dark:text-[#868685] text-[15px] font-bold mb-4 sm:mb-6">
                  <BookOpen className="w-4 h-4" />
                  <span>Odisha University of Technology and Research</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[24px] accent-tint text-[14px] font-black accent-text">
                  <Award className="w-4 h-4" />
                  <span>CGPA: 9.178 / 10</span>
                </div>
              </div>
            </FadeIn>

            {/* Achievements Card */}
            <FadeIn delay={0.4} className="p-5 sm:p-10 bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 rounded-[24px] flex-1 shadow-sm transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-5 sm:mb-8">
                <Trophy className="w-6 h-6 accent-text" />
                <h3 className="text-lg sm:text-xl font-black text-[#0e0f0c] dark:text-white">Key Milestones</h3>
              </div>

              <ul className="space-y-4 sm:space-y-6">
                <li className="flex items-start gap-4 group/item">
                  <div className="mt-1 accent-tint p-1.5 rounded-full accent-text group-hover/item:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[16px] font-black text-[#0e0f0c] dark:text-white">SAP Certified Associate</span>
                    <p className="text-[14px] text-[#454745] dark:text-[#868685] font-medium mt-1">Back-End Developer, ABAP Cloud.</p>
                  </div>
                </li>

                <li className="flex items-start gap-4 group/item">
                  <div className="mt-1 accent-tint p-1.5 rounded-full accent-text group-hover/item:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[16px] font-black text-[#0e0f0c] dark:text-white">Hacktoberfest Contributor</span>
                    <p className="text-[14px] text-[#454745] dark:text-[#868685] font-medium mt-1">Active open-source contributor ('24, '25 editions).</p>
                  </div>
                </li>

                <li className="flex items-start gap-4 group/item">
                  <div className="mt-1 accent-tint p-1.5 rounded-full accent-text group-hover/item:scale-110 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[16px] font-black text-[#0e0f0c] dark:text-white">Top HackNITR Innovator</span>
                    <p className="text-[14px] text-[#454745] dark:text-[#868685] font-medium mt-1">Ranked in the top 200 out of over 3000 competitors.</p>
                  </div>
                </li>
              </ul>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};
