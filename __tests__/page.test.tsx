import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

// Mock the Three.js canvas since it requires WebGL context
jest.mock("@/components/three/ThreeCanvas", () => {
  return function MockThreeCanvas() {
    return <div data-testid="three-canvas">Three.js Canvas Mock</div>;
  };
});

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText("3D Game App")).toBeInTheDocument();
  });

  it("renders the Three.js canvas", () => {
    render(<Home />);
    expect(screen.getByTestId("three-canvas")).toBeInTheDocument();
  });

  it("renders the feature cards", () => {
    render(<Home />);
    expect(screen.getByText("Next.js Version")).toBeInTheDocument();
    expect(screen.getByText("Three.js Powered")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the footer", () => {
    render(<Home />);
    expect(screen.getByText(/Built with Next.js/)).toBeInTheDocument();
  });
});
