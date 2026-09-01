import React from 'react';
import { FiPencil, FiSquare, FiCircle, FiSlash, FiTrash2, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import useDrawingStore from '../store/drawingStore';
import './Toolbar.css';

const Toolbar = ({ onClear, onUndo, onRedo }) => {
  const { tool, setTool, color, setColor, size, setSize, opacity, setOpacity } = useDrawingStore();

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          className={`tool-btn ${tool === 'pencil' ? 'active' : ''}`}
          onClick={() => setTool('pencil')}
          title="Pencil (P)"
        >
          <FiPencil size={20} />
        </button>
        <button
          className={`tool-btn ${tool === 'rectangle' ? 'active' : ''}`}
          onClick={() => setTool('rectangle')}
          title="Rectangle"
        >
          <FiSquare size={20} />
        </button>
        <button
          className={`tool-btn ${tool === 'circle' ? 'active' : ''}`}
          onClick={() => setTool('circle')}
          title="Circle"
        >
          <FiCircle size={20} />
        </button>
        <button
          className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
          onClick={() => setTool('eraser')}
          title="Eraser"
        >
          <FiSlash size={20} />
        </button>
      </div>

      <div className="toolbar-group">
        <label className="color-picker">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            title="Pick a color"
          />
          <span>Color</span>
        </label>
      </div>

      <div className="toolbar-group">
        <label className="slider-control">
          <span>Size: {size}</span>
          <input
            type="range"
            min="1"
            max="50"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="toolbar-group">
        <label className="slider-control">
          <span>Opacity: {Math.round(opacity * 100)}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="toolbar-group">
        <button className="tool-btn danger" onClick={onUndo} title="Undo (Ctrl+Z)">
          <FiRotateCcw size={20} />
        </button>
        <button className="tool-btn danger" onClick={onRedo} title="Redo (Ctrl+Y)">
          <FiRotateCw size={20} />
        </button>
        <button className="tool-btn danger" onClick={onClear} title="Clear Canvas">
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
