# Multiplayer Whiteboard - MERN Stack

A real-time collaborative whiteboard application built with MongoDB, Express, React, and Node.js.

## Features

- 🎨 Real-time collaborative drawing
- 👥 Multiple users in same session
- 🔄 Real-time synchronization with WebSocket
- 🎯 Drawing tools (pencil, shapes, eraser)
- 💾 Save and restore whiteboard sessions
- 💬 Real-time chat
- 🔐 User authentication
- 🌙 Dark mode support

## Tech Stack

### Frontend
- React.js
- Socket.io-client
- Tailwind CSS
- Zustand (State Management)
- Canvas API

### Backend
- Node.js + Express
- Socket.io
- MongoDB + Mongoose
- JWT Authentication
- Redis (Optional - Caching)

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/shrishti-v2/multiplayer-whiteboard.git
cd multiplayer-whiteboard
```

2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

3. Setup Frontend
```bash
cd ../client
npm install
cp .env.example .env
# Configure your .env file
npm start
```

## Project Structure

```
multiplayer-whiteboard/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── utils/
│   │   └── App.jsx
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── models/           # MongoDB Schemas
│   ├── routes/           # API Routes
│   ├── controllers/      # Route Controllers
│   ├── middleware/       # Custom Middleware
│   ├── socket/           # WebSocket Handlers
│   ├── config/           # Configuration Files
│   ├── utils/            # Utility Functions
│   └── server.js         # Entry Point
│
└── README.md
```

## License

MIT
