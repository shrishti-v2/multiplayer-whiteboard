import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Toolbar from '../components/Toolbar';
import Sidebar from '../components/Sidebar';
import Canvas from '../components/Canvas';
import useSocket from '../hooks/useSocket';
import useAuth from '../hooks/useAuth';
import useDrawingStore from '../store/drawingStore';
import useRoomStore from '../store/roomStore';
import { whiteboardAPI, roomAPI } from '../utils/api';
import './Whiteboard.css';

const Whiteboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socket = useSocket();
  const { user } = useAuth();
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);

  const { color, size, opacity, tool, addToHistory, undo: undoStore, redo: redoStore } = useDrawingStore();
  const { activeUsers, setActiveUsers, addUser, removeUser, addMessage, messages } = useRoomStore();

  const [whiteboard, setWhiteboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userColor] = useState(generateUserColor());

  function generateUserColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;
  }, []);

  // Fetch whiteboard data
  useEffect(() => {
    const fetchWhiteboard = async () => {
      try {
        const response = await whiteboardAPI.getById(roomId);
        setWhiteboard(response.data.whiteboard);
      } catch (error) {
        console.error('Failed to fetch whiteboard:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchWhiteboard();
  }, [roomId, navigate]);

  // Join room via socket
  useEffect(() => {
    if (!socket || !user || !roomId) return;

    // Emit join-room event
    socket.emit('join-room', {
      roomId,
      userId: user.id,
      username: user.username,
      userColor,
    });

    // Listen for user-joined event
    socket.on('user-joined', (data) => {
      setActiveUsers(data.activeUsers);
    });

    // Listen for draw events from other users
    socket.on('draw', (data) => {
      drawFromOtherUser(data);
    });

    // Listen for shape events
    socket.on('shape', (data) => {
      drawShapeFromOtherUser(data);
    });

    // Listen for erase events
    socket.on('erase', (data) => {
      eraseFromOtherUser(data);
    });

    // Listen for canvas clear
    socket.on('clear-canvas', (data) => {
      clearCanvasAll();
    });

    // Listen for users update
    socket.on('users-update', (data) => {
      setActiveUsers(data.activeUsers);
    });

    // Listen for user left
    socket.on('user-left', (data) => {
      setActiveUsers(data.activeUsers);
    });

    // Listen for chat messages
    socket.on('new-message', (data) => {
      addMessage(data);
    });

    return () => {
      socket.off('user-joined');
      socket.off('draw');
      socket.off('shape');
      socket.off('erase');
      socket.off('clear-canvas');
      socket.off('users-update');
      socket.off('user-left');
      socket.off('new-message');
    };
  }, [socket, user, roomId, userColor, setActiveUsers, addMessage]);

  // Drawing functions
  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    contextRef.current.lineWidth = size;
    contextRef.current.globalAlpha = tool === 'eraser' ? 1 : opacity;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    isDrawing.current = true;
    lastPoint.current = { x: offsetX, y: offsetY };
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Emit draw event to other users
    if (socket) {
      socket.emit('draw', {
        roomId,
        userId: user.id,
        points: [{ x: offsetX, y: offsetY }],
        color: tool === 'eraser' ? '#ffffff' : color,
        size,
        opacity: tool === 'eraser' ? 1 : opacity,
      });
    }
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    contextRef.current.globalAlpha = 1;
    isDrawing.current = false;
  };

  const clearCanvasLocal = () => {
    const canvas = canvasRef.current;
    contextRef.current.fillStyle = '#ffffff';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);

    if (socket) {
      socket.emit('clear-canvas', {
        roomId,
        userId: user.id,
      });
    }
  };

  const clearCanvasAll = () => {
    const canvas = canvasRef.current;
    contextRef.current.fillStyle = '#ffffff';
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawFromOtherUser = (data) => {
    const { points, color: drawColor, size: drawSize, opacity: drawOpacity } = data;
    contextRef.current.strokeStyle = drawColor;
    contextRef.current.lineWidth = drawSize;
    contextRef.current.globalAlpha = drawOpacity;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';
    contextRef.current.beginPath();

    points.forEach((point, idx) => {
      if (idx === 0) {
        contextRef.current.moveTo(point.x, point.y);
      } else {
        contextRef.current.lineTo(point.x, point.y);
      }
    });

    contextRef.current.stroke();
    contextRef.current.globalAlpha = 1;
  };

  const drawShapeFromOtherUser = (data) => {
    // Implement shape drawing from other users
    const { type, startPos, endPos, color: drawColor, size: drawSize } = data;
    contextRef.current.strokeStyle = drawColor;
    contextRef.current.lineWidth = drawSize;

    if (type === 'rectangle') {
      contextRef.current.strokeRect(
        startPos.x,
        startPos.y,
        endPos.x - startPos.x,
        endPos.y - startPos.y
      );
    } else if (type === 'circle') {
      const radius = Math.sqrt(
        Math.pow(endPos.x - startPos.x, 2) + Math.pow(endPos.y - startPos.y, 2)
      );
      contextRef.current.beginPath();
      contextRef.current.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      contextRef.current.stroke();
    }
  };

  const eraseFromOtherUser = (data) => {
    const { points, size: eraserSize } = data;
    contextRef.current.strokeStyle = '#ffffff';
    contextRef.current.lineWidth = eraserSize;
    contextRef.current.lineCap = 'round';
    contextRef.current.lineJoin = 'round';
    contextRef.current.beginPath();

    points.forEach((point, idx) => {
      if (idx === 0) {
        contextRef.current.moveTo(point.x, point.y);
      } else {
        contextRef.current.lineTo(point.x, point.y);
      }
    });

    contextRef.current.stroke();
  };

  const handleSendMessage = (text) => {
    if (socket) {
      socket.emit('message', {
        roomId,
        userId: user.id,
        username: user.username,
        text,
      });
    }
  };

  const handleUndo = () => {
    undoStore();
  };

  const handleRedo = () => {
    redoStore();
  };

  if (loading) return <div className="loading-page">Loading whiteboard...</div>;

  return (
    <div className="whiteboard-page">
      <Header title={whiteboard?.title} />
      <Toolbar onClear={clearCanvasLocal} onUndo={handleUndo} onRedo={handleRedo} />
      <div className="whiteboard-container">
        <div className="canvas-wrapper">
          <Canvas ref={canvasRef} onDrawStart={startDrawing} onDraw={draw} onDrawEnd={stopDrawing} />
        </div>
        <Sidebar activeUsers={activeUsers} messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default Whiteboard;
