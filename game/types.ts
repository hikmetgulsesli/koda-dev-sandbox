/**
 * 2048 Game Types
 */

export type NonZeroCellValue = 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048;
export type CellValue = 0 | NonZeroCellValue;

export type GameGrid = CellValue[][];

export type Direction = "up" | "down" | "left" | "right";

export type GameState = "playing" | "won" | "lost" | "continue";

export interface Position {
  row: number;
  col: number;
}

export interface GameConfig {
  gridSize: number;
  winningValue: number;
}

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 4,
  winningValue: 2048,
};
