/**
 * useInput Hook - Keyboard input handling for Snake game
 * Captures WASD and Arrow keys with direction queue to prevent reversing
 */

import { useEffect, useRef, useCallback } from "react";
import { Direction, isValidDirectionChange } from "../snake/types";

export interface InputState {
  direction: Direction;
  directionQueue: Direction[];
}

export interface UseInputReturn {
  direction: Direction;
  directionQueue: Direction[];
  clearQueue: () => void;
}

const KEY_MAPPINGS: Record<string, Direction> = {
  // Arrow keys
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  // WASD keys
  w: "up",
  W: "up",
  s: "down",
  S: "down",
  a: "left",
  A: "left",
  d: "right",
  D: "right",
};

const MAX_QUEUE_SIZE = 2;

export function useInput(
  initialDirection: Direction = "right",
  enabled: boolean = true
): UseInputReturn {
  const directionRef = useRef<Direction>(initialDirection);
  const queueRef = useRef<Direction[]>([]);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
  }, []);

  const processKey = useCallback((key: string): boolean => {
    const newDirection = KEY_MAPPINGS[key];
    if (!newDirection) return false;

    const currentDirection = directionRef.current;
    const lastQueued = queueRef.current[queueRef.current.length - 1] ?? currentDirection;

    // Ignore if trying to reverse direction
    if (!isValidDirectionChange(lastQueued, newDirection)) {
      return false;
    }

    // Add to queue if not full and different from last queued
    if (
      queueRef.current.length < MAX_QUEUE_SIZE &&
      newDirection !== lastQueued
    ) {
      queueRef.current.push(newDirection);
    }

    return true;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const handled = processKey(event.key);
      if (handled) {
        event.preventDefault();
      }
    };

    // Use capture phase for lower latency
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [enabled, processKey]);

  return {
    get direction() {
      return directionRef.current;
    },
    get directionQueue() {
      return [...queueRef.current];
    },
    clearQueue,
  };
}

export function useInputWithSync(
  onDirectionChange: (direction: Direction) => void,
  initialDirection: Direction = "right",
  enabled: boolean = true
): UseInputReturn {
  const directionRef = useRef<Direction>(initialDirection);
  const queueRef = useRef<Direction[]>([]);

  const clearQueue = useCallback(() => {
    queueRef.current = [];
  }, []);

  const processKey = useCallback((key: string): boolean => {
    const newDirection = KEY_MAPPINGS[key];
    if (!newDirection) return false;

    const currentDirection = directionRef.current;
    const lastQueued = queueRef.current[queueRef.current.length - 1] ?? currentDirection;

    // Ignore if trying to reverse direction
    if (!isValidDirectionChange(lastQueued, newDirection)) {
      return false;
    }

    // Add to queue if not full and different from last queued
    if (
      queueRef.current.length < MAX_QUEUE_SIZE &&
      newDirection !== lastQueued
    ) {
      queueRef.current.push(newDirection);
    }

    return true;
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const startTime = performance.now();
      const handled = processKey(event.key);
      
      if (handled) {
        event.preventDefault();
        const latency = performance.now() - startTime;
        
        // Log latency for debugging (should be under 50ms)
        if (latency > 50) {
          console.warn(`Input latency exceeded 50ms: ${latency.toFixed(2)}ms`);
        }
      }
    };

    // Use capture phase for lower latency
    window.addEventListener("keydown", handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [enabled, processKey]);

  // Sync direction with callback
  useEffect(() => {
    directionRef.current = initialDirection;
  }, [initialDirection]);

  return {
    get direction() {
      return directionRef.current;
    },
    get directionQueue() {
      return [...queueRef.current];
    },
    clearQueue,
  };
}
