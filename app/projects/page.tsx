import { ProjectsGrid } from "@/components/ProjectsGrid";

export const metadata = {
  title: "Projects | 3D Game App",
  description: "Explore our portfolio of web, mobile, design, and open source projects",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] p-8">
      <main className="max-w-6xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 
            className="text-4xl font-bold neon-text-cyan"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Projects and Open Source
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            A collection of web applications, mobile apps, design systems, and open source contributions
          </p>
        </header>

        <ProjectsGrid />
      </main>
    </div>
  );
}
