"use client";

import React, { useEffect, useState } from "react";
import { FadeIn } from "../ui/FadeIn";
import { ExternalLink, Code2, BrainCog, Server, Layout, Database, Cloud } from "lucide-react";
import { leetcode_username } from "@/constants";

interface LeetCodeData {
  totalSolved: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  ranking: number;
  acceptanceRate: number;
  contestAttend: number;
  contestRating: number;
  contestGlobalRanking: number;
  totalParticipants: number;
  contestTopPercentage: number;
  contestParticipation: { rating: number; startTime: number }[];
}

const CircularProgress = ({ 
  value, 
  max, 
  label, 
  colorClass 
}: { 
  value: number; 
  max: number; 
  label: string; 
  colorClass: string; 
}) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  // Prevent division by zero
  const safeMax = max > 0 ? max : 1; 
  const strokeDashoffset = circumference - (value / safeMax) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-[#0e0f0c]/10 dark:stroke-white/10"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className={`stroke-current ${colorClass}`}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s ease-in-out" }}
          />
        </svg>
        <span className="absolute text-xl font-bold text-[#0e0f0c] dark:text-white">{value}</span>
      </div>
      <span className="text-sm font-medium text-[#454745] dark:text-[#868685]">{label}</span>
    </div>
  );
};

const ContestLineGraph = ({ data }: { data: { rating: number; startTime: number }[] }) => {
  if (!data || data.length === 0) return <div className="h-[120px]" />;

  const minRating = Math.min(...data.map(d => d.rating));
  const maxRating = Math.max(...data.map(d => d.rating));
  const range = maxRating - minRating || 1;

  // viewBox 0 0 400 120
  const width = 400;
  const height = 120;
  const paddingY = 20; // top/bottom padding
  const graphHeight = height - paddingY * 2;
  
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2;
    const y = paddingY + graphHeight - ((d.rating - minRating) / range) * graphHeight;
    return `${x},${y}`;
  });
  
  const linePath = `M ${points.join(' L ')}`;
  
  // Get the last point to draw the dot
  const lastX = data.length > 1 ? width : width / 2;
  const lastY = paddingY + graphHeight - ((data[data.length - 1].rating - minRating) / range) * graphHeight;

  return (
    <div className="w-full h-[120px] relative mt-8">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <path
          d={linePath}
          fill="none"
          className="stroke-[#ffb800]"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={lastX}
          cy={lastY}
          r="4"
          fill="#fff"
          className="stroke-[#ffb800]"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Label for the last point */}
      <div 
        className="absolute px-2 py-1 bg-[#282828] border border-white/10 rounded-[6px] text-xs text-white font-mono"
        style={{
          left: `100%`,
          top: `${(lastY / height) * 100}%`,
          transform: 'translate(-100%, 12px)'
        }}
      >
        {Math.round(data[data.length - 1].rating)}
      </div>
      
      <div className="absolute bottom-[-10px] left-0 text-xs font-bold text-[#868685]">
        2024
      </div>
      <div className="absolute bottom-[-10px] right-0 text-xs font-bold text-[#868685]">
        2025
      </div>
    </div>
  );
};

const ContestBarChart = ({ topPercentage }: { topPercentage: number }) => {
  // Simulate a normal distribution (bell curve) of 24 bars
  const numBars = 24;
  const bars = Array.from({ length: numBars }).map((_, i) => {
    const x = (i - (numBars / 2 - 0.5)) / (numBars / 6); 
    const val = Math.exp(-0.5 * x * x);
    return Math.max(0.05, val); // min height
  });

  // Highlight the bar corresponding to top %
  // top 20% means 80th percentile.
  const targetIndex = Math.floor(((100 - topPercentage) / 100) * numBars);
  const safeIndex = Math.max(0, Math.min(numBars - 1, targetIndex));

  return (
    <div className="w-full h-[100px] flex items-end justify-between gap-[2px] sm:gap-[4px] mt-10">
      {bars.map((val, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t-[2px] transition-all ${
            i === safeIndex 
              ? "bg-[#ffb800]" // Highlight color
              : "bg-[#0e0f0c]/20 dark:bg-white/20"
          }`}
          style={{ height: `${val * 100}%` }}
        />
      ))}
    </div>
  );
};

export const SkillsLeetCodeSection = () => {
  const [lcData, setLcData] = useState<LeetCodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheKey = `leetcode_data_${leetcode_username}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const { timestamp, data } = JSON.parse(cached);
          // Cache for 1 hour (3600000 ms)
          if (Date.now() - timestamp < 3600000) {
            setLcData(data);
            setLoading(false);
            return;
          }
        }

        const [statsRes, contestRes] = await Promise.all([
          fetch(`https://leetcode-api-faisalshohag.vercel.app/${leetcode_username}`),
          fetch(`https://alfa-leetcode-api.onrender.com/${leetcode_username}/contest`)
        ]);
        let data: any = {};
        let contestData: any = {};

        if (statsRes.ok) {
          try { data = await statsRes.json(); } catch(e) {}
        }
        if (contestRes.ok) {
          try { contestData = await contestRes.json(); } catch(e) {}
        }
        
        const totalSubmissions = data.matchedUserStats?.totalSubmissionNum?.find((d: any) => d.difficulty === "All")?.submissions || 1;
        const acSubmissions = data.matchedUserStats?.acSubmissionNum?.find((d: any) => d.difficulty === "All")?.submissions || 0;
        
        const validParticipation = contestData.contestParticipation
          ? contestData.contestParticipation.filter((c: any) => c.attended).map((c: any) => ({
              rating: c.rating,
              startTime: c.contest.startTime
            }))
          : [];

        const parsedData = {
          totalSolved: data.totalSolved || 0,
          easySolved: data.easySolved || 0,
          totalEasy: data.totalEasy || 1000,
          mediumSolved: data.mediumSolved || 0,
          totalMedium: data.totalMedium || 2000,
          hardSolved: data.hardSolved || 0,
          totalHard: data.totalHard || 1000,
          ranking: data.ranking || 0,
          acceptanceRate: Number(((acSubmissions / totalSubmissions) * 100).toFixed(1)),
          
          contestAttend: contestData.contestAttend || 0,
          contestRating: contestData.contestRating || 0,
          contestGlobalRanking: contestData.contestGlobalRanking || 0,
          totalParticipants: contestData.totalParticipants || 0,
          contestTopPercentage: contestData.contestTopPercentage || 0,
          contestParticipation: validParticipation,
        };

        // Only cache if we actually got valid data to prevent caching empty/error states
        if (data.totalSolved || contestData.contestAttend) {
          localStorage.setItem(cacheKey, JSON.stringify({
            timestamp: Date.now(),
            data: parsedData
          }));
        }

        setLcData(parsedData);
      } catch (err) {
        console.error("Failed to fetch LeetCode data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const skillCategories = [
    {
      title: "Languages",
      icon: <Code2 className="w-4 h-4" />,
      skills: ["C", "C++", "JavaScript", "TypeScript"]
    },
    {
      title: "Core CS",
      icon: <BrainCog className="w-4 h-4" />,
      skills: ["Data Structures", "Algorithms", "OOP", "Operating Systems", "Complexity Analysis"]
    },
    {
      title: "Backend & Distributed Systems",
      icon: <Server className="w-4 h-4" />,
      skills: ["Node.js", "Express.js", "NestJS", "Socket.IO", "WebRTC", "BullMQ"]
    },
    {
      title: "Frontend",
      icon: <Layout className="w-4 h-4" />,
      skills: ["React.js", "Next.js", "SvelteKit", "React Native", "Tailwind CSS"]
    },
    {
      title: "Databases",
      icon: <Database className="w-4 h-4" />,
      skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma"]
    },
    {
      title: "Cloud & Tools",
      icon: <Cloud className="w-4 h-4" />,
      skills: ["AWS", "Azure", "Docker", "Git", "GitHub", "Linux", "Postman"]
    }
  ];

  return (
    <section id="skills" className="py-24 sm:py-32 bg-white dark:bg-[#121311] transition-colors duration-300 relative z-20 border-t border-[#0e0f0c]/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* SKILLS SECTION */}
        <div className="mb-24">
          <FadeIn>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0e0f0c] dark:text-white mb-10">
              Skills
            </h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {skillCategories.map((category, idx) => (
              <FadeIn key={category.title} delay={idx * 0.1} y={20}>
                <div className="h-full p-8 rounded-[24px] bg-[#e8ebe6] dark:bg-[#1a1b19] border border-[#0e0f0c]/5 dark:border-white/5 transition-all hover:border-[#0e0f0c]/10 dark:hover:border-white/10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 rounded-lg bg-white dark:bg-[#0e0f0c] text-[#454745] dark:text-[#a0a0a0] shadow-sm border border-[#0e0f0c]/5 dark:border-white/5">
                      {category.icon}
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0e0f0c] dark:text-white">{category.title}</h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {category.skills.map((skill) => (
                      <span key={skill} className="px-3.5 py-1.5 rounded-lg bg-[#0e0f0c]/5 dark:bg-white/5 border border-[#0e0f0c]/10 dark:border-white/10 text-[13px] font-mono text-[#454745] dark:text-[#a0a0a0]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* LEETCODE SECTION */}
        {(!loading && (!lcData || lcData.totalSolved === 0)) ? null : (
          <div>
            <FadeIn>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#0e0f0c] dark:text-white mb-10">
                LeetCode
              </h2>
            </FadeIn>
          
          {/* Main LeetCode Card (Total Solved & Rings) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left Card */}
            <FadeIn delay={0.1} y={20}>
              <div className="h-full p-10 sm:p-14 rounded-[24px] bg-[#e8ebe6] dark:bg-[#1a1b19] border border-[#0e0f0c]/5 dark:border-white/5 flex flex-col items-center justify-center relative transition-all hover:border-[#0e0f0c]/10 dark:hover:border-white/10">
                <div className="text-center mb-10">
                  <div className="text-7xl font-black text-[#0e0f0c] dark:text-white tracking-tighter">
                    {loading ? "..." : lcData?.totalSolved || 0}
                  </div>
                  <div className="text-[15px] font-medium text-[#454745] dark:text-[#868685] mt-2">
                    Problems Solved
                  </div>
                </div>
                
                <div className="flex w-full justify-center gap-12 sm:gap-20">
                  <div className="text-center">
                    <div className="text-[13px] text-[#454745] dark:text-[#868685] mb-1">Acceptance</div>
                    <div className="text-xl font-bold text-[#0e0f0c] dark:text-white">
                      {loading ? "..." : `${lcData?.acceptanceRate}%`}
                    </div>
                  </div>
                  
                  <div className="w-[1px] bg-[#0e0f0c]/10 dark:bg-white/10"></div>
                  
                  <div className="text-center">
                    <div className="text-[13px] text-[#454745] dark:text-[#868685] mb-1">Ranking</div>
                    <div className="text-xl font-bold text-[#0e0f0c] dark:text-white">
                      {loading ? "..." : lcData?.ranking?.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Right Card */}
            <FadeIn delay={0.2} y={20}>
              <div className="h-full p-10 sm:p-12 rounded-[24px] bg-[#e8ebe6] dark:bg-[#1a1b19] border border-[#0e0f0c]/5 dark:border-white/5 flex flex-col justify-between transition-all hover:border-[#0e0f0c]/10 dark:hover:border-white/10">
                <div className="flex-grow flex items-center justify-center gap-6 sm:gap-10 py-4">
                  <CircularProgress
                    value={loading ? 0 : lcData?.easySolved || 0}
                    max={loading ? 1 : lcData?.totalEasy || 1}
                    label="Easy"
                    colorClass="text-[#00b8a3]"
                  />
                  <CircularProgress
                    value={loading ? 0 : lcData?.mediumSolved || 0}
                    max={loading ? 1 : lcData?.totalMedium || 1}
                    label="Medium"
                    colorClass="text-[#ffc01e]"
                  />
                  <CircularProgress
                    value={loading ? 0 : lcData?.hardSolved || 0}
                    max={loading ? 1 : lcData?.totalHard || 1}
                    label="Hard"
                    colorClass="text-[#ef4743]"
                  />
                </div>
                
                <div className="flex justify-end mt-8">
                  <a 
                    href={`https://leetcode.com/u/${leetcode_username}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[13px] font-bold text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    View on LeetCode <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Contest Stats Card */}
          <FadeIn delay={0.3} y={20}>
            <div className="w-full p-8 sm:p-10 rounded-[24px] bg-[#e8ebe6] dark:bg-[#1a1b19] border border-[#0e0f0c]/5 dark:border-white/5 transition-all hover:border-[#0e0f0c]/10 dark:hover:border-white/10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
                
                {/* Contest Left side - Line Graph */}
                <div className="lg:col-span-2 pr-0 lg:pr-8 border-r-0 lg:border-r border-[#0e0f0c]/5 dark:border-white/5 flex flex-col justify-between">
                  <div className="flex flex-wrap gap-8 sm:gap-16">
                    <div>
                      <div className="text-[13px] font-bold text-[#454745] dark:text-[#868685] mb-1">Contest Rating</div>
                      <div className="text-3xl font-black text-[#0e0f0c] dark:text-white">
                        {loading ? "..." : Math.round(lcData?.contestRating || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#454745] dark:text-[#868685] mb-1">Global Ranking</div>
                      <div className="text-xl font-bold text-[#0e0f0c] dark:text-white mt-2">
                        {loading ? "..." : `${lcData?.contestGlobalRanking?.toLocaleString()}`}
                        <span className="text-sm font-medium text-[#454745] dark:text-[#868685]">
                           /{lcData?.totalParticipants?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#454745] dark:text-[#868685] mb-1">Attended</div>
                      <div className="text-xl font-bold text-[#0e0f0c] dark:text-white mt-2">
                        {loading ? "..." : lcData?.contestAttend}
                      </div>
                    </div>
                  </div>
                  
                  {!loading && lcData?.contestParticipation && (
                    <ContestLineGraph data={lcData.contestParticipation} />
                  )}
                </div>

                {/* Contest Right side - Bar Chart */}
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-[#454745] dark:text-[#868685] mb-1">Top</div>
                    <div className="text-3xl font-black text-[#0e0f0c] dark:text-white">
                      {loading ? "..." : `${lcData?.contestTopPercentage}%`}
                    </div>
                  </div>
                  
                  {!loading && lcData?.contestTopPercentage && (
                    <ContestBarChart topPercentage={lcData.contestTopPercentage} />
                  )}
                </div>

              </div>
            </div>
          </FadeIn>

          </div>
        )}
        
      </div>
    </section>
  );
};
