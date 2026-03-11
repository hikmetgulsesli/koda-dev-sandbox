/**
 * Snake Game Types
 */

export type Direction = "up" | "down" | "left" | "right";

export interface Position {
  x: number;
  y: number;
}

export interface SnakeState {
  body: Position[];
  direction: Direction;
  nextDirection: Direction;
}

export interface GameConfig {
  gridSize: number;
  baseSpeed: number;
  speedIncrement: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 20,
  baseSpeed: 150,
  speedIncrement: 10,
};

/**
 * Get the opposite direction to prevent reversing
 */
export function getOppositeDirection(direction: Direction): Direction {
  switch (direction) {
    case "up":
      return "down";
    case "down":
      return "up";
    case "left":
      return "right";
    case "right":
      return "left";
  }
}

/**
 * Check if a direction change is valid (not reversing)
 */
export function isValidDirectionChange(
  current: Direction,
  next: Direction
): boolean {
  return getOppositeDirection(current) !== next;
}

/**
 * Get velocity delta for a direction
 */
export function getDirectionDelta(direction: Direction): Position {
  switch (direction) {
    case "up":
      return { x: 0, y: -1 };
    case "down":
      return { x: 0, y: 1 };
    case "left":
      return { x: -1, y: 0 };
    case "right":
      return { x: 1, y: 0 };
  }
}

/**
 * Calculate current speed based on difficulty/score
 */
export function calculateSpeed(
  config: GameConfig,
  score: number
): number {
  const speedIncrease = Math.floor(score / 10) * config.speedIncrement;
  return Math.max(50, config.baseSpeed - speedIncrease);
}
