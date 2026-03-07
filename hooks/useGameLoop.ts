/**
 * useGameLoop Hook - Game loop for Snake game
 * Uses setInterval with dynamic speed based on difficulty
 */

import { useEffect, useRef, useCallback } from "react";
import { Direction, calculateSpeed, GameConfig, DEFAULT_CONFIG } from "../snake/types";

export interface GameLoopCallbacks {
  onTick: (direction: Direction) => void;
  onUpdateDirection?: (direction: Direction) => Direction;
}

export interface UseGameLoopReturn {
  isRunning: boolean;
  fps: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useGameLoop(
  callbacks: GameLoopCallbacks,
  getDirection: () => Direction,
  getSpeed: () => number,
  enabled: boolean = true
): UseGameLoopReturn {
  const isRunningRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  const fpsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (fpsIntervalRef.current) {
      clearInterval(fpsIntervalRef.current);
      fpsIntervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const direction = getDirection();
    
    // Update direction if callback provided (for queue processing)
    const finalDirection = callbacks.onUpdateDirection
      ? callbacks.onUpdateDirection(direction)
      : direction;

    callbacks.onTick(finalDirection);
    
    lastTickRef.current = now;
    frameCountRef.current++;
  }, [callbacks, getDirection]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    const speed = getSpeed();
    
    // Set up the game tick interval
    intervalRef.current = setInterval(tick, speed);
    
    // Set up FPS counter (updates every second)
    fpsIntervalRef.current = setInterval(() => {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
    }, 1000);
  }, [getSpeed, tick]);

  const reset = useCallback(() => {
    stop();
    frameCountRef.current = 0;
    fpsRef.current = 0;
    lastTickRef.current = 0;
  }, [stop]);

  // Update interval when speed changes
  useEffect(() => {
    if (!isRunningRef.current || !enabled) return;
    
    // Clear existing interval and restart with new speed
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    const speed = getSpeed();
    intervalRef.current = setInterval(tick, speed);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [getSpeed, tick, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Auto-start/stop based on enabled
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
  }, [enabled, start, stop]);

  return {
    get isRunning() {
      return isRunningRef.current;
    },
    get fps() {
      return fpsRef.current;
    },
    start,
    stop,
    reset,
  };
}

/**
 * Advanced game loop with RAF for smooth rendering + setInterval for game logic
 * Targets 60fps with smooth movement
 */
export function useGameLoopSmooth(
  callbacks: GameLoopCallbacks,
  getDirection: () => Direction,
  getSpeed: () => number,
  enabled: boolean = true
): UseGameLoopReturn & { interpolation: number } {
  const isRunningRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const accumulatorRef = useRef(0);
  const interpolationRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsRef = useRef(0);
  const lastFpsUpdateRef = useRef(0);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const gameLoop = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    const speed = getSpeed();
    const tickDuration = speed; // ms per game tick

    // Calculate delta time
    if (lastTickRef.current === 0) {
      lastTickRef.current = timestamp;
    }
    const deltaTime = timestamp - lastTickRef.current;
    lastTickRef.current = timestamp;

    // Accumulate time for fixed timestep
    accumulatorRef.current += deltaTime;

    // Process game ticks
    while (accumulatorRef.current >= tickDuration) {
      const direction = getDirection();
      const finalDirection = callbacks.onUpdateDirection
        ? callbacks.onUpdateDirection(direction)
        : direction;

      callbacks.onTick(finalDirection);
      accumulatorRef.current -= tickDuration;
    }

    // Calculate interpolation for smooth rendering
    interpolationRef.current = accumulatorRef.current / tickDuration;

    // Update FPS counter
    frameCountRef.current++;
    if (timestamp - lastFpsUpdateRef.current >= 1000) {
      fpsRef.current = frameCountRef.current;
      frameCountRef.current = 0;
      lastFpsUpdateRef.current = timestamp;
    }

    // Schedule next frame
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [callbacks, getDirection, getSpeed]);

  const start = useCallback(() => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    lastTickRef.current = 0;
    accumulatorRef.current = 0;
    lastFpsUpdateRef.current = performance.now();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const reset = useCallback(() => {
    stop();
    lastTickRef.current = 0;
    accumulatorRef.current = 0;
    interpolationRef.current = 0;
    frameCountRef.current = 0;
    fpsRef.current = 0;
    lastFpsUpdateRef.current = 0;
  }, [stop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  // Auto-start/stop based on enabled
  useEffect(() => {
    if (enabled) {
      start();
    } else {
      stop();
    }
  }, [enabled, start, stop]);

  return {
    get isRunning() {
      return isRunningRef.current;
    },
    get fps() {
      return fpsRef.current;
    },
    get interpolation() {
      return interpolationRef.current;
    },
    start,
    stop,
    reset,
  };
}
