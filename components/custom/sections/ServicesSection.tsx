"use client";

import { FadeIn } from "../ui/FadeIn";

const services = [
  {
    num: "01",
    title: "Frontend Engineering",
    desc: "Building highly performant, reactive user interfaces with React, Next.js, and SvelteKit. Focused on scalable architectures and smooth UX."
  },
  {
    num: "02",
    title: "Backend Architecture",
    desc: "Designing robust, scalable APIs and microservices using Node.js, Express, and NestJS, with real-time capabilities via Socket.IO."
  },
  {
    num: "03",
    title: "Cloud & DevOps",
    desc: "Configuring and managing deployments on AWS and Azure, Dockerizing applications, and implementing CI/CD pipelines."
  },
];

export const ServicesSection = () => {
  return (
    <section id="services" className="bg-[#e8ebe6] dark:bg-[#0e0f0c] transition-colors duration-300 rounded-[24px] sm:rounded-[24px] py-14 sm:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-4xl sm:text-7xl font-black text-center mb-10 sm:mb-20 text-[#0e0f0c] dark:text-white tracking-tight">Services</h2>
        </FadeIn>

        <div className="flex flex-col">
          {services.map((service, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex flex-col md:flex-row gap-3 md:gap-12 py-6 md:py-10 border-b border-[#0e0f0c]/10 dark:border-white/10 items-start md:items-center">
                <span className="text-4xl sm:text-7xl font-black text-[#0e0f0c]/10 dark:text-white/10">
                  {service.num}
                </span>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-2 sm:mb-4 text-[#0e0f0c] dark:text-white">{service.title}</h3>
                  <p className="text-[#454745] dark:text-[#868685] text-base sm:text-xl font-medium leading-relaxed max-w-2xl">
                    {service.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

