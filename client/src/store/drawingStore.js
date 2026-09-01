import { create } from 'zustand';

const useDrawingStore = create((set) => ({
  tool: 'pencil',
  color: '#000000',
  size: 2,
  opacity: 1,
  canvasWidth: 1200,
  canvasHeight: 700,
  backgroundColor: '#ffffff',
  history: [],
  historyIndex: -1,

  setTool: (tool) => set({ tool }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setOpacity: (opacity) => set({ opacity }),
  setCanvasSize: (width, height) => set({ canvasWidth: width, canvasHeight: height }),
  setBackgroundColor: (color) => set({ backgroundColor: color }),

  addToHistory: (action) =>
    set((state) => ({
      history: state.history.slice(0, state.historyIndex + 1).concat(action),
      historyIndex: state.historyIndex + 1,
    })),

  undo: () =>
    set((state) => ({
      historyIndex: Math.max(0, state.historyIndex - 1),
    })),

  redo: () =>
    set((state) => ({
      historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
    })),

  reset: () =>
    set({
      history: [],
      historyIndex: -1,
    }),
}));

export default useDrawingStore;
