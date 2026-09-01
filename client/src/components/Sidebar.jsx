import React, { useEffect, useState } from 'react';
import { FiUsers, FiMessageCircle, FiX } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ activeUsers, messages, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>
          <FiUsers size={18} /> Users ({activeUsers.length})
        </h3>
        <div className="users-list">
          {activeUsers.map((user) => (
            <div key={user.userId} className="user-item" style={{ borderLeftColor: user.color }}>
              <span className="user-avatar" style={{ backgroundColor: user.color }}>
                {user.username.charAt(0).toUpperCase()}
              </span>
              <span className="user-name">{user.username}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`chat-toggle ${showChat ? 'active' : ''}`}
        onClick={() => setShowChat(!showChat)}
      >
        <FiMessageCircle size={20} />
        Chat
      </button>

      {showChat && (
        <div className="chat-container">
          <div className="chat-header">
            <h3>Chat</h3>
            <button onClick={() => setShowChat(false)}>
              <FiX size={18} />
            </button>
          </div>
          <div className="messages-list">
            {messages.map((msg, idx) => (
              <div key={idx} className="message-item">
                <strong>{msg.username}</strong>
                <p>{msg.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="chat-form">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
