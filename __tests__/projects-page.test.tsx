import { render, screen } from "@testing-library/react";
import ProjectsPage from "@/app/projects/page";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("Projects Page", () => {
  it("renders the heading 'Projects and Open Source'", () => {
    render(<ProjectsPage />);
    expect(screen.getByText("Projects and Open Source")).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<ProjectsPage />);
    expect(
      screen.getByText(/A collection of web applications, mobile apps, design systems, and open source contributions/)
    ).toBeInTheDocument();
  });

  it("renders the ProjectsGrid component with filter tabs", () => {
    render(<ProjectsPage />);
    expect(screen.getByTestId("projects-grid")).toBeInTheDocument();
    expect(screen.getByTestId("filter-tabs")).toBeInTheDocument();
  });

  it("renders project cards", () => {
    render(<ProjectsPage />);
    expect(screen.getAllByTestId("project-card").length).toBeGreaterThan(0);
  });
});
