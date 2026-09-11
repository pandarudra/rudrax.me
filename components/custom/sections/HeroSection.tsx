"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Download, FileText, X } from "lucide-react";
import { FadeIn } from "../ui/FadeIn";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type HistoryItem = {
  id: string;
  type: 'input' | 'output' | 'error' | 'log';
  content: string;
  valueType?: 'string' | 'number' | 'boolean' | 'undefined' | 'object' | 'function' | 'bigint' | 'symbol';
};

// Trailing identifier chain being typed, e.g. "dev.na" from "1+1; dev.na"
const IDENT_CHAIN_RE = /[a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)*\.?[\w$]*$/;

/** Own property names across the prototype chain — same idea real console autocomplete uses. */
const getPropertyNames = (obj: unknown): string[] => {
  const names = new Set<string>();
  let cur: any = obj;
  let depth = 0;
  while (cur != null && depth < 8) {
    try {
      Object.getOwnPropertyNames(cur).forEach((n) => {
        if (/^[a-zA-Z_$][\w$]*$/.test(n)) names.add(n);
      });
    } catch {}
    cur = Object.getPrototypeOf(cur);
    depth++;
  }
  return Array.from(names);
};

const CleanDevCard = ({
  expanded = false,
  onInputFocus,
  onClose,
}: {
  expanded?: boolean;
  onInputFocus?: () => void;
  onClose?: () => void;
}) => {
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 'init-1', type: 'input', content: 'const dev = { name: "Rudra", role: "Full-Stack" };' },
    { id: 'init-2', type: 'output', content: 'undefined', valueType: 'undefined' },
    { id: 'init-3', type: 'input', content: 'dev.name' },
    { id: 'init-4', type: 'output', content: '"Rudra"', valueType: 'string' },
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [ghost, setGhost] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const partialLenRef = React.useRef(0);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);

  const clearSuggestions = () => {
    setSuggestions([]);
    setGhost('');
    setActiveIndex(-1);
    partialLenRef.current = 0;
  };

  const updateSuggestions = (value: string) => {
    const win = iframeRef.current?.contentWindow as any;
    const chain = value.match(IDENT_CHAIN_RE)?.[0];
    if (!win || !chain) {
      clearSuggestions();
      return;
    }

    const lastDot = chain.lastIndexOf('.');
    const base = lastDot === -1 ? '' : chain.slice(0, lastDot);
    const partial = lastDot === -1 ? chain : chain.slice(lastDot + 1);

    let names: string[];
    if (!base) {
      names = getPropertyNames(win);
    } else {
      let target: unknown;
      try {
        target = win.eval(base);
      } catch {
        clearSuggestions();
        return;
      }
      if (target === null || target === undefined) {
        clearSuggestions();
        return;
      }
      names = getPropertyNames(Object(target));
    }

    const matches = names
      .filter((n) => n.startsWith(partial))
      .sort((a, b) => a.length - b.length || a.localeCompare(b))
      .slice(0, 8);

    partialLenRef.current = partial.length;
    setSuggestions(matches);
    setGhost(matches[0] ? matches[0].slice(partial.length) : '');
    setActiveIndex(-1);
  };

  const acceptSuggestion = (name: string) => {
    // Capture now — setInput's updater runs later (after React re-renders),
    // by which point clearSuggestions() below would have already zeroed the ref.
    const partialLen = partialLenRef.current;
    setInput((prev) => prev.slice(0, prev.length - partialLen) + name);
    clearSuggestions();
    inputRef.current?.focus();
  };

  React.useEffect(() => {
    // Setup isolated iframe sandbox for executing JS
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframeRef.current = iframe;
    
    const win = iframe.contentWindow as any;
    if (win) {
      // Pre-load the 'dev' object silently in the sandbox
      try {
        win.eval('var dev = { name: "Rudra", role: "Full-Stack" };');
      } catch (e) {}
    }

    return () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, []);

  React.useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [history]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      if (suggestions.length > 0) {
        e.preventDefault();
        acceptSuggestion(suggestions[activeIndex >= 0 ? activeIndex : 0]);
      }
      return;
    }

    if (e.key === 'ArrowRight') {
      const el = e.currentTarget;
      const atEnd = el.selectionStart === input.length && el.selectionEnd === input.length;
      if (atEnd && ghost) {
        e.preventDefault();
        acceptSuggestion(suggestions[activeIndex >= 0 ? activeIndex : 0]);
      }
      return;
    }

    if (e.key === 'ArrowDown' && suggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
      return;
    }

    if (e.key === 'ArrowUp' && suggestions.length > 0) {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }

    if (e.key === 'Escape' && suggestions.length > 0) {
      clearSuggestions();
      return;
    }

    if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      acceptSuggestion(suggestions[activeIndex]);
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      clearSuggestions();
      if (!input.trim()) return;

      const newHistory: HistoryItem[] = [...history, { id: Date.now().toString(), type: 'input', content: input }];
      
      const win = iframeRef.current?.contentWindow as any;
      if (!win) {
         setHistory([...newHistory, { id: Date.now().toString()+'-err', type: 'error', content: "Sandbox not initialized."}]);
         return;
      }

      const originalConsoleLog = win.console.log;
      const interceptedLogs: string[] = [];
      win.console.log = (...args: any[]) => {
        interceptedLogs.push(args.map((a: any) => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        if (originalConsoleLog) originalConsoleLog.apply(win.console, args);
      };

      try {
        // Rewrite let/const to var so they persist in the iframe global scope and can be redefined
        const processedCode = input.replace(/\b(?:let|const)\s+/g, 'var ');
        const result = win.eval(processedCode);
        
        interceptedLogs.forEach((log, index) => {
          newHistory.push({
            id: Date.now().toString() + '-log-' + index,
            type: 'log',
            content: log
          });
        });

        let valueType = typeof result;
        let content = String(result);
        
        if (valueType === 'object' && result !== null) {
           content = JSON.stringify(result, null, 2);
        } else if (valueType === 'string') {
           content = `"${result}"`;
        } else if (valueType === 'function') {
           content = `ƒ ${result.name || 'anonymous'}()`;
        }
        
        newHistory.push({
          id: Date.now().toString() + '-out',
          type: 'output',
          content,
          valueType: result === null ? 'object' : valueType
        });
      } catch (err: any) {
        newHistory.push({
          id: Date.now().toString() + '-err',
          type: 'error',
          content: err.toString()
        });
      } finally {
        win.console.log = originalConsoleLog;
      }

      setHistory(newHistory);
      setInput('');
    }
  };

  const getColorForType = (type?: string) => {
    switch (type) {
      case 'number': return 'text-[#3b78ff] dark:text-[#9980ff]';
      case 'string': return 'text-[#d03238] dark:text-[#e36e6e]';
      case 'boolean': return 'text-[#b86700] dark:text-[#ffbd2e]';
      case 'undefined': return 'text-[#868685]';
      case 'function': return 'text-[#2ead4b] font-italic';
      default: return 'text-[#0e0f0c] dark:text-white';
    }
  };

  return (
    <div
      className={`relative w-full h-full rounded-[24px] bg-white dark:bg-[#121311] border border-[#0e0f0c]/5 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col font-mono transition-colors duration-300 ${
        expanded ? "text-[15px] sm:text-[16px]" : "text-[13px] sm:text-[14px]"
      }`}
    >
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#0e0f0c]/5 dark:border-white/5 bg-[#e8ebe6]/40 dark:bg-black/20">
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="size-3.5 rounded-full bg-[#d03238] cursor-pointer transition-transform hover:scale-110 active:scale-95"
          />
          <div className="size-3.5 rounded-full bg-[#ffd11a]"></div>
          <div className="size-3.5 rounded-full bg-[#2ead4b]"></div>
        </div>
        <div className="text-[12px] font-bold text-[#868685] uppercase tracking-widest ml-2">Console</div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-[#0e0f0c]/10 dark:scrollbar-thumb-white/10"
      >
        {history.map((item) => (
          <div key={item.id} className="flex gap-3 py-1.5 border-b border-[#0e0f0c]/5 dark:border-white/5 last:border-0 group break-all">
            {item.type === 'input' && (
              <>
                <span className="text-[#3b78ff] select-none font-bold mt-0.5">{">"}</span>
                <span className="text-[#0e0f0c] dark:text-white whitespace-pre-wrap flex-1">{item.content}</span>
              </>
            )}
            {item.type === 'output' && (
              <>
                <span className="text-[#868685] select-none text-[11px] mt-1">{"<·"}</span>
                <span className={`${getColorForType(item.valueType)} whitespace-pre-wrap flex-1`}>{item.content}</span>
              </>
            )}
            {item.type === 'log' && (
              <>
                <span className="text-transparent select-none mt-0.5">{">"}</span>
                <span className="text-[#454745] dark:text-[#a0a0a0] whitespace-pre-wrap flex-1">{item.content}</span>
              </>
            )}
            {item.type === 'error' && (
              <>
                <span className="text-[#d03238] select-none text-[11px] mt-1">{"✖"}</span>
                <span className="text-[#d03238] whitespace-pre-wrap flex-1">{item.content}</span>
              </>
            )}
          </div>
        ))}
        
        <div className="flex gap-3 py-1.5 items-start mt-1">
          <span className="text-[#3b78ff] select-none font-bold mt-0.5">{">"}</span>
          <div className="relative flex-1">
            {/* Ghost completion — typed text invisible, remaining tail shown in muted color */}
            <div aria-hidden className="absolute inset-0 whitespace-pre pointer-events-none">
              <span className="invisible">{input}</span>
              <span className="text-[#868685]/70">{ghost}</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                updateSuggestions(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={onInputFocus}
              onBlur={() => setTimeout(clearSuggestions, 120)}
              className="relative w-full bg-transparent text-[#0e0f0c] dark:text-white focus:outline-none placeholder:text-[#868685]"
              spellCheck={false}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 top-full mt-1 z-20 min-w-35 max-w-60 rounded-lg border border-[#0e0f0c]/10 dark:border-white/10 bg-white dark:bg-[#1e1e1e] shadow-lg overflow-hidden py-1">
                {suggestions.map((s, i) => (
                  <div
                    key={s}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      acceptSuggestion(s);
                    }}
                    className={`px-3 py-1 text-[13px] cursor-pointer whitespace-nowrap ${
                      i === activeIndex
                        ? "bg-[#3b78ff]/15 text-[#3b78ff]"
                        : "text-[#454745] dark:text-[#a0a0a0] hover:bg-black/5 dark:hover:bg-white/5"
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-2" />
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const router = useRouter();
  const [devCardFocused, setDevCardFocused] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Lock page scroll while the console is centered.
  useEffect(() => {
    if (!devCardFocused) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [devCardFocused]);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-center pt-24 pb-10 sm:pt-32 sm:pb-24 overflow-hidden bg-[#e8ebe6] dark:bg-[#0e0f0c] transition-colors duration-300"
    >
      <div className="relative z-10 w-full px-6 md:px-12">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="text-center lg:text-left flex flex-col justify-center">

            <FadeIn y={18} delay={0.08}>
              <h1 className="text-5xl sm:text-7xl md:text-[100px] lg:text-[120px] font-black leading-[0.85] tracking-tight mb-5 sm:mb-8 text-[#0e0f0c] dark:text-white font-sans">
                Hi, I’m{" "}
                <span className="accent-text">
                  Rudra.
                </span>
              </h1>
            </FadeIn>

            <FadeIn y={14} delay={0.18}>
              <p className="text-lg sm:text-2xl text-[#454745] dark:text-[#868685] font-medium max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-10 leading-relaxed tracking-tight">
               I build digital experiences that don't just work, they resonate. From lightning-fast interfaces to battle-tested backend systems, I create products that are elegant, scalable, and impossible to ignore.    </p>
            </FadeIn>

            <FadeIn
              y={8}
              delay={0.26}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 flex-wrap"
            >
              <a href="mailto:rudrapanda8206@gmail.com" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-[24px] accent-bg px-8 text-[15px] sm:text-[16px] font-bold transition-all hover:scale-105 active:scale-95 shadow-lg">
                  Get In Touch
                </button>
              </a>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();

                  router.push("/blog");
                }}
                className="w-full sm:w-auto group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-[24px] border-2 border-[#0e0f0c] dark:border-white bg-transparent px-8 text-[15px] sm:text-[16px] font-bold text-[#0e0f0c] dark:text-white transition-all hover:bg-[#0e0f0c] hover:text-white dark:hover:bg-white dark:hover:text-[#0e0f0c] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Explore Blogs
                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={() => setResumeOpen(true)}
                className="w-full sm:w-auto group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-[24px] border-2 border-[#0e0f0c] dark:border-white bg-transparent px-8 text-[15px] sm:text-[16px] font-bold text-[#0e0f0c] dark:text-white transition-all hover:bg-[#0e0f0c] hover:text-white dark:hover:bg-white dark:hover:text-[#0e0f0c] hover:scale-105 active:scale-95 cursor-pointer"
              >
                Resume
                <FileText className="size-5" />
              </button>

            </FadeIn>

            <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
              <DialogContent
                showCloseButton={false}
                className="w-[95vw] sm:max-w-4xl h-[90vh] max-h-225 flex flex-col gap-0 p-0 rounded-[24px] bg-white dark:bg-[#0e0f0c] border border-[#0e0f0c]/10 dark:border-white/10 overflow-hidden"
              >
                <DialogHeader className="flex-row items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[#0e0f0c]/10 dark:border-white/10 space-y-0">
                  <DialogTitle className="text-lg sm:text-xl font-black text-[#0e0f0c] dark:text-white">
                    Resume
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <a
                      href="/files/rudra_resume.pdf"
                      download="Rudramadhab_Panda_Resume.pdf"
                      className="inline-flex items-center gap-2 h-10 px-4 rounded-[24px] accent-bg text-[13px] font-bold transition-transform hover:scale-105 active:scale-95"
                    >
                      <Download className="size-4" />
                      Download
                    </a>
                    <button
                      type="button"
                      aria-label="Close"
                      onClick={() => setResumeOpen(false)}
                      className="size-10 rounded-full border border-[#0e0f0c]/10 dark:border-white/10 flex items-center justify-center text-[#0e0f0c] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </DialogHeader>
                <iframe
                  src="/files/rudra_resume.pdf"
                  title="Rudramadhab Panda — Resume"
                  className="flex-1 w-full bg-white"
                />
              </DialogContent>
            </Dialog>

          </div>

          <FadeIn  y={12} delay={0.22} className="w-full hidden md:flex justify-center lg:justify-end ">
            {/* Centering happens via flexbox on this wrapper, not a manual transform —
                Framer Motion's `layout` prop owns `transform` for its own FLIP
                animation, so a hand-set translate would just get overwritten. */}
            <div
              className={
                devCardFocused
                  ? "fixed inset-0 z-100 flex items-center justify-center pointer-events-none"
                  : "contents"
              }
            >
              <motion.div
                layout
                transition={{ layout: { type: "spring", stiffness: 300, damping: 32 } }}
                className={
                  devCardFocused
                    ? "w-[min(95vw,72rem)] h-[min(85vh,800px)] pointer-events-auto"
                    : "w-full max-w-lg lg:ml-auto h-100"
                }
              >
                <CleanDevCard
                  expanded={devCardFocused}
                  onInputFocus={() => setDevCardFocused(true)}
                  onClose={() => setDevCardFocused(false)}
                />
              </motion.div>
            </div>
          </FadeIn>

          <AnimatePresence>
            {devCardFocused && (
              <motion.div
                aria-hidden
                onClick={() => setDevCardFocused(false)}
                className="fixed inset-0 z-90 bg-black/60 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
