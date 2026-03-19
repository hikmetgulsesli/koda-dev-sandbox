export interface Project {
  id: string;
  title: string;
  description: string;
  category: "web" | "mobile" | "design" | "open-source";
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Dashboard",
    description: "A modern React dashboard for managing online stores with real-time analytics and inventory management.",
    category: "web",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    githubUrl: "https://github.com/example/ecommerce-dashboard",
    demoUrl: "https://demo.example.com",
  },
  {
    id: "2",
    title: "Fitness Tracker App",
    description: "Mobile application for tracking workouts, nutrition, and health metrics with social features.",
    category: "mobile",
    tags: ["React Native", "Firebase", "Redux"],
    githubUrl: "https://github.com/example/fitness-tracker",
  },
  {
    id: "3",
    title: "Design System Kit",
    description: "Comprehensive UI component library with accessibility-first design tokens and documentation.",
    category: "design",
    tags: ["Figma", "Storybook", "Design Tokens"],
    demoUrl: "https://design-system.example.com",
  },
  {
    id: "4",
    title: "Open Source CLI Tool",
    description: "Command-line utility for automating development workflows and project scaffolding.",
    category: "open-source",
    tags: ["Node.js", "TypeScript", "CLI"],
    githubUrl: "https://github.com/example/cli-tool",
  },
  {
    id: "5",
    title: "Portfolio Website",
    description: "Personal portfolio showcasing projects with 3D animations and interactive experiences.",
    category: "web",
    tags: ["Next.js", "Three.js", "GSAP"],
    githubUrl: "https://github.com/example/portfolio",
    demoUrl: "https://portfolio.example.com",
  },
  {
    id: "6",
    title: "Weather App",
    description: "Cross-platform mobile app providing accurate weather forecasts with beautiful visualizations.",
    category: "mobile",
    tags: ["Flutter", "Dart", "REST API"],
    githubUrl: "https://github.com/example/weather-app",
  },
  {
    id: "7",
    title: "Icon Library",
    description: "Open-source SVG icon set with over 500 customizable icons for web and mobile projects.",
    category: "open-source",
    tags: ["SVG", "Figma", "NPM Package"],
    githubUrl: "https://github.com/example/icon-library",
    demoUrl: "https://icons.example.com",
  },
  {
    id: "8",
    title: "Brand Identity System",
    description: "Complete brand redesign including logo, typography, color palette, and usage guidelines.",
    category: "design",
    tags: ["Branding", "Figma", "Guidelines"],
  },
];

export const filterTabs = [
  { id: "all", label: "All" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
  { id: "design", label: "Design" },
  { id: "open-source", label: "Open Source" },
] as const;

export type FilterTab = (typeof filterTabs)[number]["id"];
