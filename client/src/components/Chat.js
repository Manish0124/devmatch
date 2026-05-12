import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import api, { API_BASE_URL } from '../api';
import './Chat.css';

const Chat = ({ selectedUserId, selectedUserName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : null;

    socketRef.current = io(API_BASE_URL, {
      query: { token }
    });

    socketRef.current.emit('join', userId);

    socketRef.current.on('receiveMessage', (data) => {
      if (data.senderId === selectedUserId) {
        setMessages(prev => [...prev, {
          senderId: { _id: data.senderId },
          receiverId: userId,
          message: data.message,
          createdAt: data.createdAt || new Date().toISOString()
        }]);
      }
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/api/messages/conversation/${selectedUserId}`);
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : null;

    try {
      const response = await api.post('/api/messages/send', {
        receiverId: selectedUserId,
        message: newMessage
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');

      if (socketRef.current) {
        socketRef.current.emit('sendMessage', {
          senderId: userId,
          receiverId: selectedUserId,
          message: newMessage
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to get sender ID from either populated object or plain string
  const getSenderId = (msg) => {
    if (msg.senderId && typeof msg.senderId === 'object') {
      return msg.senderId._id;
    }
    return msg.senderId;
  };

  if (loading) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h3>{selectedUserName}</h3>
        </div>
        <div className="messages-list">
          <div className="chat-loading-state">
            <div className="loading-skeleton" style={{width: '60%', height: '36px', borderRadius: '12px', alignSelf: 'flex-start', marginBottom: '12px'}}></div>
            <div className="loading-skeleton" style={{width: '45%', height: '36px', borderRadius: '12px', alignSelf: 'flex-end', marginBottom: '12px'}}></div>
            <div className="loading-skeleton" style={{width: '55%', height: '36px', borderRadius: '12px', alignSelf: 'flex-start'}}></div>
          </div>
        </div>
      </div>
    );
  }

  const userStr = localStorage.getItem('user');
  const userId = userStr ? JSON.parse(userStr).id : null;

  return (
    <div className="chat-container" id="chat-container">
      <div className="chat-header">
        <div className="chat-header-avatar">
          {selectedUserName.charAt(0).toUpperCase()}
        </div>
        <div className="chat-header-info">
          <h3>{selectedUserName}</h3>
          <span className="online-status">Online</span>
        </div>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">
            <span>👋</span>
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${getSenderId(msg) === userId ? 'sent' : 'received'}`}
            >
              <p className="message-text">{msg.message}</p>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={sending}
          className="message-input"
          id="message-input"
        />
        <button type="submit" disabled={sending || !newMessage.trim()} className="send-btn" id="send-message-btn">
          {sending ? '...' : '↑'}
        </button>
      </form>
    </div>
  );
};

export default Chat;