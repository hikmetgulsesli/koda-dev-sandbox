import { render, screen, fireEvent } from "@testing-library/react";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { projects, filterTabs } from "@/lib/projects";

describe("ProjectsGrid", () => {
  it("renders the filter tabs", () => {
    render(<ProjectsGrid />);
    
    filterTabs.forEach((tab) => {
      const tabButton = screen.getByTestId(`filter-tab-${tab.id}`);
      expect(tabButton).toBeInTheDocument();
      expect(tabButton).toHaveTextContent(tab.label);
    });
  });

  it("shows all projects by default", () => {
    render(<ProjectsGrid />);
    
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(projects.length);
    
    expect(screen.getByTestId("project-count")).toHaveTextContent(`Showing ${projects.length} projects`);
  });

  it("filters projects when clicking on Web tab", () => {
    render(<ProjectsGrid />);
    
    const webTab = screen.getByTestId("filter-tab-web");
    fireEvent.click(webTab);
    
    const webProjects = projects.filter((p) => p.category === "web");
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(webProjects.length);
    
    expect(screen.getByTestId("project-count")).toHaveTextContent(`Showing ${webProjects.length} projects`);
  });

  it("filters projects when clicking on Mobile tab", () => {
    render(<ProjectsGrid />);
    
    const mobileTab = screen.getByTestId("filter-tab-mobile");
    fireEvent.click(mobileTab);
    
    const mobileProjects = projects.filter((p) => p.category === "mobile");
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(mobileProjects.length);
  });

  it("filters projects when clicking on Design tab", () => {
    render(<ProjectsGrid />);
    
    const designTab = screen.getByTestId("filter-tab-design");
    fireEvent.click(designTab);
    
    const designProjects = projects.filter((p) => p.category === "design");
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(designProjects.length);
  });

  it("filters projects when clicking on Open Source tab", () => {
    render(<ProjectsGrid />);
    
    const openSourceTab = screen.getByTestId("filter-tab-open-source");
    fireEvent.click(openSourceTab);
    
    const openSourceProjects = projects.filter((p) => p.category === "open-source");
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(openSourceProjects.length);
  });

  it("returns to all projects when clicking All tab", () => {
    render(<ProjectsGrid />);
    
    // First filter to web
    fireEvent.click(screen.getByTestId("filter-tab-web"));
    expect(screen.getAllByTestId("project-card")).toHaveLength(
      projects.filter((p) => p.category === "web").length
    );
    
    // Then click All
    fireEvent.click(screen.getByTestId("filter-tab-all"));
    expect(screen.getAllByTestId("project-card")).toHaveLength(projects.length);
  });

  it("has correct project count per filter tab", () => {
    render(<ProjectsGrid />);
    
    filterTabs.forEach((tab) => {
      const tabButton = screen.getByTestId(`filter-tab-${tab.id}`);
      fireEvent.click(tabButton);
      
      const expectedCount = tab.id === "all" 
        ? projects.length 
        : projects.filter((p) => p.category === tab.id).length;
      
      expect(screen.getByTestId("project-count")).toHaveTextContent(
        `Showing ${expectedCount} ${expectedCount === 1 ? "project" : "projects"}`
      );
    });
  });

  it("renders project cards with correct structure", () => {
    render(<ProjectsGrid />);
    
    const firstProject = projects[0];
    expect(screen.getByText(firstProject.title)).toBeInTheDocument();
    expect(screen.getByText(firstProject.description)).toBeInTheDocument();
    
    // Check category badge
    const categoryBadges = screen.getAllByTestId("project-category");
    expect(categoryBadges.length).toBeGreaterThan(0);
  });

  it("has accessible tab navigation", () => {
    render(<ProjectsGrid />);
    
    const tablist = screen.getByRole("tablist");
    expect(tablist).toBeInTheDocument();
    expect(tablist).toHaveAttribute("aria-label", "Project filters");
    
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(filterTabs.length);
    
    // First tab should be selected by default
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    
    // Check tabpanel exists
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });
});
