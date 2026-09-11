"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        <div className="pointer-events-auto lg:hidden w-full flex justify-end">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full bg-white/95 dark:bg-[#121311]/95 border border-[#0e0f0c]/10 dark:border-white/10 shadow-sm text-[#0e0f0c] dark:text-white transition-transform hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto absolute top-full left-0 right-0 px-6 pt-4 lg:hidden"
          >
            <nav className="flex flex-col rounded-[24px] border border-[#0e0f0c]/10 dark:border-white/10 bg-white/95 dark:bg-[#121311]/95 backdrop-blur-xl p-6 shadow-2xl gap-5">
              {navLinks.map((link) => (
                <a 
                  key={link.id}
                  href={`#${link.id}`} 
                  onClick={(e) => handleScroll(e, link.id)} 
                  className="text-[16px] font-bold text-[#454745] dark:text-[#a0a0a0] hover:text-[#0e0f0c] dark:hover:text-white transition-colors border-b border-[#0e0f0c]/5 dark:border-white/5 pb-4 last:border-0 last:pb-0"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
