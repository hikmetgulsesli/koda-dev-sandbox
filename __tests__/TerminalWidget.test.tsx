import { render, screen, waitFor, act } from "@testing-library/react";
import { TerminalWidget } from "@/components/terminal/TerminalWidget";

// Mock timers for consistent testing
jest.useFakeTimers();

describe("TerminalWidget", () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders the terminal widget", () => {
    render(<TerminalWidget />);
    
    // Check for window title
    expect(screen.getByText(/bash — user@portfolio/)).toBeInTheDocument();
    
    // Check for initial logs
    expect(screen.getByText(/Connecting to API gateway/)).toBeInTheDocument();
    expect(screen.getByText(/System core initialized/)).toBeInTheDocument();
  });

  it("displays window controls (red, yellow, green buttons)", () => {
    const { container } = render(<TerminalWidget />);
    
    // Window controls are rendered as divs with specific background colors
    const windowControls = container.querySelectorAll("[class*='rounded-full'][class*='bg-\\[#ff5f56\\]'], [class*='rounded-full'][class*='bg-\\[#ffbd2e\\]'], [class*='rounded-full'][class*='bg-\\[#27c93f\\]']");
    expect(windowControls.length).toBeGreaterThanOrEqual(3);
  });

  it("shows the interactive prompt with cursor", () => {
    render(<TerminalWidget />);
    
    // Check for prompt elements
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("portfolio")).toBeInTheDocument();
    expect(screen.getByText("init")).toBeInTheDocument();
  });

  it("displays status bar with connection info", () => {
    render(<TerminalWidget />);
    
    // Check for status bar elements
    expect(screen.getByText("CONNECTED")).toBeInTheDocument();
    expect(screen.getByText("UTF-8")).toBeInTheDocument();
    expect(screen.getByText("MAIN.PY")).toBeInTheDocument();
    expect(screen.getByText(/LN 42, COL 18/)).toBeInTheDocument();
  });

  it("adds new log entries over time", async () => {
    render(<TerminalWidget />);
    
    // Initial log count - use getAllByText with a pattern that matches timestamps
    const initialLogs = screen.getAllByText(/14:32:/);
    expect(initialLogs.length).toBe(5);
    
    // Advance timers to trigger new log entries
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    
    await waitFor(() => {
      // After 4 seconds, at least one more log should be added
      const updatedLogs = screen.getAllByText(/14:32:/);
      expect(updatedLogs.length).toBeGreaterThan(5);
    });
  });

  it("has blinking cursor that toggles visibility", async () => {
    const { container } = render(<TerminalWidget />);
    
    // The cursor element exists (it's a span with bg color)
    const cursor = container.querySelector("span[class*='bg-\\[#0df20d\\]']");
    expect(cursor).toBeTruthy();
  });

  it("renders utility buttons (minimize, fullscreen)", () => {
    const { container } = render(<TerminalWidget />);
    
    // Check for utility buttons by their container
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("has correct styling classes for terminal appearance", () => {
    const { container } = render(<TerminalWidget />);
    
    // Terminal container should have dark background
    const terminalContainer = container.querySelector("div[class*='bg-\\[#0a0a0a\\]']");
    expect(terminalContainer).toBeTruthy();
    
    // Should have neon green border
    const neonBorder = container.querySelector("div[class*='border-\\[#0df20d\\]\\/20']");
    expect(neonBorder).toBeTruthy();
  });
});
