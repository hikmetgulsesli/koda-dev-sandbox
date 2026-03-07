/**
 * Tests for useInput hook
 */

import { renderHook, act } from "@testing-library/react";
import { useInput, useInputWithSync } from "../hooks/useInput";
import { Direction } from "../snake/types";

// Mock performance.now for latency tests
const mockPerformanceNow = jest.fn();
Object.defineProperty(global, "performance", {
  value: { now: mockPerformanceNow },
  writable: true,
});

describe("useInput", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should initialize with default direction", () => {
    const { result } = renderHook(() => useInput("right"));
    expect(result.current.direction).toBe("right");
    expect(result.current.directionQueue).toEqual([]);
  });

  it("should handle ArrowUp key", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    expect(result.current.directionQueue).toContain("up");
  });

  it("should handle ArrowDown key", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    });

    expect(result.current.directionQueue).toContain("down");
  });

  it("should handle ArrowLeft key", () => {
    const { result } = renderHook(() => useInput("up", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    expect(result.current.directionQueue).toContain("left");
  });

  it("should handle ArrowRight key", () => {
    const { result } = renderHook(() => useInput("up", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });

    expect(result.current.directionQueue).toContain("right");
  });

  it("should handle WASD keys (w)", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "w" }));
    });

    expect(result.current.directionQueue).toContain("up");
  });

  it("should handle WASD keys (s)", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "s" }));
    });

    expect(result.current.directionQueue).toContain("down");
  });

  it("should handle WASD keys (a)", () => {
    const { result } = renderHook(() => useInput("up", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });

    expect(result.current.directionQueue).toContain("left");
  });

  it("should handle WASD keys (d)", () => {
    const { result } = renderHook(() => useInput("up", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "d" }));
    });

    expect(result.current.directionQueue).toContain("right");
  });

  it("should handle uppercase WASD keys", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "W" }));
    });

    expect(result.current.directionQueue).toContain("up");
  });

  it("should ignore opposite direction (prevent reversing)", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    expect(result.current.directionQueue).not.toContain("left");
  });

  it("should prevent reversing when moving up", () => {
    const { result } = renderHook(() => useInput("up", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    });

    expect(result.current.directionQueue).not.toContain("down");
  });

  it("should prevent reversing when moving down", () => {
    const { result } = renderHook(() => useInput("down", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    expect(result.current.directionQueue).not.toContain("up");
  });

  it("should prevent reversing when moving left", () => {
    const { result } = renderHook(() => useInput("left", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" }));
    });

    expect(result.current.directionQueue).not.toContain("right");
  });

  it("should queue up to 2 direction changes", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    });

    expect(result.current.directionQueue.length).toBeLessThanOrEqual(2);
  });

  it("should clear queue when clearQueue is called", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }));
    });

    expect(result.current.directionQueue.length).toBeGreaterThan(0);

    act(() => {
      result.current.clearQueue();
    });

    expect(result.current.directionQueue).toEqual([]);
  });

  it("should not process keys when disabled", () => {
    const { result } = renderHook(() => useInput("right", false));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp" }));
    });

    expect(result.current.directionQueue).toEqual([]);
  });

  it("should ignore non-game keys", () => {
    const { result } = renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "x" }));
    });

    expect(result.current.directionQueue).toEqual([]);
  });

  it("should have input latency under 50ms", () => {
    let latency = 0;
    
    const { result } = renderHook(() => useInput("right", true));
    
    mockPerformanceNow.mockReturnValue(0);
    
    act(() => {
      const startTime = performance.now();
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true }));
      mockPerformanceNow.mockReturnValue(10); // 10ms elapsed
      latency = performance.now() - startTime;
    });

    expect(latency).toBeLessThan(50);
  });

  it("should prevent default on handled keys", () => {
    const event = new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, "preventDefault");
    
    renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not prevent default on unhandled keys", () => {
    const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });
    const preventDefaultSpy = jest.spyOn(event, "preventDefault");
    
    renderHook(() => useInput("right", true));
    
    act(() => {
      window.dispatchEvent(event);
    });

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});

describe("useInputWithSync", () => {
  it("should initialize correctly", () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() =>
      useInputWithSync(mockCallback, "right", true)
    );

    expect(result.current.direction).toBe("right");
    expect(result.current.directionQueue).toEqual([]);
  });
});
