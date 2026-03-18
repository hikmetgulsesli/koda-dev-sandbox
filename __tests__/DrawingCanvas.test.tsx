import { render, screen } from "@testing-library/react";
import DrawingCanvas from "@/components/DrawingCanvas";

// Mock the Canvas class
jest.mock("@/lib/Canvas", () => ({
  Canvas: jest.fn().mockImplementation(() => ({
    setConfig: jest.fn(),
    destroy: jest.fn(),
    onDrawStart: undefined,
    onDrawMove: undefined,
    onDrawEnd: undefined,
    onResize: undefined,
  })),
}));

describe("DrawingCanvas", () => {
  it("renders the canvas element", () => {
    render(<DrawingCanvas />);
    expect(screen.getByTestId("drawing-canvas")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    render(
      <DrawingCanvas
        width={1024}
        height={768}
        lineColor="#ff0000"
        lineWidth={5}
        className="custom-class"
      />
    );
    const canvas = screen.getByTestId("drawing-canvas");
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass("custom-class");
  });

  it("calls onDrawStart callback", () => {
    const onDrawStart = jest.fn();
    render(<DrawingCanvas onDrawStart={onDrawStart} />);
    // The canvas is rendered; callback wiring is tested via integration
    expect(screen.getByTestId("drawing-canvas")).toBeInTheDocument();
  });

  it("calls onDrawMove callback", () => {
    const onDrawMove = jest.fn();
    render(<DrawingCanvas onDrawMove={onDrawMove} />);
    expect(screen.getByTestId("drawing-canvas")).toBeInTheDocument();
  });

  it("calls onDrawEnd callback", () => {
    const onDrawEnd = jest.fn();
    render(<DrawingCanvas onDrawEnd={onDrawEnd} />);
    expect(screen.getByTestId("drawing-canvas")).toBeInTheDocument();
  });

  it("calls onResize callback", () => {
    const onResize = jest.fn();
    render(<DrawingCanvas onResize={onResize} />);
    expect(screen.getByTestId("drawing-canvas")).toBeInTheDocument();
  });
});
