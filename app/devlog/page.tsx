"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, GitCommit, ExternalLink, GitBranch, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";

const GITHUB_USERNAME = "pandarudra";

interface CommitData {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  repository?: {
    name: string;
    full_name: string;
    html_url: string;
  };
}

interface RepoEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  
  payload: {
    commits?: { sha: string; message: string; url: string }[];
    ref?: string;
    ref_type?: string;
  };
}

export default function DevLogPage() {
  const [events, setEvents] = useState<RepoEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const CACHE_KEY = `devlog_events_${GITHUB_USERNAME}`;
    const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    const fetchActivity = async () => {
      // Check sessionStorage cache first
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp, events: cachedEvents } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setEvents(cachedEvents);
            setLoading(false);
            return;
          }
        }
      } catch (_) { /* sessionStorage unavailable or parse error */ }

      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=50`
        );
        
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        const data: RepoEvent[] = await res.json();
        // Filter to push events with commits
        const pushEvents = data.filter((e) => e.type === "PushEvent");
        
        const limitedEvents: RepoEvent[] = [];
        let commitCount = 0;
        
        for (const e of pushEvents) {
          if (commitCount >= 9) break;
          
          const commits = e.payload.commits || [];
          const remaining = 9 - commitCount;
          const commitsToTake = commits.slice(0, remaining);
          
          limitedEvents.push({
            ...e,
            payload: { ...e.payload, commits: commitsToTake }
          });
          commitCount += commitsToTake.length;
        }
        
        setEvents(limitedEvents);

        // Cache in sessionStorage
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            events: limitedEvents,
          }));
        } catch (_) { /* quota exceeded or private browsing */ }
      } catch (err: any) {
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffHours < 1) return "just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getRepoShortName = (fullName: string) => fullName.split("/").pop() || fullName;

  return (
    <section className="min-h-screen bg-[#e8ebe6] dark:bg-[#0e0f0c] transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 sm:py-20 px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[14px] font-bold text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-6xl font-black tracking-tight text-[#0e0f0c] dark:text-white mb-4"
        >
          GitHub <span className="accent-text">DevLog</span>
        </motion.h1>
        <p className="text-lg text-[#454745] dark:text-[#868685] font-medium mb-12 max-w-2xl">
          A live feed of my latest commits across all public repositories. Proof that the code never stops.
        </p>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin accent-text" />
          </div>
        )}

        {error && (
          <div className="p-8 rounded-[24px] bg-[#d03238]/10 border border-[#d03238]/20 text-center">
            <p className="text-[#d03238] font-bold">Failed to load commits: {error}</p>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="p-8 rounded-[24px] bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 text-center">
            <p className="text-[#868685]">No recent commits found.</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#0e0f0c]/10 dark:bg-white/10" />

            <div className="space-y-1">
              {events.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.035, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative pl-12"
>
                  {/* Timeline dot */}
                  <div className="absolute left-[14px] top-[22px] w-[11px] h-[11px] rounded-full bg-white dark:bg-[#121311] border-2 border-[#0e0f0c]/20 dark:border-white/20 z-10" />

                  <div className="p-5 sm:p-6 rounded-[20px] bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 shadow-sm transition-all hover:shadow-md hover:border-[#0e0f0c]/10 dark:hover:border-white/10 group mb-3">
                    {/* Repo + Date header */}
                    <div className="flex items-center justify-between mb-3">
                      <a
                        href={`https://github.com/${event.repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[13px] font-bold accent-text hover:underline"
                      >
                        <GitBranch className="w-3.5 h-3.5" />
                        {getRepoShortName(event.repo.name)}
                      </a>
                      <span className="flex items-center gap-1.5 text-[12px] text-[#868685] font-medium">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.created_at)}
                      </span>
                    </div>

                    {/* Commits */}
                    <div className="space-y-2">
                      {event.payload.commits?.map((commit) => (
                        <a
                          key={commit.sha}
                          href={commit.url.replace("api.github.com/repos", "github.com").replace("/commits/", "/commit/")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 group/commit"
                        >
                          <GitCommit className="w-4 h-4 mt-0.5 text-[#868685] group-hover/commit:accent-text transition-colors shrink-0" />
                          <span className="text-[14px] text-[#0e0f0c] dark:text-white font-medium group-hover/commit:accent-text transition-colors leading-snug">
                            {commit.message.split("\n")[0]}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 mt-0.5 text-[#868685] opacity-0 group-hover/commit:opacity-100 transition-opacity shrink-0 ml-auto" />
                        </a>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View more */}
            <div className="pl-12 pt-4">
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white transition-colors"
              >
                View all activity on GitHub <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
