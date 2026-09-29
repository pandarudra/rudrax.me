import Landing from "@/pages/Landing";
import React from "react";
import { SITE_URL, profile, socials, education, experiences, skillCategories, projects } from "@/constants";

// Server-rendered structured data: the visible sections load client-side,
// so this keeps profile + project info in the initial HTML for crawlers.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      alternateName: profile.shortName,
      url: SITE_URL,
      email: `mailto:${profile.email}`,
      jobTitle: profile.title,
      description: profile.bio,
      sameAs: [socials.github, socials.linkedin, socials.x],
      alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
      worksFor: { "@type": "Organization", name: experiences[0].company },
      knowsAbout: skillCategories.flatMap((c) => c.skills),
    },
    {
      "@type": "ItemList",
      name: "Projects",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "SoftwareSourceCode",
          name: p.name,
          description: p.desc,
          codeRepository: p.github,
          ...(p.live && { url: p.live }),
          ...(p.image && { image: `${SITE_URL}${p.image}` }),
          keywords: p.stack.join(", "),
          author: { "@id": `${SITE_URL}/#person` },
        },
      })),
    },
  ],
};

const Page = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Landing />
    </>
  );
};

export default Page;
