import { render, screen } from "@testing-library/react";
import ThreeCanvas from "@/components/three/ThreeCanvas";

// Mock @react-three/fiber and @react-three/drei
jest.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useFrame: jest.fn(),
}));

jest.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls">OrbitControls</div>,
}));

describe("ThreeCanvas", () => {
  it("renders the canvas wrapper", () => {
    render(<ThreeCanvas />);
    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });

  it("includes orbit controls", () => {
    render(<ThreeCanvas />);
    expect(screen.getByTestId("orbit-controls")).toBeInTheDocument();
  });
});
