"use client";

import { useEffect, useRef, useCallback } from "react";
import { Canvas, CanvasConfig, Point } from "@/lib/Canvas";

export interface DrawingCanvasProps {
  width?: number;
  height?: number;
  className?: string;
  lineColor?: string;
  lineWidth?: number;
  onDrawStart?: (point: Point) => void;
  onDrawMove?: (point: Point) => void;
  onDrawEnd?: () => void;
  onResize?: (width: number, height: number) => void;
}

export default function DrawingCanvas({
  width = 800,
  height = 600,
  className = "",
  lineColor = "#00ffff",
  lineWidth = 2,
  onDrawStart,
  onDrawMove,
  onDrawEnd,
  onResize,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasInstanceRef = useRef<Canvas | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const config: CanvasConfig = {
      width,
      height,
      lineColor,
      lineWidth,
    };

    const canvas = new Canvas(canvasElement, config);
    
    // Attach callbacks
    canvas.onDrawStart = onDrawStart;
    canvas.onDrawMove = onDrawMove;
    canvas.onDrawEnd = onDrawEnd;
    canvas.onResize = onResize;
    
    canvasInstanceRef.current = canvas;

    return () => {
      canvas.destroy();
      canvasInstanceRef.current = null;
    };
  }, []);

  // Update config when props change
  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    canvas.setConfig({
      width,
      height,
      lineColor,
      lineWidth,
    });
  }, [width, height, lineColor, lineWidth]);

  // Update callbacks when they change
  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;

    canvas.onDrawStart = onDrawStart;
    canvas.onDrawMove = onDrawMove;
    canvas.onDrawEnd = onDrawEnd;
    canvas.onResize = onResize;
  }, [onDrawStart, onDrawMove, onDrawEnd, onResize]);

  return (
    <canvas
      ref={canvasRef}
      className={`block touch-none ${className}`}
      style={{
        width: "100%",
        height: "100%",
        cursor: "crosshair",
      }}
      data-testid="drawing-canvas"
    />
  );
}
