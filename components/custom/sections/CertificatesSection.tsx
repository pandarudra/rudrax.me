"use client";

import React, { useRef, useState, useEffect } from "react";
import { FadeIn } from "../ui/FadeIn";
import { ArrowRight, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { certificates } from "@/constants/certificate.c";


const getBgClass = (iconColor: string) => {
  if (iconColor.includes("blue")) return "bg-blue-500/10 border-blue-500/20";
  if (iconColor.includes("slate")) return "bg-slate-500/10 border-slate-500/20";
  if (iconColor.includes("emerald")) return "bg-emerald-500/10 border-emerald-500/20";
  if (iconColor.includes("rose")) return "bg-rose-500/10 border-rose-500/20";
  return "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10";
};

const getIconClass = (iconColor: string) => {
  if (iconColor.includes("blue")) return "text-blue-600 dark:text-blue-400";
  if (iconColor.includes("slate")) return "text-slate-600 dark:text-slate-400";
  if (iconColor.includes("emerald")) return "text-emerald-600 dark:text-emerald-400";
  if (iconColor.includes("rose")) return "text-rose-600 dark:text-rose-400";
  return "text-[#0e0f0c] dark:text-white";
};

interface CertificateData {
  title: string;
  issuer: string;
  date: string;
  color?: string;
  iconColor: string;
  url?: string;
  image_url?: string;
}

const StaticCard = ({ cert }: { cert: CertificateData }) => {
  const bgClass = getBgClass(cert.iconColor);
  const iconColor = getIconClass(cert.iconColor);

  return (
    <div className={`flex-shrink-0 w-65 sm:w-[360px] h-52.5 sm:h-60 p-5 sm:p-8 rounded-[24px] border ${bgClass} flex flex-col justify-between items-start transition-all duration-300 hover:border-[#0e0f0c]/20 dark:hover:border-white/20`}>
      <div className="w-full">
        {cert.image_url ? (
          <div className="w-10 h-10 sm:w-12 sm:h-12 mb-4 sm:mb-6 rounded-full overflow-hidden bg-white/50 dark:bg-black/50 p-1">
            <img src={cert.image_url} alt={cert.title} className="w-full h-full object-contain" />
          </div>
        ) : (
          <div className={`p-3 rounded-[14px] bg-white dark:bg-[#0a0a0a] w-fit mb-4 sm:mb-6 shadow-sm border border-[#0e0f0c]/5 dark:border-white/5`}>
            <Award className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}

        <h3 className="text-[18px] sm:text-[20px] font-bold mb-2 text-[#0e0f0c] dark:text-white tracking-tight leading-snug line-clamp-2">{cert.title}</h3>
        <p className="text-[#454745] dark:text-[#868685] font-medium text-[13px] truncate">
          {cert.issuer}
        </p>
      </div>

      <div className="w-full flex justify-between">
        <span className="text-[13px] font-bold text-[#0e0f0c] dark:text-white">
          {cert.date}
        </span>
        <a
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs md:text-sm cursor-pointer hover:underline underline-offset-4 flex items-center gap-2 font-bold text-[#0e0f0c] dark:text-white"
        >
          View
          <ArrowRight className="size-3" />
        </a>
      </div>
    </div>
  );
};

export const CertificatesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [allCertificates, setAllCertificates] = useState<CertificateData[]>(certificates);

  useEffect(() => {
    const fetchCredlyBadges = async () => {
      try {
        const res = await fetch("/api/credly");
        if (!res.ok) return;
        const data = await res.json();
        if (data.data) {
          const credlyCerts: CertificateData[] = data.data.map((badge: {
            badge_template: { name: string; image_url?: string };
            issuer?: { entities?: { entity?: { name: string } }[]; summary?: string };
            issued_at_date?: string;
            id: string;
            image_url?: string;
          }) => {
            return {
              title: badge.badge_template.name,
              issuer: badge.issuer?.entities?.[0]?.entity?.name || badge.issuer?.summary?.replace('issued by ', '') || "Credly",
              date: badge.issued_at_date ? badge.issued_at_date.split('-')[0] : "",
              color: "from-amber-500/20 to-amber-500/5",
              iconColor: "text-amber-500",
              url: `https://www.credly.com/badges/${badge.id}/public_url`,
              image_url: badge.image_url || badge.badge_template?.image_url,
            };
          });
          setAllCertificates(prev => {
            // Avoid duplicates if called twice in dev mode
            const existingTitles = new Set(prev.map(c => c.title));
            const newCerts = credlyCerts.filter((c) => !existingTitles.has(c.title));
            return [...prev, ...newCerts];
          });
        }
      } catch (err) {
        console.error("Failed to fetch credly badges", err);
      }
    };
    fetchCredlyBadges();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth < 640 ? 320 : 380;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="certificates" className="py-14 sm:py-32 bg-[#e8ebe6] dark:bg-[#0e0f0c] transition-colors duration-300 relative z-20 border-t border-[#0e0f0c]/5 dark:border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <FadeIn>
          <div className="flex items-center justify-between px-6 lg:px-12 mb-6 sm:mb-12">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0e0f0c] dark:text-white">
              Certificates
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll('left')}
                className="size-9 sm:size-10 rounded-full border border-[#0e0f0c]/10 dark:border-white/10 flex items-center justify-center text-[#0e0f0c] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="size-9 sm:size-10 rounded-full border border-[#0e0f0c]/10 dark:border-white/10 flex items-center justify-center text-[#0e0f0c] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        </FadeIn>

        <div className="relative w-full pl-6 lg:pl-12">
          <div
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pr-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {allCertificates.map((cert) => (
              <div key={cert.title} className="snap-start">
                <FadeIn delay={0.05} y={20}>
                  <StaticCard cert={cert} />
                </FadeIn>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
};

