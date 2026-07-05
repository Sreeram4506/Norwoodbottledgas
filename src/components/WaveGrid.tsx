import { useEffect, useRef } from 'react';
import p5 from 'p5';

const CELL_SIZE = 30;
const SPACING_RATIO = 1.5;
const DIAGONAL_PERIOD = 15;
const AMP = 0.9;
const SPEED = 0.02;

export default function WaveGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || p5Ref.current) return;

    const sketch = (p: p5) => {
      let cols: number, rows: number, spacing: number, offsetX: number, offsetY: number;
      let phase = 0;
      let isMobile = false;

      const updateGrid = () => {
        isMobile = p.width < 768;
        const cellSize = isMobile ? 40 : CELL_SIZE;
        spacing = cellSize * SPACING_RATIO;
        cols = Math.ceil(p.width / spacing) + 2;
        rows = Math.ceil(p.height / spacing) + 2;
        offsetX = (p.width - (cols - 1) * spacing) / 2;
        offsetY = (p.height - (rows - 1) * spacing) / 2;
      };

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.style('display', 'block');
        canvas.style('border', 'none');
        canvas.style('outline', 'none');
        p.frameRate(30);
        updateGrid();
      };

      p.draw = () => {
        p.clear();
        updateGrid();

        const cellSize = isMobile ? 40 : CELL_SIZE;

        for (let c = 0; c < cols; c++) {
          const diag = Math.sin((c / DIAGONAL_PERIOD) + phase);
          const osc = p.map(diag, -1, 1, 0, AMP);

          for (let r = 0; r < rows; r++) {
            const val = Math.sin(phase + osc * r);
            const brightness = p.map(val, -1, 1, 0, 100);
            const col = p.color(`hsl(20, 70%, ${brightness}%)`);
            p.noStroke();
            p.fill(col);
            p.rectMode(p.CENTER);
            const x = offsetX + c * spacing;
            const y = offsetY + r * spacing;
            p.rect(x, y, cellSize * 0.9, cellSize * 0.9, 2);
          }
        }

        phase += SPEED;
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        updateGrid();
      };
    };

    p5Ref.current = new p5(sketch, containerRef.current);

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
        p5Ref.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    />
  );
}
