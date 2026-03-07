/**
 * Collision Detection System
 * Implements AABB, Circle-Rectangle, and sub-frame collision detection
 */

import { Vector2, Ball, Rectangle, AABB, CollisionResult, Brick, Paddle, Wall } from "./types";

/**
 * Convert Rectangle to AABB format
 */
export function rectangleToAABB(rect: Rectangle): AABB {
  return {
    minX: rect.x,
    minY: rect.y,
    maxX: rect.x + rect.width,
    maxY: rect.y + rect.height,
  };
}

/**
 * Convert Ball to AABB (approximate bounding box)
 */
export function ballToAABB(ball: Ball): AABB {
  return {
    minX: ball.position.x - ball.radius,
    minY: ball.position.y - ball.radius,
    maxX: ball.position.x + ball.radius,
    maxY: ball.position.y + ball.radius,
  };
}

/**
 * AABB collision detection
 * Fast check for axis-aligned rectangle overlap
 */
export function checkAABBCollision(a: AABB, b: AABB): boolean {
  return (
    a.minX < b.maxX &&
    a.maxX > b.minX &&
    a.minY < b.maxY &&
    a.maxY > b.minY
  );
}

/**
 * Get AABB overlap information
 */
export function getAABBCollisionResult(a: AABB, b: AABB): CollisionResult {
  const overlapX = Math.min(a.maxX - b.minX, b.maxX - a.minX);
  const overlapY = Math.min(a.maxY - b.minY, b.maxY - a.minY);

  if (overlapX <= 0 || overlapY <= 0) {
    return { collided: false };
  }

  // Determine collision normal based on smallest overlap
  // Normal points FROM b TO a (the direction to push a out of b)
  let normal: Vector2;
  if (overlapX < overlapY) {
    // Horizontal collision - determine which side
    const aCenterX = (a.minX + a.maxX) / 2;
    const bCenterX = (b.minX + b.maxX) / 2;
    normal = { x: aCenterX < bCenterX ? -1 : 1, y: 0 };
  } else {
    // Vertical collision - determine which side
    const aCenterY = (a.minY + a.maxY) / 2;
    const bCenterY = (b.minY + b.maxY) / 2;
    normal = { x: 0, y: aCenterY < bCenterY ? -1 : 1 };
  }

  return {
    collided: true,
    normal,
    penetration: Math.min(overlapX, overlapY),
  };
}

/**
 * Circle-Rectangle collision detection
 * Precise collision between circle (ball) and axis-aligned rectangle
 */
export function checkCircleRectangleCollision(
  ball: Ball,
  rect: Rectangle
): CollisionResult {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(rect.x, Math.min(ball.position.x, rect.x + rect.width));
  const closestY = Math.max(rect.y, Math.min(ball.position.y, rect.y + rect.height));

  // Calculate distance from circle center to closest point
  const dx = ball.position.x - closestX;
  const dy = ball.position.y - closestY;
  const distanceSquared = dx * dx + dy * dy;

  if (distanceSquared > ball.radius * ball.radius) {
    return { collided: false };
  }

  // Calculate collision normal
  let normal: Vector2;
  const distance = Math.sqrt(distanceSquared);

  if (distance === 0) {
    // Circle center is inside the rectangle - use direction from center
    const centerX = rect.x + rect.width / 2;
    const centerY = rect.y + rect.height / 2;
    const dx2 = ball.position.x - centerX;
    const dy2 = ball.position.y - centerY;
    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2) || 1;
    normal = { x: dx2 / dist2, y: dy2 / dist2 };
  } else {
    normal = { x: dx / distance, y: dy / distance };
  }

  return {
    collided: true,
    normal,
    penetration: ball.radius - distance,
    contactPoint: { x: closestX, y: closestY },
  };
}

/**
 * Ray-circle intersection for sub-frame collision detection
 * Returns time of collision (0-1) or null if no collision
 */
export function rayCircleIntersection(
  start: Vector2,
  end: Vector2,
  circleCenter: Vector2,
  radius: number
): number | null {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const fx = start.x - circleCenter.x;
  const fy = start.y - circleCenter.y;

  const a = dx * dx + dy * dy;
  
  // Handle zero movement case
  if (a === 0) {
    const distSq = fx * fx + fy * fy;
    return distSq <= radius * radius ? 0 : null;
  }
  
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;

  const discriminant = b * b - 4 * a * c;

  if (discriminant < 0) {
    return null;
  }

  const discriminantSqrt = Math.sqrt(discriminant);
  const t1 = (-b - discriminantSqrt) / (2 * a);
  const t2 = (-b + discriminantSqrt) / (2 * a);

  // Check if starting inside or on circle (c <= 0 means start is inside or on boundary)
  if (c <= 0) {
    // Starting inside - collision starts at time 0
    return 0;
  }

  // Return the earliest valid collision time
  if (t1 >= 0 && t1 <= 1) return t1;
  if (t2 >= 0 && t2 <= 1) return t2;

  return null;
}

/**
 * Sub-frame collision detection for high-speed balls
 * Prevents tunneling by checking if the ball's path intersects objects
 */
export function checkSubFrameCollision(
  previousBall: Ball,
  currentBall: Ball,
  rect: Rectangle
): CollisionResult {
  // First check current position
  const currentCollision = checkCircleRectangleCollision(currentBall, rect);
  if (currentCollision.collided) {
    return { ...currentCollision, time: 1 };
  }

  // Check if ball passed through rectangle during this frame
  const ballAABB = ballToAABB(previousBall);
  const rectAABB = rectangleToAABB(rect);

  // Expand AABB to cover the sweep
  const sweepAABB: AABB = {
    minX: Math.min(ballAABB.minX, currentBall.position.x - currentBall.radius),
    minY: Math.min(ballAABB.minY, currentBall.position.y - currentBall.radius),
    maxX: Math.max(ballAABB.maxX, currentBall.position.x + currentBall.radius),
    maxY: Math.max(ballAABB.maxY, currentBall.position.y + currentBall.radius),
  };

  if (!checkAABBCollision(sweepAABB, rectAABB)) {
    return { collided: false };
  }

  // Check circle-rectangle at intermediate positions
  const steps = 4; // Number of sub-steps to check
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const interpolatedBall: Ball = {
      ...currentBall,
      position: {
        x: previousBall.position.x + (currentBall.position.x - previousBall.position.x) * t,
        y: previousBall.position.y + (currentBall.position.y - previousBall.position.y) * t,
      },
    };

    const collision = checkCircleRectangleCollision(interpolatedBall, rect);
    if (collision.collided) {
      return { ...collision, time: t };
    }
  }

  return { collided: false };
}

/**
 * Reflect velocity vector across a normal
 */
export function reflectVelocity(velocity: Vector2, normal: Vector2): Vector2 {
  const dot = velocity.x * normal.x + velocity.y * normal.y;
  return {
    x: velocity.x - 2 * dot * normal.x,
    y: velocity.y - 2 * dot * normal.y,
  };
}

/**
 * Calculate ball reflection after collision with brick
 * Returns new velocity and updated brick
 */
export function resolveBallBrickCollision(
  ball: Ball,
  brick: Brick,
  collision: CollisionResult
): { newVelocity: Vector2; updatedBrick: Brick } {
  if (!collision.normal) {
    return { newVelocity: ball.velocity, updatedBrick: brick };
  }

  const newVelocity = reflectVelocity(ball.velocity, collision.normal);
  const newDurability = brick.durability - 1;

  return {
    newVelocity,
    updatedBrick: {
      ...brick,
      durability: newDurability,
      isDestroyed: newDurability <= 0,
    },
  };
}

/**
 * Calculate ball reflection with angle physics for paddle collision
 * The hit position on the paddle affects the bounce angle
 */
export function resolveBallPaddleCollision(
  ball: Ball,
  paddle: Paddle,
  collision: CollisionResult
): Vector2 {
  if (!collision.normal) {
    return ball.velocity;
  }

  // Calculate hit position relative to paddle center (-1 to 1)
  const paddleCenterX = paddle.x + paddle.width / 2;
  const hitOffset = (ball.position.x - paddleCenterX) / (paddle.width / 2);
  const clampedOffset = Math.max(-1, Math.min(1, hitOffset));

  // Base reflection
  let newVelocity = reflectVelocity(ball.velocity, collision.normal);

  // Apply angle physics based on hit position
  // Hitting the edges adds horizontal velocity
  const angleInfluence = 0.5; // How much the angle affects the bounce
  const currentSpeed = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
  
  newVelocity.x += clampedOffset * angleInfluence * currentSpeed;
  
  // Normalize to maintain speed
  const newSpeed = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
  if (newSpeed > 0) {
    newVelocity.x = (newVelocity.x / newSpeed) * currentSpeed;
    newVelocity.y = (newVelocity.y / newSpeed) * currentSpeed;
  }

  // Ensure ball goes upward after paddle hit
  if (newVelocity.y > 0) {
    newVelocity.y = -Math.abs(newVelocity.y);
  }

  return newVelocity;
}

/**
 * Calculate ball reflection after wall collision
 * Normal should point away from the wall surface
 */
export function resolveBallWallCollision(
  ball: Ball,
  wall: Wall,
  collision: CollisionResult
): Vector2 {
  if (!collision.normal) {
    return ball.velocity;
  }

  // Determine correct normal based on wall type and ball position
  let surfaceNormal: Vector2;
  
  switch (wall.type) {
    case "top":
      // Top wall normal points down (positive y)
      surfaceNormal = { x: 0, y: 1 };
      break;
    case "bottom":
      // Bottom wall normal points up (negative y)
      surfaceNormal = { x: 0, y: -1 };
      break;
    case "left":
      // Left wall normal points right (positive x)
      surfaceNormal = { x: 1, y: 0 };
      break;
    case "right":
      // Right wall normal points left (negative x)
      surfaceNormal = { x: -1, y: 0 };
      break;
    default:
      surfaceNormal = collision.normal;
  }

  return reflectVelocity(ball.velocity, surfaceNormal);
}

/**
 * Check all brick collisions and return the first one
 */
export function checkBallBrickCollisions(
  ball: Ball,
  bricks: Brick[]
): { brick: Brick | null; collision: CollisionResult } {
  for (const brick of bricks) {
    if (brick.isDestroyed) continue;

    const collision = checkCircleRectangleCollision(ball, brick);
    if (collision.collided) {
      return { brick, collision };
    }
  }
  return { brick: null, collision: { collided: false } };
}

/**
 * Check paddle collision
 */
export function checkBallPaddleCollision(
  ball: Ball,
  paddle: Paddle
): CollisionResult {
  return checkCircleRectangleCollision(ball, paddle);
}

/**
 * Check all wall collisions
 */
export function checkBallWallCollisions(
  ball: Ball,
  walls: Wall[]
): { wall: Wall | null; collision: CollisionResult } {
  for (const wall of walls) {
    const collision = checkCircleRectangleCollision(ball, wall);
    if (collision.collided) {
      return { wall, collision };
    }
  }
  return { wall: null, collision: { collided: false } };
}
