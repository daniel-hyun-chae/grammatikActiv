import { useEffect, useRef } from "react";

export default function Canvas({
  draw,
  width,
  height,
}: {
  draw: (ctx: CanvasRenderingContext2D) => void;
  width: number;
  height: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = canvasRef.current;

  useEffect(() => {
    if (canvas && canvas.getContext) {
      canvas.height = height;
      canvas.width = width;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        draw(ctx);
      }
    }
  }, [draw, canvas]);

  return <canvas ref={canvasRef}></canvas>;
}
