// Builds /llms.txt and /llms-full.txt from the same constants the UI renders,
// so the AI-readable profile can't drift from the site.
import {
  SITE_URL,
  profile,
  socials,
  education,
  experiences,
  services,
  skillCategories,
  codingStats,
  milestones,
  projects,
  heroTags,
} from "@/constants";
import { certificates } from "@/constants/certificate.c";

type Repo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  fork: boolean;
};

const abs = (path: string) => new URL(path, SITE_URL).toString();
const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
const repoSlug = (url: string) => url.split("/").pop()!.toLowerCase();
const stat = (s: (typeof codingStats)[number]) =>
  `${s.label}${s.highlight ? `: ${s.highlight}` : ""} (${s.value})`;

const summary = `${profile.name} ("${profile.shortName}", GitHub: ${profile.handle}) is a ${profile.title.toLowerCase()} studying ${education.degree} at ${education.school}. Builds full-stack web products, real-time systems, and developer tools, with experience across React/Next.js/SvelteKit frontends, Node.js/NestJS backends, and AWS/Azure deployments.`;

const links = [
  `- Portfolio: ${SITE_URL}`,
  `- GitHub: ${socials.github}`,
  `- LinkedIn: ${socials.linkedin}`,
  `- X (Twitter): ${socials.x}`,
  `- Email: ${profile.email}`,
  `- Resume (PDF): ${abs(profile.resume)}`,
  `- Detailed profile for LLMs: ${abs("/llms-full.txt")}`,
].join("\n");

export function buildLlmsTxt() {
  return `# ${profile.name}

> ${summary}

## About

- Education: ${education.degree}, ${education.school} (CGPA ${education.cgpa})
- Current role: ${experiences[0].role} at ${experiences[0].company} (${experiences[0].date})
- Focus: ${services.map((s) => s.title).join(", ")}

## Skills

${skillCategories.map((c) => `- ${c.title}: ${c.skills.join(", ")}`).join("\n")}

## Projects

${projects
  .map(
    (p) => `### ${p.name}

${p.desc}

- Category: ${p.category}
- Stack: ${p.stack.join(", ")}
${p.live ? `- Website: ${p.live}\n` : ""}- GitHub: ${p.github}`
  )
  .join("\n\n")}

## Experience

${experiences
  .map((e) => `- ${e.role}, ${e.company}, ${e.location}, ${e.date}. Tech: ${e.tech.join(", ")}`)
  .join("\n")}

## Achievements

${bullets([...milestones.map((m) => `${m.title}: ${m.desc}`), ...codingStats.map(stat)])}

## Links

${links}
`;
}

async function fetchOtherRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${profile.handle}/repos?per_page=100&sort=pushed`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const featured = new Set(projects.map((p) => repoSlug(p.github)));
    return ((await res.json()) as Repo[]).filter(
      (r) => !r.fork && !featured.has(r.name.toLowerCase())
    );
  } catch {
    return [];
  }
}

export async function buildLlmsFullTxt() {
  const repos = await fetchOtherRepos();

  return `# ${profile.name}

> ${summary}

## Professional Overview

${profile.bio}

${profile.name} works across the stack: ${services.map((s) => s.title.toLowerCase()).join(", ")}. Areas highlighted on the portfolio: ${heroTags.join(", ")}.

## About

- Name: ${profile.name} (goes by ${profile.shortName})
- Role: ${profile.title}
- Currently: ${experiences[0].role} at ${experiences[0].company} (${experiences[0].date})
- Education: ${education.degree}, ${education.school}

## Education

- Degree: ${education.degree}
- Institution: ${education.school}
- CGPA: ${education.cgpa}

## Services

${services.map((s) => `### ${s.title}\n\n${s.desc}`).join("\n\n")}

## Skills

${skillCategories.map((c) => `### ${c.title}\n\n${bullets(c.skills)}`).join("\n\n")}

## Projects

${projects
  .map(
    (p) => `### ${p.name}

${p.desc}

- Category: ${p.category}
- Problem it solves: ${p.problem}
- Status: ${p.live ? "Live" : "Source available on GitHub"}
${p.live ? `- Website: ${p.live}\n` : ""}- GitHub: ${p.github}

Key features:
${bullets(p.features)}

Technology stack: ${p.stack.join(", ")}`
  )
  .join("\n\n")}

## Experience

${experiences
  .map(
    (e) => `### ${e.role}, ${e.company}

- Dates: ${e.date}
- Location: ${e.location}
- Company page: ${e.companyUrl}
- Technologies: ${e.tech.join(", ")}

Responsibilities and contributions:
${bullets(e.desc)}`
  )
  .join("\n\n")}

## Open Source

- GitHub profile: ${socials.github}
- Hacktoberfest contributor (2024 and 2025 editions)
${
  repos.length
    ? `\nOther public repositories:\n\n${repos
        .map(
          (r) =>
            `- [${r.name}](${r.html_url})${r.language ? ` (${r.language})` : ""}${
              r.description ? `: ${r.description.trim()}` : ""
            }`
        )
        .join("\n")}`
    : ""
}

## Achievements

${bullets(milestones.map((m) => `${m.title}: ${m.desc}`))}

Competitive programming:
${bullets(codingStats.map(stat))}

Certificates:
${bullets(certificates.map((c) => `${c.title}, ${c.issuer} (${c.date})`))}

## Interests

${bullets(heroTags)}

## Development Philosophy

${profile.philosophy}

## External Links

${links}
${projects
  .map((p) => `- ${p.name}: ${p.live || p.github}`)
  .join("\n")}
`;
}
