/**
 * Game Logic and GameController Tests
 * Tests for win/lose detection scenarios
 */

import {
  createEmptyGrid,
  hasWon,
  hasAvailableMoves,
  hasEmptyCells,
  hasAdjacentMerges,
  getEmptyCells,
  addRandomTile,
  initializeGrid,
  executeMove,
  cloneGrid,
} from "@/game/gameLogic";
import { GameController } from "@/game/GameController";
import { GameGrid, CellValue } from "@/game/types";

describe("hasWon()", () => {
  it("returns true when 2048 tile exists", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2048, 0],
      [0, 0, 0, 0],
    ];
    expect(hasWon(grid)).toBe(true);
  });

  it("returns true when tile greater than 2048 exists", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 4096 as CellValue, 0],
      [0, 0, 0, 0],
    ];
    expect(hasWon(grid)).toBe(true);
  });

  it("returns false when no 2048 tile exists", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasWon(grid)).toBe(false);
  });

  it("returns false for empty grid", () => {
    const grid = createEmptyGrid(4);
    expect(hasWon(grid)).toBe(false);
  });
});

describe("hasAvailableMoves()", () => {
  it("returns true when empty cells exist", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasAvailableMoves(grid)).toBe(true);
  });

  it("returns true when possible merges exist (no empty cells)", () => {
    const grid: GameGrid = [
      [2, 2, 4, 8],
      [16, 32, 64, 128],
      [256, 512, 1024, 2],
      [4, 8, 16, 32],
    ];
    expect(hasAvailableMoves(grid)).toBe(true);
  });

  it("returns false for full grid with no merges (game over)", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];
    expect(hasAvailableMoves(grid)).toBe(false);
  });

  it("returns true for grid with horizontal merge possible", () => {
    const grid: GameGrid = [
      [2, 2, 4, 8],
      [16, 32, 64, 128],
      [256, 512, 1024, 2],
      [4, 8, 16, 32],
    ];
    expect(hasAvailableMoves(grid)).toBe(true);
  });

  it("returns true for grid with vertical merge possible", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [2, 32, 64, 128],
      [256, 512, 1024, 2],
      [4, 8, 16, 32],
    ];
    expect(hasAvailableMoves(grid)).toBe(true);
  });
});

describe("hasEmptyCells()", () => {
  it("returns true when grid has empty cells", () => {
    const grid = createEmptyGrid(4);
    expect(hasEmptyCells(grid)).toBe(true);
  });

  it("returns false when grid is full", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];
    expect(hasEmptyCells(grid)).toBe(false);
  });
});

describe("hasAdjacentMerges()", () => {
  it("returns true when horizontal merge possible", () => {
    const grid: GameGrid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasAdjacentMerges(grid)).toBe(true);
  });

  it("returns true when vertical merge possible", () => {
    const grid: GameGrid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(hasAdjacentMerges(grid)).toBe(true);
  });

  it("returns false when no merges possible", () => {
    const grid: GameGrid = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(hasAdjacentMerges(grid)).toBe(false);
  });
});

describe("getEmptyCells()", () => {
  it("returns all empty cell positions", () => {
    const grid: GameGrid = [
      [2, 0, 0, 0],
      [0, 4, 0, 0],
      [0, 0, 8, 0],
      [0, 0, 0, 16],
    ];
    const empty = getEmptyCells(grid);
    expect(empty).toHaveLength(12);
    expect(empty).toContainEqual({ row: 0, col: 1 });
    expect(empty).toContainEqual({ row: 3, col: 2 });
  });

  it("returns empty array for full grid", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];
    expect(getEmptyCells(grid)).toHaveLength(0);
  });
});

describe("addRandomTile()", () => {
  it("adds a tile to an empty grid", () => {
    const grid = createEmptyGrid(4);
    const newGrid = addRandomTile(grid);

    const emptyBefore = getEmptyCells(grid).length;
    const emptyAfter = getEmptyCells(newGrid).length;

    expect(emptyBefore).toBe(16);
    expect(emptyAfter).toBe(15);
  });

  it("adds either 2 or 4", () => {
    const grid = createEmptyGrid(4);
    const newGrid = addRandomTile(grid);

    const addedValue = newGrid.flat().find((v) => v !== 0);
    expect([2, 4]).toContain(addedValue);
  });

  it("returns same grid when no empty cells", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];
    const newGrid = addRandomTile(grid);
    expect(newGrid).toEqual(grid);
  });
});

describe("initializeGrid()", () => {
  it("creates grid with 2 tiles", () => {
    const grid = initializeGrid(4);
    const nonZeroCount = grid.flat().filter((v) => v !== 0).length;
    expect(nonZeroCount).toBe(2);
  });

  it("creates correct size grid", () => {
    const grid = initializeGrid(4);
    expect(grid).toHaveLength(4);
    expect(grid[0]).toHaveLength(4);
  });
});

describe("executeMove()", () => {
  it("merges tiles correctly to the left", () => {
    const grid: GameGrid = [
      [2, 2, 4, 4],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const result = executeMove(grid, "left");

    expect(result.grid[0]).toEqual([4, 8, 0, 0]);
    expect(result.score).toBe(12); // 4 + 8
    expect(result.moved).toBe(true);
  });

  it("does not move when no change possible", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const result = executeMove(grid, "left");

    expect(result.moved).toBe(false);
    expect(result.score).toBe(0);
  });

  it("handles right move correctly", () => {
    const grid: GameGrid = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const result = executeMove(grid, "right");

    expect(result.grid[0]).toEqual([0, 0, 0, 4]);
    expect(result.score).toBe(4);
  });

  it("handles up move correctly", () => {
    const grid: GameGrid = [
      [2, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const result = executeMove(grid, "up");

    expect(result.grid[0][0]).toBe(4);
    expect(result.grid[1][0]).toBe(0);
  });

  it("handles down move correctly", () => {
    const grid: GameGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [2, 0, 0, 0],
    ];
    const result = executeMove(grid, "down");

    expect(result.grid[3][0]).toBe(4);
    expect(result.grid[2][0]).toBe(0);
  });
});

describe("cloneGrid()", () => {
  it("creates a deep copy", () => {
    const grid: GameGrid = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 64],
    ];
    const clone = cloneGrid(grid);

    expect(clone).toEqual(grid);
    expect(clone).not.toBe(grid);
    expect(clone[0]).not.toBe(grid[0]);
  });
});

describe("GameController", () => {
  let controller: GameController;

  beforeEach(() => {
    controller = new GameController();
  });

  describe("initialization", () => {
    it("starts with playing state", () => {
      expect(controller.getState()).toBe("playing");
    });

    it("starts with score 0", () => {
      expect(controller.getScore()).toBe(0);
    });

    it("has a grid with 2 tiles", () => {
      const grid = controller.getGrid();
      const nonZeroCount = grid.flat().filter((v) => v !== 0).length;
      expect(nonZeroCount).toBe(2);
    });
  });

  describe("getStatus()", () => {
    it("returns complete game status", () => {
      const status = controller.getStatus();

      expect(status).toHaveProperty("grid");
      expect(status).toHaveProperty("score");
      expect(status).toHaveProperty("bestScore");
      expect(status).toHaveProperty("state");
    });
  });

  describe("move()", () => {
    it("returns true for valid move", () => {
      // Set up a grid where move is possible
      controller.setGrid([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const result = controller.move("left");
      expect(result).toBe(true);
    });

    it("returns false for invalid move", () => {
      // Set up a grid where no left move is possible
      controller.setGrid([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const result = controller.move("left");
      expect(result).toBe(false);
    });

    it("prevents moves when game is lost", () => {
      // Set up a lost game state
      controller.setGrid([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);

      // Force state to lost
      controller.move("left"); // This should detect the loss

      const result = controller.move("left");
      expect(result).toBe(false);
    });

    it("updates score after merge", () => {
      controller.setGrid([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      controller.move("left");
      expect(controller.getScore()).toBeGreaterThan(0);
    });
  });

  describe("win detection", () => {
    it("transitions to won state when 2048 tile appears", () => {
      controller.setGrid([
        [2048, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      expect(controller.getState()).toBe("won");
    });

    it("hasWon() returns true when 2048 exists", () => {
      controller.setGrid([
        [2048, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      expect(controller.hasWon()).toBe(true);
    });

    it("hasWon() returns false when no 2048", () => {
      controller.setGrid([
        [1024, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      expect(controller.hasWon()).toBe(false);
    });
  });

  describe("lose detection", () => {
    it("transitions to lost state when no moves available", () => {
      controller.setGrid([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);

      // Force a move attempt to trigger state update
      controller.move("left");

      expect(controller.getState()).toBe("lost");
    });

    it("hasAvailableMoves() returns false for full grid with no merges", () => {
      controller.setGrid([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]);

      expect(controller.hasAvailableMoves()).toBe(false);
    });

    it("hasAvailableMoves() returns true when moves exist", () => {
      controller.setGrid([
        [2, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      expect(controller.hasAvailableMoves()).toBe(true);
    });
  });

  describe("continuePlaying()", () => {
    it("allows continuing after win", () => {
      controller.setGrid([
        [2048, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      expect(controller.getState()).toBe("won");

      controller.continuePlaying();
      expect(controller.getState()).toBe("continue");
    });

    it("does nothing if not in won state", () => {
      controller.setGrid([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      controller.continuePlaying();
      expect(controller.getState()).toBe("playing");
    });
  });

  describe("newGame()", () => {
    it("resets game state", () => {
      controller.setGrid([
        [2048, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      controller.newGame();

      expect(controller.getState()).toBe("playing");
      expect(controller.getScore()).toBe(0);
    });

    it("creates new grid with 2 tiles", () => {
      controller.setGrid([
        [2048, 2, 4, 8],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      controller.newGame();

      const grid = controller.getGrid();
      const nonZeroCount = grid.flat().filter((v) => v !== 0).length;
      expect(nonZeroCount).toBe(2);
    });
  });

  describe("best score persistence", () => {
    beforeEach(() => {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    });

    it("loads best score on initialization", () => {
      // Mock localStorage
      const mockGetItem = jest.spyOn(Storage.prototype, "getItem");
      mockGetItem.mockReturnValue("500");

      const newController = new GameController();
      expect(newController.getBestScore()).toBe(500);

      mockGetItem.mockRestore();
    });

    it("updates best score when current score exceeds it", () => {
      controller.setGrid([
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      const initialBest = controller.getBestScore();
      controller.move("left");
      const newScore = controller.getScore();

      if (newScore > initialBest) {
        expect(controller.getBestScore()).toBe(newScore);
      }
    });

    it("saves best score to localStorage", () => {
      const mockSetItem = jest.spyOn(Storage.prototype, "setItem");
      mockSetItem.mockClear();

      // First ensure best score is 0
      const mockGetItem = jest.spyOn(Storage.prototype, "getItem");
      mockGetItem.mockReturnValue("0");

      // Create a fresh controller with the mocked getItem
      const freshController = new GameController();
      expect(freshController.getBestScore()).toBe(0);

      // Set up a grid that will produce a score
      freshController.setGrid([
        [2, 2, 4, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      // This move should score 12 (4 + 8) and trigger a save
      freshController.move("left");
      expect(freshController.getScore()).toBe(12);

      expect(mockSetItem).toHaveBeenCalledWith(
        "game2048-best-score",
        "12"
      );

      mockSetItem.mockRestore();
      mockGetItem.mockRestore();
    });
  });
});
