"use client";

import { useMsg } from "@/hooks";
import { FadeIn } from "./FadeIn";
import { motion } from "motion/react";
import { Github, Linkedin, Mail, Send, Moon, Sun, Monitor, Twitter } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";
import { toast } from "sonner";

export const Footer = () => {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { sendMessage: send } = useMsg();

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await send(email, message);
      toast.success("Message sent successfully!");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer id="contact" className="relative z-20 bg-white dark:bg-[#0e0f0c] border-t border-black/5 dark:border-white/5 pt-14 sm:pt-28 pb-10 sm:pb-16 px-6 overflow-hidden rounded-t-[24px]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16 relative z-10">

        {/* LEFT COLUMN: Contact Form (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <FadeIn>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <h2 className="text-4xl sm:text-7xl font-black tracking-tight text-[#0e0f0c] dark:text-white">
                Let&apos;s Connect
              </h2>
            </div>

            <p className="text-[#454745] dark:text-[#868685] mb-6 sm:mb-10 max-w-lg text-base sm:text-xl font-medium leading-relaxed">
              I&apos;m always open to discussing full-stack engineering roles, open-source initiatives, or contract projects. Drop me a line!
            </p>

            <form className="flex flex-col gap-5 max-w-xl" onSubmit={sendMessage}>
              {/* Animated Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-6 py-4 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0e0f0c] dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all duration-300 group-hover:border-black/20 dark:group-hover:border-white/20"
                  style={{ '--tw-ring-color': 'color-mix(in srgb, var(--ap) 40%, transparent)' } as React.CSSProperties}
                />
              </div>

              {/* Animated Message Input */}
              <div className="relative group">
                <textarea
                  name="message"
                  placeholder="Your message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-6 py-4 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0e0f0c] dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 transition-all duration-300 resize-none group-hover:border-black/20 dark:group-hover:border-white/20"
                  style={{ '--tw-ring-color': 'color-mix(in srgb, var(--ap) 40%, transparent)' } as React.CSSProperties}
                />
              </div>

              {/* Magical Send Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center justify-center gap-3 px-8 py-4 accent-bg font-black rounded-[24px] transition-all w-full sm:w-auto self-start shadow-lg cursor-pointer select-none"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            </form>
          </FadeIn>
        </div>

        {/* RIGHT COLUMN: Socials & Dynamic Dock Theme (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full gap-8 sm:gap-16 lg:pl-8">

          {/* Social Media Node Grid */}
          <FadeIn delay={0.2}>
            <h3 className="text-[13px] font-bold mb-4 sm:mb-6 accent-text tracking-widest uppercase">{`// Socials`}</h3>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              
              {/* GitHub Link */}
              <motion.a
                whileHover={{ y: -4 }}
                href="https://github.com/pandarudra"
                target="_blank"
                rel="noreferrer"
                className="p-4 sm:p-5 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0e0f0c] dark:text-white hover:accent-bg hover:border-transparent transition-all duration-300 flex items-center justify-center"
              >
                <Github className="w-6 h-6" />
                <span className="sr-only">GitHub</span>
              </motion.a>

              {/* LinkedIn Link */}
              <motion.a
                whileHover={{ y: -4 }}
                href="https://www.linkedin.com/in/rudra826/"
                target="_blank"
                rel="noreferrer"
                className="p-4 sm:p-5 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0e0f0c] dark:text-white transition-all duration-300 flex items-center justify-center"
              >
                <Linkedin className="w-6 h-6" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>

              {/* Email Link */}
              <motion.a
                whileHover={{ y: -4 }}
                href="mailto:rudrapanda8206@gmail.com"
                className="p-4 sm:p-5 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0e0f0c] dark:text-white transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="w-6 h-6" />
                <span className="sr-only">Email</span>
              </motion.a>


              {/* X Link */}
              <motion.a
                whileHover={{ y: -4 }}
                href="https://x.com/rudra_826"
                target="_blank"
                rel="noreferrer"
                className="p-4 sm:p-5 rounded-[24px] bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0e0f0c] dark:text-white transition-all duration-300 flex items-center justify-center"
              >
                <Twitter className="w-6 h-6" />
                <span className="sr-only">X</span>
              </motion.a>
            </div>
          </FadeIn>

          {/* Apple-Style Glassmorphic Theme Dock */}
          <FadeIn delay={0.3}>
            <h3 className="text-[13px] font-bold mb-6 accent-text tracking-widest uppercase">{`// Theme`}</h3>
            {mounted && (
              <div className="flex bg-black/5 dark:bg-white/5 rounded-[24px] p-2 w-fit border border-black/10 dark:border-white/10 relative group">
                
                {/* Light mode select */}
                <button
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-[24px] transition-all relative ${theme === "light" ? "accent-bg" : "text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"}`}
                  aria-label="Light Theme"
                >
                  <Sun className="w-5 h-5" />
                </button>

                {/* Dark mode select */}
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-[24px] transition-all relative ${theme === "dark" ? "accent-bg" : "text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"}`}
                  aria-label="Dark Theme"
                >
                  <Moon className="w-5 h-5" />
                </button>

                {/* System mode select */}
                <button
                  onClick={() => setTheme("system")}
                  className={`p-3 rounded-[24px] transition-all relative ${theme === "system" ? "accent-bg" : "text-[#454745] dark:text-[#868685] hover:text-[#0e0f0c] dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10"}`}
                  aria-label="System Theme"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>
            )}
          </FadeIn>

          {/* Copy block */}
          <div className="mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-black/10 dark:border-white/10 text-[#454745] dark:text-[#868685] text-sm flex flex-col sm:flex-row justify-between gap-4 w-full font-medium">
            <span>© {new Date().getFullYear()} Rudramadhab Panda. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

