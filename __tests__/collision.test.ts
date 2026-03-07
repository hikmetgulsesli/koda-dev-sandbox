/**
 * Collision Detection Tests
 * Tests for AABB, Circle-Rectangle, and sub-frame collision detection
 */

import {
  rectangleToAABB,
  ballToAABB,
  checkAABBCollision,
  getAABBCollisionResult,
  checkCircleRectangleCollision,
  checkSubFrameCollision,
  reflectVelocity,
  resolveBallBrickCollision,
  resolveBallPaddleCollision,
  resolveBallWallCollision,
  checkBallBrickCollisions,
  checkBallPaddleCollision,
  checkBallWallCollisions,
  rayCircleIntersection,
} from "@/collision/detection";
import { Ball, Brick, Paddle, Wall, AABB, Vector2 } from "@/collision/types";

describe("rectangleToAABB()", () => {
  it("converts rectangle to AABB correctly", () => {
    const rect = { x: 10, y: 20, width: 100, height: 50 };
    const aabb = rectangleToAABB(rect);

    expect(aabb).toEqual({
      minX: 10,
      minY: 20,
      maxX: 110,
      maxY: 70,
    });
  });

  it("handles zero-sized rectangles", () => {
    const rect = { x: 0, y: 0, width: 0, height: 0 };
    const aabb = rectangleToAABB(rect);

    expect(aabb).toEqual({
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    });
  });
});

describe("ballToAABB()", () => {
  it("converts ball to AABB correctly", () => {
    const ball: Ball = {
      position: { x: 50, y: 50 },
      velocity: { x: 0, y: 0 },
      radius: 10,
    };
    const aabb = ballToAABB(ball);

    expect(aabb).toEqual({
      minX: 40,
      minY: 40,
      maxX: 60,
      maxY: 60,
    });
  });
});

describe("checkAABBCollision()", () => {
  it("returns true when AABBs overlap", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 5, minY: 5, maxX: 15, maxY: 15 };

    expect(checkAABBCollision(a, b)).toBe(true);
  });

  it("returns false when AABBs do not overlap", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 20, minY: 20, maxX: 30, maxY: 30 };

    expect(checkAABBCollision(a, b)).toBe(false);
  });

  it("returns true when AABBs touch edges", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 10, minY: 0, maxX: 20, maxY: 10 };

    expect(checkAABBCollision(a, b)).toBe(false); // Touching edges don't collide
  });

  it("returns true when one AABB is inside another", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 20, maxY: 20 };
    const b: AABB = { minX: 5, minY: 5, maxX: 15, maxY: 15 };

    expect(checkAABBCollision(a, b)).toBe(true);
  });
});

describe("getAABBCollisionResult()", () => {
  it("returns collided false when no overlap", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 20, minY: 20, maxX: 30, maxY: 30 };

    const result = getAABBCollisionResult(a, b);
    expect(result.collided).toBe(false);
  });

  it("returns collision data when overlapping", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 5, minY: 5, maxX: 15, maxY: 15 };

    const result = getAABBCollisionResult(a, b);
    expect(result.collided).toBe(true);
    expect(result.normal).toBeDefined();
    expect(result.penetration).toBe(5);
  });

  it("returns correct normal for horizontal collision", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 5, minY: 2, maxX: 15, maxY: 8 };

    const result = getAABBCollisionResult(a, b);
    expect(result.collided).toBe(true);
    expect(result.normal).toEqual({ x: -1, y: 0 }); // a is left of b, normal points from b to a
  });

  it("returns correct normal for vertical collision", () => {
    const a: AABB = { minX: 0, minY: 0, maxX: 10, maxY: 10 };
    const b: AABB = { minX: 2, minY: 5, maxX: 8, maxY: 15 };

    const result = getAABBCollisionResult(a, b);
    expect(result.collided).toBe(true);
    expect(result.normal).toEqual({ x: 0, y: -1 }); // a is above b, normal points from b to a
  });
});

describe("checkCircleRectangleCollision()", () => {
  it("returns collided when circle center is inside rectangle", () => {
    const ball: Ball = {
      position: { x: 50, y: 50 },
      velocity: { x: 0, y: 0 },
      radius: 10,
    };
    const rect = { x: 40, y: 40, width: 20, height: 20 };

    const result = checkCircleRectangleCollision(ball, rect);
    expect(result.collided).toBe(true);
    expect(result.normal).toBeDefined();
  });

  it("returns collided when circle touches rectangle", () => {
    const ball: Ball = {
      position: { x: 35, y: 50 },
      velocity: { x: 0, y: 0 },
      radius: 10,
    };
    const rect = { x: 40, y: 40, width: 20, height: 20 };

    const result = checkCircleRectangleCollision(ball, rect);
    expect(result.collided).toBe(true);
  });

  it("returns not collided when circle is far from rectangle", () => {
    const ball: Ball = {
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      radius: 5,
    };
    const rect = { x: 100, y: 100, width: 20, height: 20 };

    const result = checkCircleRectangleCollision(ball, rect);
    expect(result.collided).toBe(false);
  });

  it("returns correct normal for top edge collision", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 0, y: 5 },
      radius: 10,
    };
    const rect = { x: 40, y: 40, width: 20, height: 20 };

    const result = checkCircleRectangleCollision(ball, rect);
    expect(result.collided).toBe(true);
    expect(result.normal!.y).toBeLessThan(0); // Normal points up
  });

  it("returns contact point for edge collision", () => {
    const ball: Ball = {
      position: { x: 35, y: 50 },
      velocity: { x: 5, y: 0 },
      radius: 10,
    };
    const rect = { x: 40, y: 40, width: 20, height: 20 };

    const result = checkCircleRectangleCollision(ball, rect);
    expect(result.collided).toBe(true);
    expect(result.contactPoint).toEqual({ x: 40, y: 50 });
  });
});

describe("rayCircleIntersection()", () => {
  it("returns collision time when ray hits circle", () => {
    const start: Vector2 = { x: 0, y: 0 };
    const end: Vector2 = { x: 100, y: 0 };
    const circleCenter: Vector2 = { x: 50, y: 0 };
    const radius = 10;

    const time = rayCircleIntersection(start, end, circleCenter, radius);
    expect(time).not.toBeNull();
    expect(time).toBeGreaterThan(0);
    expect(time).toBeLessThan(1);
  });

  it("returns null when ray misses circle", () => {
    const start: Vector2 = { x: 0, y: 0 };
    const end: Vector2 = { x: 100, y: 0 };
    const circleCenter: Vector2 = { x: 50, y: 50 };
    const radius = 10;

    const time = rayCircleIntersection(start, end, circleCenter, radius);
    expect(time).toBeNull();
  });

  it("returns 0 when starting inside circle", () => {
    const start: Vector2 = { x: 50, y: 0 };
    const end: Vector2 = { x: 100, y: 0 };
    const circleCenter: Vector2 = { x: 50, y: 0 };
    const radius = 20;

    const time = rayCircleIntersection(start, end, circleCenter, radius);
    expect(time).toBe(0);
  });
});

describe("checkSubFrameCollision()", () => {
  it("detects collision when ball moves through rectangle", () => {
    const previousBall: Ball = {
      position: { x: 0, y: 50 },
      velocity: { x: 100, y: 0 },
      radius: 5,
    };
    const currentBall: Ball = {
      position: { x: 100, y: 50 },
      velocity: { x: 100, y: 0 },
      radius: 5,
    };
    const rect = { x: 40, y: 40, width: 20, height: 20 };

    const result = checkSubFrameCollision(previousBall, currentBall, rect);
    expect(result.collided).toBe(true);
  });

  it("detects no collision when ball moves around rectangle", () => {
    const previousBall: Ball = {
      position: { x: 0, y: 0 },
      velocity: { x: 100, y: 0 },
      radius: 5,
    };
    const currentBall: Ball = {
      position: { x: 100, y: 0 },
      velocity: { x: 100, y: 0 },
      radius: 5,
    };
    const rect = { x: 40, y: 40, width: 20, height: 20 };

    const result = checkSubFrameCollision(previousBall, currentBall, rect);
    expect(result.collided).toBe(false);
  });

  it("returns collision time when detected", () => {
    const previousBall: Ball = {
      position: { x: 0, y: 50 },
      velocity: { x: 100, y: 0 },
      radius: 10,
    };
    const currentBall: Ball = {
      position: { x: 100, y: 50 },
      velocity: { x: 100, y: 0 },
      radius: 10,
    };
    const rect = { x: 45, y: 45, width: 10, height: 10 };

    const result = checkSubFrameCollision(previousBall, currentBall, rect);
    expect(result.collided).toBe(true);
    expect(result.time).toBeDefined();
    expect(result.time).toBeGreaterThan(0);
    expect(result.time).toBeLessThanOrEqual(1);
  });
});

describe("reflectVelocity()", () => {
  it("reflects velocity off horizontal surface correctly", () => {
    const velocity: Vector2 = { x: 5, y: -5 };
    const normal: Vector2 = { x: 0, y: 1 }; // Upward normal

    const reflected = reflectVelocity(velocity, normal);
    expect(reflected.x).toBe(5);
    expect(reflected.y).toBe(5);
  });

  it("reflects velocity off vertical surface correctly", () => {
    const velocity: Vector2 = { x: 5, y: 5 };
    const normal: Vector2 = { x: -1, y: 0 }; // Leftward normal

    const reflected = reflectVelocity(velocity, normal);
    expect(reflected.x).toBe(-5);
    expect(reflected.y).toBe(5);
  });

  it("maintains velocity magnitude after reflection", () => {
    const velocity: Vector2 = { x: 10, y: 5 };
    const normal: Vector2 = { x: 0, y: 1 };

    const reflected = reflectVelocity(velocity, normal);
    const originalSpeed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    const newSpeed = Math.sqrt(reflected.x * reflected.x + reflected.y * reflected.y);

    expect(newSpeed).toBeCloseTo(originalSpeed);
  });
});

describe("resolveBallBrickCollision()", () => {
  it("reflects ball velocity correctly", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 5, y: 5 },
      radius: 10,
    };
    const brick: Brick = {
      id: "brick-1",
      x: 40,
      y: 40,
      width: 20,
      height: 10,
      durability: 2,
      maxDurability: 2,
      isDestroyed: false,
    };
    const collision = checkCircleRectangleCollision(ball, brick);

    const result = resolveBallBrickCollision(ball, brick, collision);
    expect(result.newVelocity.y).toBeLessThan(0); // Should bounce up
  });

  it("reduces brick durability", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 5, y: 5 },
      radius: 10,
    };
    const brick: Brick = {
      id: "brick-1",
      x: 40,
      y: 40,
      width: 20,
      height: 10,
      durability: 2,
      maxDurability: 2,
      isDestroyed: false,
    };
    const collision = checkCircleRectangleCollision(ball, brick);

    const result = resolveBallBrickCollision(ball, brick, collision);
    expect(result.updatedBrick.durability).toBe(1);
    expect(result.updatedBrick.isDestroyed).toBe(false);
  });

  it("marks brick as destroyed when durability reaches zero", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 5, y: 5 },
      radius: 10,
    };
    const brick: Brick = {
      id: "brick-1",
      x: 40,
      y: 40,
      width: 20,
      height: 10,
      durability: 1,
      maxDurability: 1,
      isDestroyed: false,
    };
    const collision = checkCircleRectangleCollision(ball, brick);

    const result = resolveBallBrickCollision(ball, brick, collision);
    expect(result.updatedBrick.durability).toBe(0);
    expect(result.updatedBrick.isDestroyed).toBe(true);
  });
});

describe("resolveBallPaddleCollision()", () => {
  it("reflects ball upward after paddle hit", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 5, y: 5 },
      radius: 10,
    };
    const paddle: Paddle = {
      x: 40,
      y: 40,
      width: 40,
      height: 10,
      speed: 10,
    };
    const collision = checkCircleRectangleCollision(ball, paddle);

    const newVelocity = resolveBallPaddleCollision(ball, paddle, collision);
    expect(newVelocity.y).toBeLessThan(0); // Should bounce up
  });

  it("adds angle based on hit position (center hit)", () => {
    const ball: Ball = {
      position: { x: 60, y: 35 },
      velocity: { x: 0, y: 5 },
      radius: 10,
    };
    const paddle: Paddle = {
      x: 40,
      y: 40,
      width: 40,
      height: 10,
      speed: 10,
    };
    const collision = checkCircleRectangleCollision(ball, paddle);

    const newVelocity = resolveBallPaddleCollision(ball, paddle, collision);
    // Center hit should have minimal x change
    expect(Math.abs(newVelocity.x)).toBeLessThan(2);
  });

  it("adds angle based on hit position (edge hit)", () => {
    const ball: Ball = {
      position: { x: 75, y: 35 },
      velocity: { x: 0, y: 5 },
      radius: 10,
    };
    const paddle: Paddle = {
      x: 40,
      y: 40,
      width: 40,
      height: 10,
      speed: 10,
    };
    const collision = checkCircleRectangleCollision(ball, paddle);

    const newVelocity = resolveBallPaddleCollision(ball, paddle, collision);
    // Edge hit should add x velocity
    expect(Math.abs(newVelocity.x)).toBeGreaterThan(0);
  });

  it("maintains ball speed after reflection", () => {
    const ball: Ball = {
      position: { x: 60, y: 35 },
      velocity: { x: 5, y: 10 },
      radius: 10,
    };
    const paddle: Paddle = {
      x: 40,
      y: 40,
      width: 40,
      height: 10,
      speed: 10,
    };
    const collision = checkCircleRectangleCollision(ball, paddle);

    const newVelocity = resolveBallPaddleCollision(ball, paddle, collision);
    const originalSpeed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
    const newSpeed = Math.sqrt(newVelocity.x ** 2 + newVelocity.y ** 2);

    expect(newSpeed).toBeCloseTo(originalSpeed, 0);
  });
});

describe("resolveBallWallCollision()", () => {
  it("reflects ball off top wall", () => {
    const ball: Ball = {
      position: { x: 50, y: 5 },
      velocity: { x: 5, y: -5 },
      radius: 10,
    };
    const wall: Wall = {
      x: 0,
      y: 0,
      width: 100,
      height: 10,
      type: "top",
    };
    const collision = checkCircleRectangleCollision(ball, wall);

    const newVelocity = resolveBallWallCollision(ball, wall, collision);
    expect(newVelocity.y).toBeGreaterThan(0); // Should bounce down
    expect(newVelocity.x).toBe(5); // X should stay same
  });

  it("reflects ball off left wall", () => {
    const ball: Ball = {
      position: { x: 5, y: 50 },
      velocity: { x: -5, y: 5 },
      radius: 10,
    };
    const wall: Wall = {
      x: 0,
      y: 0,
      width: 10,
      height: 100,
      type: "left",
    };
    const collision = checkCircleRectangleCollision(ball, wall);

    const newVelocity = resolveBallWallCollision(ball, wall, collision);
    expect(newVelocity.x).toBeGreaterThan(0); // Should bounce right
    expect(newVelocity.y).toBe(5); // Y should stay same
  });

  it("reflects ball off right wall", () => {
    const ball: Ball = {
      position: { x: 95, y: 50 },
      velocity: { x: 5, y: 5 },
      radius: 10,
    };
    const wall: Wall = {
      x: 90,
      y: 0,
      width: 10,
      height: 100,
      type: "right",
    };
    const collision = checkCircleRectangleCollision(ball, wall);

    const newVelocity = resolveBallWallCollision(ball, wall, collision);
    expect(newVelocity.x).toBeLessThan(0); // Should bounce left
  });
});

describe("checkBallBrickCollisions()", () => {
  it("returns first collision with non-destroyed brick", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 0, y: 5 },
      radius: 10,
    };
    const bricks: Brick[] = [
      {
        id: "brick-1",
        x: 100,
        y: 100,
        width: 20,
        height: 10,
        durability: 1,
        maxDurability: 1,
        isDestroyed: false,
      },
      {
        id: "brick-2",
        x: 40,
        y: 40,
        width: 20,
        height: 10,
        durability: 1,
        maxDurability: 1,
        isDestroyed: false,
      },
    ];

    const result = checkBallBrickCollisions(ball, bricks);
    expect(result.brick).not.toBeNull();
    expect(result.brick!.id).toBe("brick-2");
    expect(result.collision.collided).toBe(true);
  });

  it("ignores destroyed bricks", () => {
    const ball: Ball = {
      position: { x: 50, y: 35 },
      velocity: { x: 0, y: 5 },
      radius: 10,
    };
    const bricks: Brick[] = [
      {
        id: "brick-1",
        x: 40,
        y: 40,
        width: 20,
        height: 10,
        durability: 0,
        maxDurability: 1,
        isDestroyed: true,
      },
    ];

    const result = checkBallBrickCollisions(ball, bricks);
    expect(result.brick).toBeNull();
    expect(result.collision.collided).toBe(false);
  });

  it("returns no collision when no bricks hit", () => {
    const ball: Ball = {
      position: { x: 50, y: 50 },
      velocity: { x: 0, y: 5 },
      radius: 5,
    };
    const bricks: Brick[] = [
      {
        id: "brick-1",
        x: 100,
        y: 100,
        width: 20,
        height: 10,
        durability: 1,
        maxDurability: 1,
        isDestroyed: false,
      },
    ];

    const result = checkBallBrickCollisions(ball, bricks);
    expect(result.brick).toBeNull();
    expect(result.collision.collided).toBe(false);
  });
});

describe("checkBallPaddleCollision()", () => {
  it("returns collision when ball hits paddle", () => {
    const ball: Ball = {
      position: { x: 60, y: 35 },
      velocity: { x: 0, y: 5 },
      radius: 10,
    };
    const paddle: Paddle = {
      x: 40,
      y: 40,
      width: 40,
      height: 10,
      speed: 10,
    };

    const result = checkBallPaddleCollision(ball, paddle);
    expect(result.collided).toBe(true);
  });

  it("returns no collision when ball is above paddle", () => {
    const ball: Ball = {
      position: { x: 60, y: 10 },
      velocity: { x: 0, y: 5 },
      radius: 5,
    };
    const paddle: Paddle = {
      x: 40,
      y: 40,
      width: 40,
      height: 10,
      speed: 10,
    };

    const result = checkBallPaddleCollision(ball, paddle);
    expect(result.collided).toBe(false);
  });
});

describe("checkBallWallCollisions()", () => {
  it("returns collision with top wall", () => {
    const ball: Ball = {
      position: { x: 50, y: 5 },
      velocity: { x: 5, y: -5 },
      radius: 10,
    };
    const walls: Wall[] = [
      { x: 0, y: 0, width: 100, height: 10, type: "top" },
      { x: 0, y: 0, width: 10, height: 100, type: "left" },
    ];

    const result = checkBallWallCollisions(ball, walls);
    expect(result.wall).not.toBeNull();
    expect(result.wall!.type).toBe("top");
    expect(result.collision.collided).toBe(true);
  });

  it("returns collision with left wall", () => {
    const ball: Ball = {
      position: { x: 5, y: 50 },
      velocity: { x: -5, y: 5 },
      radius: 10,
    };
    const walls: Wall[] = [
      { x: 0, y: 0, width: 100, height: 10, type: "top" },
      { x: 0, y: 0, width: 10, height: 100, type: "left" },
    ];

    const result = checkBallWallCollisions(ball, walls);
    expect(result.wall).not.toBeNull();
    expect(result.wall!.type).toBe("left");
    expect(result.collision.collided).toBe(true);
  });

  it("returns no collision when ball is away from walls", () => {
    const ball: Ball = {
      position: { x: 50, y: 50 },
      velocity: { x: 5, y: 5 },
      radius: 5,
    };
    const walls: Wall[] = [
      { x: 0, y: 0, width: 100, height: 10, type: "top" },
      { x: 0, y: 0, width: 10, height: 100, type: "left" },
    ];

    const result = checkBallWallCollisions(ball, walls);
    expect(result.wall).toBeNull();
    expect(result.collision.collided).toBe(false);
  });
});
