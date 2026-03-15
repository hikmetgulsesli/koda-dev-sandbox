/**
 * 2048 Game Logic
 * Pure functions for game state manipulation
 */

import { CellValue, GameGrid, Direction, Position, GameConfig, DEFAULT_CONFIG } from "./types";

/**
 * Create an empty grid
 */
export function createEmptyGrid(size: number): GameGrid {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0) as CellValue[]);
}

/**
 * Check if the grid has a 2048 tile (win condition)
 */
export function hasWon(grid: GameGrid, config: GameConfig = DEFAULT_CONFIG): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] >= config.winningValue) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if there are any empty cells in the grid
 */
export function hasEmptyCells(grid: GameGrid): boolean {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 0) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Check if two adjacent cells can merge (have the same value)
 */
export function hasAdjacentMerges(grid: GameGrid): boolean {
  const size = grid.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const current = grid[row][col];
      if (current === 0) continue;

      // Check right neighbor
      if (col < size - 1 && grid[row][col + 1] === current) {
        return true;
      }

      // Check bottom neighbor
      if (row < size - 1 && grid[row + 1][col] === current) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if any moves are available
 * Returns true if there are empty cells or possible merges
 */
export function hasAvailableMoves(grid: GameGrid): boolean {
  return hasEmptyCells(grid) || hasAdjacentMerges(grid);
}

/**
 * Get all empty cell positions
 */
export function getEmptyCells(grid: GameGrid): Position[] {
  const empty: Position[] = [];
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 0) {
        empty.push({ row, col });
      }
    }
  }
  return empty;
}

/**
 * Add a random tile (2 or 4) to an empty cell
 * 90% chance of 2, 10% chance of 4
 */
export function addRandomTile(grid: GameGrid): GameGrid {
  const emptyCells = getEmptyCells(grid);
  if (emptyCells.length === 0) return grid;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];
  const value: CellValue = Math.random() < 0.9 ? 2 : 4;

  const newGrid = grid.map((r) => [...r]);
  newGrid[row][col] = value;
  return newGrid;
}

/**
 * Initialize a new game grid with 2 random tiles
 */
export function initializeGrid(size: number): GameGrid {
  let grid = createEmptyGrid(size);
  grid = addRandomTile(grid);
  grid = addRandomTile(grid);
  return grid;
}

/**
 * Slide and merge a single row/column to the left
 * Returns the new row and the score gained
 */
function slideAndMerge(line: CellValue[]): { line: CellValue[]; score: number } {
  // Remove zeros
  let filtered: number[] = line.filter((val) => val !== 0);
  let score = 0;

  // Merge adjacent equal tiles
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      filtered[i] = filtered[i] * 2;
      score += filtered[i];
      filtered[i + 1] = 0;
    }
  }

  // Remove zeros again after merge
  filtered = filtered.filter((val) => val !== 0);

  // Pad with zeros to original length
  while (filtered.length < line.length) {
    filtered.push(0);
  }

  return { line: filtered as CellValue[], score };
}

/**
 * Transpose grid (swap rows and columns)
 */
function transposeGrid(grid: GameGrid): GameGrid {
  const size = grid.length;
  const transposed = createEmptyGrid(size);

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      transposed[col][row] = grid[row][col];
    }
  }

  return transposed;
}

/**
 * Reverse each row in the grid
 */
function reverseRows(grid: GameGrid): GameGrid {
  return grid.map((row) => [...row].reverse());
}

/**
 * Execute a move in the specified direction
 * Returns the new grid and score gained
 */
export function executeMove(
  grid: GameGrid,
  direction: Direction
): { grid: GameGrid; score: number; moved: boolean } {
  let workingGrid = grid.map((row) => [...row]);
  let totalScore = 0;

  // Transform grid based on direction to always process as "left" move
  switch (direction) {
    case "left":
      // No transformation needed
      break;
    case "right":
      // Reverse rows to make right = left
      workingGrid = reverseRows(workingGrid);
      break;
    case "up":
      // Transpose to make up = left
      workingGrid = transposeGrid(workingGrid);
      break;
    case "down":
      // Transpose + reverse to make down = left
      workingGrid = transposeGrid(workingGrid);
      workingGrid = reverseRows(workingGrid);
      break;
  }

  // Process each row (now moving left)
  for (let row = 0; row < workingGrid.length; row++) {
    const { line, score } = slideAndMerge(workingGrid[row]);
    workingGrid[row] = line;
    totalScore += score;
  }

  // Transform back to original orientation
  switch (direction) {
    case "left":
      // No transformation needed
      break;
    case "right":
      // Reverse rows back
      workingGrid = reverseRows(workingGrid);
      break;
    case "up":
      // Transpose back
      workingGrid = transposeGrid(workingGrid);
      break;
    case "down":
      // Reverse rows + transpose back
      workingGrid = reverseRows(workingGrid);
      workingGrid = transposeGrid(workingGrid);
      break;
  }

  // Check if grid actually changed
  const moved = JSON.stringify(grid) !== JSON.stringify(workingGrid);

  return { grid: workingGrid, score: totalScore, moved };
}

/**
 * Clone a grid (deep copy)
 */
export function cloneGrid(grid: GameGrid): GameGrid {
  return grid.map((row) => [...row]);
}
