"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock page scroll while the full-screen mobile menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // 80px offset accounts for the fixed header height so it doesn't cover the section title
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      window.history.pushState(null, "", `#${id}`);
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills & LeetCode', id: 'skills' },
    { name: 'Certificates', id: 'certificates' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-6 pointer-events-none">
      <div className="w-full flex items-center justify-between sm:justify-center px-6 max-w-[1400px] mx-auto">

        {/* Desktop Nav */}
        <nav className="pointer-events-auto hidden lg:flex items-center justify-center gap-8 rounded-[24px] border border-[#0e0f0c]/5 dark:border-white/5 bg-[#e8ebe6]/95 dark:bg-[#121311]/95 px-8 py-3 shadow-sm">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScroll(e, link.id)}
              className="text-[14px] font-bold text-[#454745] dark:text-[#a0a0a0] hover:text-[#0e0f0c] dark:hover:text-white transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Nav Button */}
        <div className="relative z-10 pointer-events-auto lg:hidden w-full flex justify-end">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-white/95 dark:bg-[#121311]/95 border border-[#0e0f0c]/10 dark:border-white/10 shadow-sm text-[#0e0f0c] dark:text-white transition-transform hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu — full-screen numbered index takeover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-0 lg:hidden bg-[#e8ebe6] dark:bg-[#0e0f0c] overflow-hidden"
          >
            {/* ambient accent glow */}
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, var(--accent-dark), transparent 70%)" }}
            />

            <nav className="relative h-full flex flex-col justify-center px-6 sm:px-10 pt-20">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => handleScroll(e, link.id)}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="group flex items-baseline gap-4 py-3 sm:py-4 border-b border-[#0e0f0c]/5 dark:border-white/5 last:border-0"
                >
                  <span className="text-base font-black text-[#0e0f0c]/20 dark:text-white/20 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-[#0e0f0c] dark:text-white tracking-tight transition-opacity active:opacity-60">
                    {link.name}
                  </span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
