/**
 * Canvas.ts - HTML5 Canvas 2D wrapper with pointer event handling
 * Provides free-drawing capabilities with smooth line interpolation
 */

export interface Point {
  x: number;
  y: number;
}

export interface CanvasConfig {
  width?: number;
  height?: number;
  lineColor?: string;
  lineWidth?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastPoint: Point | null = null;
  private config: Required<CanvasConfig>;
  private resizeObserver: ResizeObserver | null = null;
  private rafId: number | null = null;
  private pendingPoint: Point | null = null;

  // Callbacks
  public onDrawStart?: (point: Point) => void;
  public onDrawMove?: (point: Point) => void;
  public onDrawEnd?: () => void;
  public onResize?: (width: number, height: number) => void;

  constructor(canvas: HTMLCanvasElement, config: CanvasConfig = {}) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D rendering context");
    }
    this.ctx = ctx;

    // Default configuration
    this.config = {
      width: config.width ?? canvas.width ?? 800,
      height: config.height ?? canvas.height ?? 600,
      lineColor: config.lineColor ?? "#00ffff",
      lineWidth: config.lineWidth ?? 2,
      lineCap: config.lineCap ?? "round",
      lineJoin: config.lineJoin ?? "round",
    };

    this.setupCanvas();
    this.attachEventListeners();
    this.setupResizeHandling();
  }

  private setupCanvas(): void {
    const { width, height, lineColor, lineWidth, lineCap, lineJoin } = this.config;
    
    // Set canvas size with device pixel ratio for crisp rendering
    this.setSize(width, height);
    
    // Configure drawing styles
    this.ctx.strokeStyle = lineColor;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = lineCap;
    this.ctx.lineJoin = lineJoin;
  }

  private setSize(width: number, height: number): void {
    const dpr = window.devicePixelRatio || 1;
    
    // Set the canvas internal resolution
    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    
    // Set the display size via CSS
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    
    // Scale context to match DPR
    this.ctx.scale(dpr, dpr);
    
    // Restore drawing styles after resize (scale resets them)
    this.ctx.strokeStyle = this.config.lineColor;
    this.ctx.lineWidth = this.config.lineWidth;
    this.ctx.lineCap = this.config.lineCap;
    this.ctx.lineJoin = this.config.lineJoin;
  }

  private attachEventListeners(): void {
    // Use pointer events for unified mouse/touch handling
    this.canvas.addEventListener("pointerdown", this.handlePointerDown);
    this.canvas.addEventListener("pointermove", this.handlePointerMove);
    this.canvas.addEventListener("pointerup", this.handlePointerUp);
    this.canvas.addEventListener("pointercancel", this.handlePointerUp);
    this.canvas.addEventListener("pointerleave", this.handlePointerUp);

    // Prevent default touch behaviors (scrolling, zooming)
    this.canvas.style.touchAction = "none";
  }

  private setupResizeHandling(): void {
    // Use ResizeObserver for responsive canvas
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          this.handleResize(width, height);
        }
      });
      this.resizeObserver.observe(this.canvas.parentElement || this.canvas);
    } else {
      // Fallback to window resize
      window.addEventListener("resize", this.handleWindowResize);
    }
  }

  private handleResize = (width: number, height: number): void => {
    // Save current canvas content
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Resize
    this.setSize(width, height);
    
    // Restore content (scaled)
    this.ctx.putImageData(imageData, 0, 0);
    
    this.config.width = width;
    this.config.height = height;
    this.onResize?.(width, height);
  };

  private handleWindowResize = (): void => {
    const rect = this.canvas.getBoundingClientRect();
    this.handleResize(rect.width, rect.height);
  };

  private getPointerPoint(event: PointerEvent): Point {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  private handlePointerDown = (event: PointerEvent): void => {
    event.preventDefault();
    this.isDrawing = true;
    
    // Try to capture pointer (may not be available in test environments)
    try {
      this.canvas.setPointerCapture(event.pointerId);
    } catch {
      // Ignore if not supported
    }
    
    const point = this.getPointerPoint(event);
    this.lastPoint = point;
    
    // Begin new path
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, point.y);
    
    this.onDrawStart?.(point);
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.isDrawing || !this.lastPoint) return;
    
    event.preventDefault();
    
    const point = this.getPointerPoint(event);
    this.pendingPoint = point;
    
    // Use requestAnimationFrame for smooth 60fps rendering
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        if (this.pendingPoint) {
          this.drawSmoothLine(this.lastPoint!, this.pendingPoint);
          this.lastPoint = this.pendingPoint;
          this.pendingPoint = null;
        }
        this.rafId = null;
      });
    }
    
    this.onDrawMove?.(point);
  };

  private handlePointerUp = (event: PointerEvent): void => {
    if (!this.isDrawing) return;
    
    event.preventDefault();
    this.isDrawing = false;
    this.lastPoint = null;
    this.pendingPoint = null;
    
    // Cancel any pending animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    
    try {
      this.canvas.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer may not have capture
    }
    
    this.onDrawEnd?.();
  };

  /**
   * Draw a smooth line between two points using quadratic bezier interpolation
   */
  private drawSmoothLine(from: Point, to: Point): void {
    // Calculate midpoint for quadratic curve
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    
    // Use quadratic curve for smoother lines
    this.ctx.quadraticCurveTo(from.x, from.y, midX, midY);
    this.ctx.stroke();
    
    // Start new path from midpoint for continuity
    this.ctx.beginPath();
    this.ctx.moveTo(midX, midY);
  }

  /**
   * Draw a single point (for tap/dots)
   */
  public drawPoint(point: Point): void {
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, this.config.lineWidth / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.config.lineColor;
    this.ctx.fill();
  }

  /**
   * Clear the canvas
   */
  public clear(): void {
    const { width, height } = this.config;
    this.ctx.clearRect(0, 0, width, height);
  }

  /**
   * Get canvas as data URL
   */
  public toDataURL(type?: string, quality?: number): string {
    return this.canvas.toDataURL(type, quality);
  }

  /**
   * Update configuration
   */
  public setConfig(config: Partial<CanvasConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (config.lineColor !== undefined) {
      this.ctx.strokeStyle = config.lineColor;
    }
    if (config.lineWidth !== undefined) {
      this.ctx.lineWidth = config.lineWidth;
    }
    if (config.lineCap !== undefined) {
      this.ctx.lineCap = config.lineCap;
    }
    if (config.lineJoin !== undefined) {
      this.ctx.lineJoin = config.lineJoin;
    }
    if (config.width !== undefined || config.height !== undefined) {
      this.setSize(this.config.width, this.config.height);
    }
  }

  /**
   * Get current configuration
   */
  public getConfig(): Required<CanvasConfig> {
    return { ...this.config };
  }

  /**
   * Check if currently drawing
   */
  public getIsDrawing(): boolean {
    return this.isDrawing;
  }

  /**
   * Destroy the canvas instance and clean up
   */
  public destroy(): void {
    // Remove event listeners
    this.canvas.removeEventListener("pointerdown", this.handlePointerDown);
    this.canvas.removeEventListener("pointermove", this.handlePointerMove);
    this.canvas.removeEventListener("pointerup", this.handlePointerUp);
    this.canvas.removeEventListener("pointercancel", this.handlePointerUp);
    this.canvas.removeEventListener("pointerleave", this.handlePointerUp);
    window.removeEventListener("resize", this.handleWindowResize);
    
    // Disconnect resize observer
    this.resizeObserver?.disconnect();
    
    // Cancel pending animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    
    this.isDrawing = false;
    this.lastPoint = null;
  }
}

export default Canvas;
