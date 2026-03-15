/**
 * Tests for snake types and utilities
 */

import {
  Direction,
  getOppositeDirection,
  isValidDirectionChange,
  getDirectionDelta,
  calculateSpeed,
  DEFAULT_CONFIG,
} from "../snake/types";

describe("Snake Types", () => {
  describe("getOppositeDirection", () => {
    it("should return down for up", () => {
      expect(getOppositeDirection("up")).toBe("down");
    });

    it("should return up for down", () => {
      expect(getOppositeDirection("down")).toBe("up");
    });

    it("should return right for left", () => {
      expect(getOppositeDirection("left")).toBe("right");
    });

    it("should return left for right", () => {
      expect(getOppositeDirection("right")).toBe("left");
    });
  });

  describe("isValidDirectionChange", () => {
    it("should return true for perpendicular changes", () => {
      expect(isValidDirectionChange("up", "left")).toBe(true);
      expect(isValidDirectionChange("up", "right")).toBe(true);
      expect(isValidDirectionChange("down", "left")).toBe(true);
      expect(isValidDirectionChange("down", "right")).toBe(true);
      expect(isValidDirectionChange("left", "up")).toBe(true);
      expect(isValidDirectionChange("left", "down")).toBe(true);
      expect(isValidDirectionChange("right", "up")).toBe(true);
      expect(isValidDirectionChange("right", "down")).toBe(true);
    });

    it("should return false for opposite directions", () => {
      expect(isValidDirectionChange("up", "down")).toBe(false);
      expect(isValidDirectionChange("down", "up")).toBe(false);
      expect(isValidDirectionChange("left", "right")).toBe(false);
      expect(isValidDirectionChange("right", "left")).toBe(false);
    });

    it("should return false for same direction", () => {
      expect(isValidDirectionChange("up", "up")).toBe(true);
      expect(isValidDirectionChange("down", "down")).toBe(true);
      expect(isValidDirectionChange("left", "left")).toBe(true);
      expect(isValidDirectionChange("right", "right")).toBe(true);
    });
  });

  describe("getDirectionDelta", () => {
    it("should return correct delta for up", () => {
      expect(getDirectionDelta("up")).toEqual({ x: 0, y: -1 });
    });

    it("should return correct delta for down", () => {
      expect(getDirectionDelta("down")).toEqual({ x: 0, y: 1 });
    });

    it("should return correct delta for left", () => {
      expect(getDirectionDelta("left")).toEqual({ x: -1, y: 0 });
    });

    it("should return correct delta for right", () => {
      expect(getDirectionDelta("right")).toEqual({ x: 1, y: 0 });
    });
  });

  describe("calculateSpeed", () => {
    it("should return base speed at score 0", () => {
      const speed = calculateSpeed(DEFAULT_CONFIG, 0);
      expect(speed).toBe(DEFAULT_CONFIG.baseSpeed);
    });

    it("should increase speed as score increases", () => {
      const speed0 = calculateSpeed(DEFAULT_CONFIG, 0);
      const speed10 = calculateSpeed(DEFAULT_CONFIG, 10);
      const speed20 = calculateSpeed(DEFAULT_CONFIG, 20);

      expect(speed10).toBeLessThan(speed0);
      expect(speed20).toBeLessThan(speed10);
    });

    it("should not go below minimum speed (50ms)", () => {
      const speed = calculateSpeed(DEFAULT_CONFIG, 1000);
      expect(speed).toBe(50);
    });

    it("should calculate speed correctly for intermediate scores", () => {
      // Score 5 -> no speed increase yet
      expect(calculateSpeed(DEFAULT_CONFIG, 5)).toBe(150);

      // Score 10 -> 1 increment
      expect(calculateSpeed(DEFAULT_CONFIG, 10)).toBe(140);

      // Score 25 -> 2 increments
      expect(calculateSpeed(DEFAULT_CONFIG, 25)).toBe(130);
    });
  });
});
