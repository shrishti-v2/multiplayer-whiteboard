const Session = require('../models/Session');
const DrawingAction = require('../models/DrawingAction');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // User joins a room
    socket.on('join-room', async (data) => {
      const { roomId, userId, username, userColor } = data;

      socket.join(roomId);

      try {
        // Update or create session
        let session = await Session.findOne({ roomId });

        if (!session) {
          session = await Session.create({
            roomId,
            activeUsers: [
              {
                userId,
                username,
                cursorX: 0,
                cursorY: 0,
                color: userColor,
                socketId: socket.id,
              },
            ],
          });
        } else {
          session.activeUsers.push({
            userId,
            username,
            cursorX: 0,
            cursorY: 0,
            color: userColor,
            socketId: socket.id,
          });
          await session.save();
        }

        // Broadcast user joined to all clients in the room
        io.to(roomId).emit('user-joined', {
          userId,
          username,
          userColor,
          activeUsers: session.activeUsers,
        });
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    // Handle drawing events
    socket.on('draw', async (data) => {
      const { roomId, userId, points, color, size, opacity } = data;

      try {
        // Save drawing action to database
        await DrawingAction.create({
          roomId,
          userId,
          action: {
            type: 'draw',
            tool: 'pencil',
            points,
            color,
            size,
            opacity,
          },
        });

        // Broadcast to all clients in room
        socket.to(roomId).emit('draw', {
          userId,
          points,
          color,
          size,
          opacity,
        });
      } catch (error) {
        console.error('Error saving drawing:', error);
      }
    });

    // Handle shape drawing
    socket.on('shape', async (data) => {
      const { roomId, userId, type, startPos, endPos, color, size } = data;

      try {
        await DrawingAction.create({
          roomId,
          userId,
          action: {
            type: 'shape',
            tool: type,
            startPos,
            endPos,
            color,
            size,
          },
        });

        socket.to(roomId).emit('shape', {
          userId,
          type,
          startPos,
          endPos,
          color,
          size,
        });
      } catch (error) {
        console.error('Error drawing shape:', error);
      }
    });

    // Handle eraser
    socket.on('erase', async (data) => {
      const { roomId, userId, points, size } = data;

      try {
        await DrawingAction.create({
          roomId,
          userId,
          action: {
            type: 'erase',
            points,
            size,
          },
        });

        socket.to(roomId).emit('erase', {
          userId,
          points,
          size,
        });
      } catch (error) {
        console.error('Error erasing:', error);
      }
    });

    // Handle clear canvas
    socket.on('clear-canvas', async (data) => {
      const { roomId, userId } = data;

      try {
        await DrawingAction.create({
          roomId,
          userId,
          action: {
            type: 'clear',
          },
        });

        io.to(roomId).emit('clear-canvas', { userId });
      } catch (error) {
        console.error('Error clearing canvas:', error);
      }
    });

    // Handle cursor movement
    socket.on('cursor-move', (data) => {
      const { roomId, userId, x, y } = data;
      socket.to(roomId).emit('cursor-update', {
        userId,
        x,
        y,
      });
    });

    // Handle chat messages
    socket.on('message', async (data) => {
      const { roomId, userId, username, text } = data;

      io.to(roomId).emit('new-message', {
        userId,
        username,
        text,
        timestamp: new Date(),
      });
    });

    // User leaves room
    socket.on('leave-room', async (data) => {
      const { roomId, userId } = data;

      socket.leave(roomId);

      try {
        const session = await Session.findOne({ roomId });
        if (session) {
          session.activeUsers = session.activeUsers.filter(
            (u) => u.userId.toString() !== userId.toString()
          );
          await session.save();
        }

        io.to(roomId).emit('user-left', {
          userId,
          activeUsers: session ? session.activeUsers : [],
        });
      } catch (error) {
        console.error('Error leaving room:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.id}`);

      try {
        // Find and update all sessions where this socket was active
        const sessions = await Session.find({
          'activeUsers.socketId': socket.id,
        });

        for (const session of sessions) {
          session.activeUsers = session.activeUsers.filter(
            (u) => u.socketId !== socket.id
          );
          await session.save();

          io.to(session.roomId).emit('users-update', {
            activeUsers: session.activeUsers,
          });
        }
      } catch (error) {
        console.error('Error on disconnect:', error);
      }
    });
  });
};

module.exports = socketHandler;
