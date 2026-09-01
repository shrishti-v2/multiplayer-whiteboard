import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Whiteboard from './pages/Whiteboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/whiteboard/:roomId"
          element={
            <PrivateRoute>
              <Whiteboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
