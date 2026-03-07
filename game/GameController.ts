/**
 * GameController - Manages complete 2048 game lifecycle
 */

import {
  GameGrid,
  Direction,
  GameState,
  GameConfig,
  DEFAULT_CONFIG,
} from "./types";
import {
  initializeGrid,
  executeMove,
  addRandomTile,
  hasWon,
  hasAvailableMoves,
  cloneGrid,
} from "./gameLogic";

// localStorage keys
const STORAGE_KEYS = {
  BEST_SCORE: "game2048-best-score",
};

export interface GameStatus {
  grid: GameGrid;
  score: number;
  bestScore: number;
  state: GameState;
}

export class GameController {
  private grid: GameGrid;
  private score: number;
  private bestScore: number;
  private state: GameState;
  private config: GameConfig;

  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.grid = initializeGrid(this.config.gridSize);
    this.score = 0;
    this.bestScore = this.loadBestScore();
    this.state = "playing";
  }

  /**
   * Get current game status
   */
  getStatus(): GameStatus {
    return {
      grid: cloneGrid(this.grid),
      score: this.score,
      bestScore: this.bestScore,
      state: this.state,
    };
  }

  /**
   * Get current grid
   */
  getGrid(): GameGrid {
    return cloneGrid(this.grid);
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }

  /**
   * Get best score
   */
  getBestScore(): number {
    return this.bestScore;
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return this.state;
  }

  /**
   * Check if game is won (has 2048 tile)
   */
  hasWon(): boolean {
    return hasWon(this.grid, this.config);
  }

  /**
   * Check if moves are available
   */
  hasAvailableMoves(): boolean {
    return hasAvailableMoves(this.grid);
  }

  /**
   * Execute a move in the specified direction
   * Returns true if the move was valid and changed the grid
   */
  move(direction: Direction): boolean {
    // Prevent moves if game is over (but allow if won and continuing)
    if (this.state === "lost") {
      return false;
    }

    const result = executeMove(this.grid, direction);

    if (!result.moved) {
      return false;
    }

    this.grid = result.grid;
    this.score += result.score;

    // Update best score if needed
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.saveBestScore();
    }

    // Add new random tile
    this.grid = addRandomTile(this.grid);

    // Check win/lose conditions
    this.updateGameState();

    return true;
  }

  /**
   * Continue playing after winning
   */
  continuePlaying(): void {
    if (this.state === "won") {
      this.state = "continue";
    }
  }

  /**
   * Start a new game
   */
  newGame(): void {
    this.grid = initializeGrid(this.config.gridSize);
    this.score = 0;
    this.state = "playing";
  }

  /**
   * Update game state based on current grid
   */
  private updateGameState(): void {
    // Check for win (only transition to "won" if currently playing)
    if (this.state === "playing" && hasWon(this.grid, this.config)) {
      this.state = "won";
      return;
    }

    // Check for lose
    if (!hasAvailableMoves(this.grid)) {
      this.state = "lost";
      return;
    }
  }

  /**
   * Load best score from localStorage
   */
  private loadBestScore(): number {
    if (typeof window === "undefined") {
      return 0;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BEST_SCORE);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Save best score to localStorage
   */
  private saveBestScore(): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, this.bestScore.toString());
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Set grid directly (useful for testing)
   */
  setGrid(grid: GameGrid): void {
    this.grid = cloneGrid(grid);
    this.updateGameState();
  }
}
