/**
 * Tests for useGameLoop hook
 */

import { renderHook, act } from "@testing-library/react";
import { useGameLoop, useGameLoopSmooth } from "../hooks/useGameLoop";
import { Direction } from "../snake/types";

describe("useGameLoop", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should not be running initially", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => 150,
        false
      )
    );

    expect(result.current.isRunning).toBe(false);
  });

  it("should start running when enabled", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => 150,
        true
      )
    );

    expect(result.current.isRunning).toBe(true);
  });

  it("should call onTick at the specified interval", () => {
    const mockTick = jest.fn();
    const speed = 150;

    renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => speed,
        true
      )
    );

    // Advance by speed ms
    act(() => {
      jest.advanceTimersByTime(speed);
    });

    expect(mockTick).toHaveBeenCalledTimes(1);
    expect(mockTick).toHaveBeenCalledWith("right");
  });

  it("should call onTick multiple times over multiple intervals", () => {
    const mockTick = jest.fn();
    const speed = 100;

    renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => speed,
        true
      )
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockTick).toHaveBeenCalledTimes(5);
  });

  it("should pass current direction to onTick", () => {
    const mockTick = jest.fn();
    let currentDirection: Direction = "right";

    renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => currentDirection,
        () => 100,
        true
      )
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTick).toHaveBeenCalledWith("right");

    currentDirection = "up";

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTick).toHaveBeenCalledWith("up");
  });

  it("should update interval when speed changes", () => {
    const mockTick = jest.fn();
    let speed = 200;

    const { rerender } = renderHook(
      ({ getSpeed }) =>
        useGameLoop(
          { onTick: mockTick },
          () => "right",
          getSpeed,
          true
        ),
      {
        initialProps: { getSpeed: () => speed },
      }
    );

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockTick).toHaveBeenCalledTimes(1);

    // Change speed
    speed = 100;
    rerender({ getSpeed: () => speed });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTick).toHaveBeenCalledTimes(2);
  });

  it("should stop when stop is called", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => 100,
        true
      )
    );

    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.stop();
    });

    expect(result.current.isRunning).toBe(false);

    act(() => {
      jest.advanceTimersByTime(200);
    });

    // Should not have called tick after stopping
    const callCount = mockTick.mock.calls.length;
    
    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(mockTick).toHaveBeenCalledTimes(callCount);
  });

  it("should start when start is called", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => 100,
        false
      )
    );

    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockTick).toHaveBeenCalled();
  });

  it("should reset correctly", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => 100,
        true
      )
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(mockTick).toHaveBeenCalledTimes(5);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isRunning).toBe(false);
    expect(result.current.fps).toBe(0);
  });

  it("should use onUpdateDirection callback if provided", () => {
    const mockTick = jest.fn();
    const mockUpdateDirection = jest.fn((d: Direction) => d);

    renderHook(() =>
      useGameLoop(
        { onTick: mockTick, onUpdateDirection: mockUpdateDirection },
        () => "right",
        () => 100,
        true
      )
    );

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockUpdateDirection).toHaveBeenCalledWith("right");
    expect(mockTick).toHaveBeenCalledWith("right");
  });

  it("should track FPS", () => {
    const mockTick = jest.fn();
    const speed = 16; // ~60fps

    const { result } = renderHook(() =>
      useGameLoop(
        { onTick: mockTick },
        () => "right",
        () => speed,
        true
      )
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // FPS should be calculated after 1 second
    expect(result.current.fps).toBeGreaterThan(0);
  });
});

describe("useGameLoopSmooth", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize correctly", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoopSmooth(
        { onTick: mockTick },
        () => "right",
        () => 100,
        false
      )
    );

    expect(result.current.isRunning).toBe(false);
    expect(result.current.interpolation).toBe(0);
  });

  it("should start when enabled", () => {
    const mockTick = jest.fn();
    const { result } = renderHook(() =>
      useGameLoopSmooth(
        { onTick: mockTick },
        () => "right",
        () => 100,
        true
      )
    );

    expect(result.current.isRunning).toBe(true);
  });
});
