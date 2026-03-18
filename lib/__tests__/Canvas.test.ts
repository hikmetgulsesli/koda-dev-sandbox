import { Canvas, CanvasConfig, Point } from "@/lib/Canvas";

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}));

// Mock PointerEvent since jsdom doesn't support it
global.PointerEvent = class PointerEvent extends MouseEvent {
  pointerId: number;
  constructor(type: string, init?: PointerEventInit) {
    super(type, init);
    this.pointerId = init?.pointerId ?? 0;
  }
} as typeof global.PointerEvent;

describe("Canvas", () => {
  let canvasElement: HTMLCanvasElement;
  let canvas: Canvas;

  beforeEach(() => {
    // Create a canvas element
    canvasElement = document.createElement("canvas");
    canvasElement.width = 800;
    canvasElement.height = 600;
    document.body.appendChild(canvasElement);

    // Mock getContext
    const mockContext = {
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      stroke: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      clearRect: jest.fn(),
      scale: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(0) })),
      putImageData: jest.fn(),
    };

    // Use Object.defineProperty to bypass TypeScript type checking for mock
    Object.defineProperty(canvasElement, "getContext", {
      value: jest.fn(() => mockContext),
      writable: true,
      configurable: true,
    });
    
    // Mock pointer capture methods
    Object.defineProperty(canvasElement, "setPointerCapture", {
      value: jest.fn(),
      writable: true,
      configurable: true,
    });
    Object.defineProperty(canvasElement, "releasePointerCapture", {
      value: jest.fn(),
      writable: true,
      configurable: true,
    });
    
    jest.spyOn(canvasElement, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    canvas = new Canvas(canvasElement);
  });

  afterEach(() => {
    canvas.destroy();
    document.body.removeChild(canvasElement);
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    it("should create canvas with default config", () => {
      expect(canvas).toBeDefined();
      const config = canvas.getConfig();
      expect(config.lineColor).toBe("#00ffff");
      expect(config.lineWidth).toBe(2);
      expect(config.lineCap).toBe("round");
      expect(config.lineJoin).toBe("round");
    });

    it("should create canvas with custom config", () => {
      canvas.destroy();
      const customConfig: CanvasConfig = {
        lineColor: "#ff0000",
        lineWidth: 5,
        lineCap: "square",
        lineJoin: "bevel",
      };
      canvas = new Canvas(canvasElement, customConfig);
      const config = canvas.getConfig();
      expect(config.lineColor).toBe("#ff0000");
      expect(config.lineWidth).toBe(5);
      expect(config.lineCap).toBe("square");
      expect(config.lineJoin).toBe("bevel");
    });

    it("should throw error if 2D context not available", () => {
      canvas.destroy();
      Object.defineProperty(canvasElement, "getContext", {
        value: jest.fn(() => null),
        writable: true,
        configurable: true,
      });
      expect(() => new Canvas(canvasElement)).toThrow("Failed to get 2D rendering context");
    });
  });

  describe("pointer events", () => {
    it("should handle pointerdown event", () => {
      const onDrawStart = jest.fn();
      canvas.onDrawStart = onDrawStart;

      const pointerEvent = new PointerEvent("pointerdown", {
        clientX: 100,
        clientY: 100,
        pointerId: 1,
      });
      
      canvasElement.dispatchEvent(pointerEvent);
      expect(canvas.getIsDrawing()).toBe(true);
    });

    it("should handle pointerup event", () => {
      const onDrawEnd = jest.fn();
      canvas.onDrawEnd = onDrawEnd;

      // Start drawing
      const downEvent = new PointerEvent("pointerdown", {
        clientX: 100,
        clientY: 100,
        pointerId: 1,
      });
      canvasElement.dispatchEvent(downEvent);
      expect(canvas.getIsDrawing()).toBe(true);

      // End drawing
      const upEvent = new PointerEvent("pointerup", {
        clientX: 100,
        clientY: 100,
        pointerId: 1,
      });
      canvasElement.dispatchEvent(upEvent);
      expect(canvas.getIsDrawing()).toBe(false);
    });

    it("should set touch-action to none for touch support", () => {
      expect(canvasElement.style.touchAction).toBe("none");
    });
  });

  describe("configuration", () => {
    it("should update line color", () => {
      canvas.setConfig({ lineColor: "#ff0000" });
      expect(canvas.getConfig().lineColor).toBe("#ff0000");
    });

    it("should update line width", () => {
      canvas.setConfig({ lineWidth: 10 });
      expect(canvas.getConfig().lineWidth).toBe(10);
    });

    it("should clear canvas", () => {
      const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
      canvas.clear();
      expect(ctx.clearRect).toHaveBeenCalled();
    });
  });

  describe("drawing", () => {
    it("should draw a point", () => {
      const ctx = canvasElement.getContext("2d") as CanvasRenderingContext2D;
      const point: Point = { x: 50, y: 50 };
      canvas.drawPoint(point);
      expect(ctx.arc).toHaveBeenCalledWith(50, 50, 1, 0, Math.PI * 2);
      expect(ctx.fill).toHaveBeenCalled();
    });
  });

  describe("cleanup", () => {
    it("should clean up on destroy", () => {
      const removeEventListenerSpy = jest.spyOn(canvasElement, "removeEventListener");
      canvas.destroy();
      expect(removeEventListenerSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith("pointermove", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith("pointerup", expect.any(Function));
    });
  });
});
