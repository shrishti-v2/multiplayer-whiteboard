import { useRef, useEffect } from 'react';
import useDrawingStore from '../store/drawingStore';

const useCanvas = (canvasRef) => {
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const { color, size, opacity, tool } = useDrawingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, [canvasRef]);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.strokeStyle = color;
    contextRef.current.lineWidth = size;
    contextRef.current.globalAlpha = opacity;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    contextRef.current.globalAlpha = 1;
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    contextRef.current.fillStyle = '#ffffff';
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  return {
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    contextRef,
  };
};

export default useCanvas;
