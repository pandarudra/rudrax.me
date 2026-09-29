"use client";

import { useEffect, useState } from "react";
import { Folder, FolderOpen, Github, ExternalLink, Star, ChevronDown } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { projects } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Repo = {
  name: string;
  html_url: string;
  homepage: string | null;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

const PREVIEW = 8;

// Repos already shown in the Projects section
const featured = new Set(
  projects.map((p) => p.github.split("/").pop()!.toLowerCase())
);

export const OthersSection = () => {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [open, setOpen] = useState<Repo | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // ponytail: unauthenticated API, 60 req/hr per visitor IP — fine for one call per page load
    fetch("https://api.github.com/users/pandarudra/repos?per_page=100&sort=pushed")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Repo[]) =>
        setRepos(data.filter((r) => !r.fork && !featured.has(r.name.toLowerCase())))
      )
      .catch(() => setRepos([]));
  }, []);

  return (
    <section
      id="others"
      className="bg-[#e8ebe6] dark:bg-[#0e0f0c] py-12 sm:py-16 px-6 border-t border-[#0e0f0c]/5 dark:border-white/5 transition-colors duration-300"
    >
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0e0f0c] dark:text-white mb-2">
            Others
          </h2>
          <p className="text-[#454745] dark:text-[#868685] font-medium mb-5 sm:mb-6">
            Everything else on my GitHub. Open a folder to take a look.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-3xl bg-white dark:bg-[#121311] border border-[#0e0f0c]/10 dark:border-white/10 p-2 sm:p-3">
            {repos === null ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                {Array.from({ length: PREVIEW }).map((_, i) => (
                  <div key={i} className="h-11 rounded-xl animate-pulse bg-black/5 dark:bg-white/5" />
                ))}
              </div>
            ) : repos.length === 0 ? (
              <p className="font-mono text-[13px] text-[#868685] text-center py-6">
                Couldn&apos;t load repos.{" "}
                <a href="https://github.com/pandarudra?tab=repositories" target="_blank" rel="noreferrer" className="underline">
                  View them on GitHub
                </a>
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                  {(showAll ? repos : repos.slice(0, PREVIEW)).map((r) => (
                    <button
                      key={r.name}
                      type="button"
                      onClick={() => setOpen(r)}
                      className="group flex items-center gap-2 h-11 px-3 rounded-xl text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors min-w-0"
                    >
                      <Folder className="size-4 shrink-0 accent-text fill-current group-hover:hidden" />
                      <FolderOpen className="size-4 shrink-0 accent-text hidden group-hover:block" />
                      <span className="font-mono text-[13px] text-[#454745] dark:text-[#a0a0a0] truncate">
                        {r.name}
                      </span>
                    </button>
                  ))}
                </div>
                {repos.length > PREVIEW && (
                  <div className="flex justify-center mt-3 pt-3 border-t border-[#0e0f0c]/10 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setShowAll((v) => !v)}
                      aria-expanded={showAll}
                      className="inline-flex items-center gap-1.5 h-10 px-5 rounded-3xl bg-[#e8ebe6] dark:bg-[#0e0f0c] text-[13px] font-bold text-[#0e0f0c] dark:text-white hover:opacity-80 transition-opacity"
                    >
                      {showAll ? "Show less" : `View all ${repos.length}`}
                      <ChevronDown className={`size-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </FadeIn>
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="rounded-3xl bg-white dark:bg-[#121311] border-[#0e0f0c]/10 dark:border-white/10 p-6 sm:p-8">
          {open && (
            <>
              <div className="flex items-center gap-3">
                <FolderOpen className="size-8 accent-text shrink-0" />
                <DialogTitle className="text-2xl font-black text-[#0e0f0c] dark:text-white break-all">
                  {open.name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-[#454745] dark:text-[#868685] font-medium leading-relaxed">
                {open.description || "No description provided."}
              </DialogDescription>
              <div className="flex flex-wrap gap-4 font-mono text-[12px] text-[#868685]">
                {open.language && <span>{open.language}</span>}
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5" /> {open.stargazers_count}
                </span>
                <span>updated {new Date(open.pushed_at).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={open.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[#0e0f0c]/10 dark:border-white/10 text-[13px] font-bold text-[#0e0f0c] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Github className="size-4" />
                  Source
                </a>
                {open.homepage && (
                  <a
                    href={open.homepage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-xl accent-bg text-[13px] font-bold transition-colors"
                  >
                    <ExternalLink className="size-4" />
                    Live
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
