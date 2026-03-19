"use client";

import { useState, useMemo } from "react";
import { projects, filterTabs, FilterTab } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const projectCount = filteredProjects.length;

  return (
    <section className="space-y-6" data-testid="projects-grid">
      {/* Filter Tabs */}
      <div 
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Project filters"
        data-testid="filter-tabs"
      >
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeFilter === tab.id}
            aria-controls="projects-panel"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeFilter === tab.id
                ? "bg-[var(--neon-lime)] text-black"
                : "bg-[var(--bg-panel)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-[var(--neon-cyan)] hover:text-[var(--text-primary)]"
            }`}
            data-testid={`filter-tab-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Project Count */}
      <p className="text-[var(--text-muted)] text-sm" data-testid="project-count">
        Showing {projectCount} {projectCount === 1 ? "project" : "projects"}
      </p>

      {/* Projects Grid */}
      <div 
        id="projects-panel"
        role="tabpanel"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="projects-list"
      >
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">
            No projects found in this category.
          </p>
        </div>
      )}
    </section>
  );
}
