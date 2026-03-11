/**
 * Battleship Ship Model
 * Ship data model and validation functions
 */

export const SHIP_TYPES = {
  Carrier: {
    name: "Taşıyıcı",
    length: 5,
  },
  Battleship: {
    name: "Savaş Gemisi",
    length: 4,
  },
  Cruiser: {
    name: "Kruvazör",
    length: 3,
  },
  Destroyer: {
    name: "Muhrip",
    length: 2,
  },
};

export type ShipType = keyof typeof SHIP_TYPES;

export type Orientation = "horizontal" | "vertical";

export interface Ship {
  type: ShipType;
  positions: { row: number; col: number }[];
  hits: Set<string>;
  orientation: Orientation;
}

/**
 * Create a ship object with the given type, starting position, and orientation
 */
export function createShip(
  type: ShipType,
  startRow: number,
  startCol: number,
  orientation: Orientation
): Ship {
  const shipLength = SHIP_TYPES[type].length;
  const positions: { row: number; col: number }[] = [];

  for (let i = 0; i < shipLength; i++) {
    if (orientation === "horizontal") {
      positions.push({ row: startRow, col: startCol + i });
    } else {
      positions.push({ row: startRow + i, col: startCol });
    }
  }

  return {
    type,
    positions,
    hits: new Set<string>(),
    orientation,
  };
}

/**
 * Toggle ship orientation between horizontal and vertical
 */
export function rotateShip(ship: Ship): Ship {
  const startRow = ship.positions[0].row;
  const startCol = ship.positions[0].col;
  const newOrientation: Orientation =
    ship.orientation === "horizontal" ? "vertical" : "horizontal";

  return createShip(ship.type, startRow, startCol, newOrientation);
}

/**
 * Get all cell positions occupied by a ship
 */
export function getShipPositions(ship: Ship): { row: number; col: number }[] {
  return ship.positions;
}

/**
 * Check if a ship is sunk (all positions have been hit)
 */
export function isShipSunk(ship: Ship): boolean {
  return ship.positions.every((pos) => ship.hits.has(`${pos.row},${pos.col}`));
}

/**
 * Record a hit on the ship at the given position
 * Returns true if the hit was valid and recorded
 */
export function hitShip(ship: Ship, row: number, col: number): boolean {
  const key = `${row},${col}`;
  const isHit = ship.positions.some((pos) => pos.row === row && pos.col === col);

  if (isHit) {
    ship.hits.add(key);
  }

  return isHit;
}

/**
 * Check if a position is occupied by a ship
 */
export function isPositionHit(ship: Ship, row: number, col: number): boolean {
  return ship.hits.has(`${row},${col}`);
}

/**
 * Check if a ship occupies a specific position
 */
export function occupiesPosition(
  ship: Ship,
  row: number,
  col: number
): boolean {
  return ship.positions.some((pos) => pos.row === row && pos.col === col);
}
