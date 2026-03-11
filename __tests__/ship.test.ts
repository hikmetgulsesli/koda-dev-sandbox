/**
 * Ship Model Tests
 * Tests for ship operations: createShip, rotateShip, getShipPositions, isShipSunk
 */

import {
  SHIP_TYPES,
  createShip,
  rotateShip,
  getShipPositions,
  isShipSunk,
  hitShip,
  isPositionHit,
  occupiesPosition,
  ShipType,
  Orientation,
} from "@/ship/ship";

describe("SHIP_TYPES", () => {
  it("defines Carrier with length 5 and Turkish name", () => {
    expect(SHIP_TYPES.Carrier).toEqual({
      name: "Taşıyıcı",
      length: 5,
    });
  });

  it("defines Battleship with length 4 and Turkish name", () => {
    expect(SHIP_TYPES.Battleship).toEqual({
      name: "Savaş Gemisi",
      length: 4,
    });
  });

  it("defines Cruiser with length 3 and Turkish name", () => {
    expect(SHIP_TYPES.Cruiser).toEqual({
      name: "Kruvazör",
      length: 3,
    });
  });

  it("defines Destroyer with length 2 and Turkish name", () => {
    expect(SHIP_TYPES.Destroyer).toEqual({
      name: "Muhrip",
      length: 2,
    });
  });

  it("has all 4 ship types", () => {
    expect(Object.keys(SHIP_TYPES)).toHaveLength(4);
  });
});

describe("createShip()", () => {
  it("creates a Carrier ship with 5 positions horizontally", () => {
    const ship = createShip("Carrier", 0, 0, "horizontal");
    
    expect(ship.type).toBe("Carrier");
    expect(ship.positions).toHaveLength(5);
    expect(ship.orientation).toBe("horizontal");
    expect(ship.hits.size).toBe(0);
  });

  it("creates a ship with correct horizontal positions", () => {
    const ship = createShip("Destroyer", 2, 3, "horizontal");
    
    expect(ship.positions).toEqual([
      { row: 2, col: 3 },
      { row: 2, col: 4 },
    ]);
  });

  it("creates a ship with correct vertical positions", () => {
    const ship = createShip("Battleship", 1, 1, "vertical");
    
    expect(ship.positions).toEqual([
      { row: 1, col: 1 },
      { row: 2, col: 1 },
      { row: 3, col: 1 },
      { row: 4, col: 1 },
    ]);
  });

  it("creates ships with correct lengths for all types", () => {
    const types: ShipType[] = ["Carrier", "Battleship", "Cruiser", "Destroyer"];
    
    types.forEach((type) => {
      const ship = createShip(type, 0, 0, "horizontal");
      expect(ship.positions).toHaveLength(SHIP_TYPES[type].length);
    });
  });

  it("initializes with empty hits Set", () => {
    const ship = createShip("Cruiser", 0, 0, "horizontal");
    expect(ship.hits).toBeInstanceOf(Set);
    expect(ship.hits.size).toBe(0);
  });
});

describe("rotateShip()", () => {
  it("toggles orientation from horizontal to vertical", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    const rotated = rotateShip(ship);
    
    expect(rotated.orientation).toBe("vertical");
    expect(rotated.type).toBe(ship.type);
  });

  it("toggles orientation from vertical to horizontal", () => {
    const ship = createShip("Battleship", 0, 0, "vertical");
    const rotated = rotateShip(ship);
    
    expect(rotated.orientation).toBe("horizontal");
  });

  it("recalculates positions when rotating", () => {
    const ship = createShip("Cruiser", 2, 2, "horizontal");
    const rotated = rotateShip(ship);
    
    // Horizontal: (2,2), (2,3), (2,4)
    // Vertical: (2,2), (3,2), (4,2)
    expect(rotated.positions).toEqual([
      { row: 2, col: 2 },
      { row: 3, col: 2 },
      { row: 4, col: 2 },
    ]);
  });

  it("does not modify the original ship", () => {
    const ship = createShip("Carrier", 0, 0, "horizontal");
    rotateShip(ship);
    
    expect(ship.orientation).toBe("horizontal");
  });
});

describe("getShipPositions()", () => {
  it("returns all positions for a horizontal ship", () => {
    const ship = createShip("Battleship", 0, 0, "horizontal");
    const positions = getShipPositions(ship);
    
    expect(positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
    ]);
  });

  it("returns all positions for a vertical ship", () => {
    const ship = createShip("Cruiser", 5, 5, "vertical");
    const positions = getShipPositions(ship);
    
    expect(positions).toEqual([
      { row: 5, col: 5 },
      { row: 6, col: 5 },
      { row: 7, col: 5 },
    ]);
  });

  it("returns the same array reference as ship.positions", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    const positions = getShipPositions(ship);
    
    expect(positions).toBe(ship.positions);
  });
});

describe("isShipSunk()", () => {
  it("returns false when no hits recorded", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    expect(isShipSunk(ship)).toBe(false);
  });

  it("returns false when only some positions are hit", () => {
    const ship = createShip("Cruiser", 0, 0, "horizontal");
    hitShip(ship, 0, 0);
    hitShip(ship, 0, 1);
    
    expect(isShipSunk(ship)).toBe(false);
  });

  it("returns true when all positions are hit", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    hitShip(ship, 0, 0);
    hitShip(ship, 0, 1);
    
    expect(isShipSunk(ship)).toBe(true);
  });

  it("returns true when all positions of a larger ship are hit", () => {
    const ship = createShip("Carrier", 0, 0, "horizontal");
    
    for (let i = 0; i < 5; i++) {
      hitShip(ship, 0, i);
    }
    
    expect(isShipSunk(ship)).toBe(true);
  });

  it("handles vertical ships correctly", () => {
    const ship = createShip("Battleship", 0, 0, "vertical");
    hitShip(ship, 0, 0);
    hitShip(ship, 1, 0);
    hitShip(ship, 2, 0);
    hitShip(ship, 3, 0);
    
    expect(isShipSunk(ship)).toBe(true);
  });
});

describe("hitShip()", () => {
  it("records a valid hit", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    const result = hitShip(ship, 0, 0);
    
    expect(result).toBe(true);
    expect(isPositionHit(ship, 0, 0)).toBe(true);
  });

  it("returns false for invalid hit (not on ship)", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    const result = hitShip(ship, 5, 5);
    
    expect(result).toBe(false);
  });

  it("can record multiple hits", () => {
    const ship = createShip("Cruiser", 0, 0, "horizontal");
    hitShip(ship, 0, 0);
    hitShip(ship, 0, 1);
    hitShip(ship, 0, 2);
    
    expect(ship.hits.size).toBe(3);
  });

  it("does not duplicate hits on same position", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    hitShip(ship, 0, 0);
    hitShip(ship, 0, 0);
    
    expect(ship.hits.size).toBe(1);
  });
});

describe("isPositionHit()", () => {
  it("returns true for hit position", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    hitShip(ship, 0, 0);
    
    expect(isPositionHit(ship, 0, 0)).toBe(true);
  });

  it("returns false for unhit position", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    hitShip(ship, 0, 0);
    
    expect(isPositionHit(ship, 0, 1)).toBe(false);
  });

  it("returns false for position not on ship", () => {
    const ship = createShip("Destroyer", 0, 0, "horizontal");
    
    expect(isPositionHit(ship, 5, 5)).toBe(false);
  });
});

describe("occupiesPosition()", () => {
  it("returns true for position on ship", () => {
    const ship = createShip("Cruiser", 2, 3, "horizontal");
    
    expect(occupiesPosition(ship, 2, 3)).toBe(true);
    expect(occupiesPosition(ship, 2, 4)).toBe(true);
    expect(occupiesPosition(ship, 2, 5)).toBe(true);
  });

  it("returns false for position not on ship", () => {
    const ship = createShip("Cruiser", 2, 3, "horizontal");
    
    expect(occupiesPosition(ship, 0, 0)).toBe(false);
    expect(occupiesPosition(ship, 2, 6)).toBe(false);
  });

  it("works correctly for vertical ships", () => {
    const ship = createShip("Battleship", 0, 0, "vertical");
    
    expect(occupiesPosition(ship, 0, 0)).toBe(true);
    expect(occupiesPosition(ship, 1, 0)).toBe(true);
    expect(occupiesPosition(ship, 2, 0)).toBe(true);
    expect(occupiesPosition(ship, 3, 0)).toBe(true);
    expect(occupiesPosition(ship, 0, 1)).toBe(false);
  });
});
