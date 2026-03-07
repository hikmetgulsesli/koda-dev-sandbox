/**
 * Collision Detection Types
 * Types for Breakout/Arkanoid style game entities
 */

export interface Vector2 {
  x: number;
  y: number;
}

export interface Ball {
  position: Vector2;
  velocity: Vector2;
  radius: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Brick extends Rectangle {
  id: string;
  durability: number;
  maxDurability: number;
  isDestroyed: boolean;
}

export interface Paddle extends Rectangle {
  speed: number;
}

export interface Wall extends Rectangle {
  type: "top" | "left" | "right" | "bottom";
}

export interface CollisionResult {
  collided: boolean;
  normal?: Vector2; // Surface normal at collision point
  penetration?: number; // How much overlap occurred
  contactPoint?: Vector2;
  time?: number; // Time of collision (0-1 for sub-frame)
}

export interface AABB {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
