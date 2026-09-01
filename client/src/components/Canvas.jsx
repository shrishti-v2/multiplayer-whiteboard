import React, { useEffect, useRef } from 'react';
import './Canvas.css';

const Canvas = ({ onDrawStart, onDraw, onDrawEnd }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="canvas"
      onMouseDown={onDrawStart}
      onMouseMove={onDraw}
      onMouseUp={onDrawEnd}
      onMouseLeave={onDrawEnd}
    />
  );
};

export default Canvas;
