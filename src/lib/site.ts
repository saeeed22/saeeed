export const site = {
  name: "Saeed Ahmed",
  shortName: "Saeed",
  role: "Software Engineer",
  tagline: "Web, WordPress & Agentic AI Engineer",
  bio: "Fresh Software Engineering graduate from KU, based in Karachi. I build fast websites, ship WordPress experiences, and craft agentic AI systems and chatbots.",
  location: "Karachi, Pakistan",
  email: "testwithsaeed@gmail.com",
  socials: {
    github: "https://github.com/saeeed22",
    linkedin: "https://www.linkedin.com/in/saeeeed/",
  },
  github: {
    username: "saeeed22",
  },
  url: "https://saeed.dev",
} as const;

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

export const skills = [
  { name: "Next.js", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "GSAP", category: "Frontend" },
  { name: "WordPress", category: "CMS" },
  { name: "Sanity", category: "CMS" },
  { name: "Strapi", category: "CMS" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Backend" },
  { name: "REST / GraphQL", category: "Backend" },
  { name: "OpenAI", category: "AI" },
  { name: "Anthropic", category: "AI" },
  { name: "LangChain", category: "AI" },
  { name: "Agentic AI", category: "AI" },
  { name: "Chatbots", category: "AI" },
  { name: "Figma", category: "Tools" },
  { name: "Git", category: "Tools" },
];

export type Project = {
  slug: string;
  title: string;
  blurb: string;
  description: string;
  thumbnail: string;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  year: number;
};

export const projects: Project[] = [
  {
    slug: "agentic-chatbot",
    title: "Agentic Support Chatbot",
    blurb: "An AI chatbot that books, refunds, and resolves on its own.",
    description:
      "A multi-tool agent built on top of LLM function calling that triages support tickets, answers from a vector knowledge base, and takes actions across CRMs.",
    thumbnail: "/projects/placeholder-1.svg",
    stack: ["Next.js", "OpenAI", "LangChain", "Postgres"],
    year: 2026,
  },
  {
    slug: "wp-headless-store",
    title: "Headless WordPress Storefront",
    blurb: "WP as the brain, Next.js as the face. Lightning fast.",
    description:
      "A headless WooCommerce storefront with React Server Components, ISR, and a custom block editor mirror in the frontend.",
    thumbnail: "/projects/placeholder-2.svg",
    stack: ["Next.js", "WordPress", "GraphQL"],
    year: 2026,
  },
  {
    slug: "portfolio",
    title: "This Portfolio",
    blurb: "GSAP, Lenis, Sanity — built in public.",
    description:
      "The site you're looking at. Cinematic scroll, monochrome design with a coral accent, and a Sanity-driven project pipeline.",
    thumbnail: "/projects/placeholder-3.svg",
    stack: ["Next.js 16", "GSAP", "Sanity", "Tailwind v4"],
    year: 2026,
  },
];

export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
};

export const experiences: Experience[] = [
  {
    title: "Junior Web Developer",
    company: "Zuma Canada · Part-time · Remote",
    period: "Jan 2025 — Present",
    description:
      "Building and maintaining web experiences end-to-end — from frontend UI to backend integrations.",
  },
  {
    title: "Graphic Designer",
    company: "CocoPixel · Part-time · Remote",
    period: "Jan 2023 — Oct 2024",
    description:
      "Designed brand and marketing assets across digital and print, collaborating with founders on visual identity.",
  },
  {
    title: "B.S. Computer Software Engineering",
    company: "Karachi University",
    period: "Feb 2022 — Feb 2026",
    description:
      "Bachelor's degree with focus on web systems, AI, and software architecture.",
  },
  {
    title: "Foundations of UX Design",
    company: "Coursera",
    period: "Issued Jul 2023",
    description:
      "Certification covering UX principles, research, wireframing, and prototyping fundamentals.",
  },
];
