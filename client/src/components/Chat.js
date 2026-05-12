import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
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
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')).id
      : null;

    socketRef.current = io('http://localhost:5000', {
      query: { token }
    });

    socketRef.current.emit('join', userId);

    socketRef.current.on('receiveMessage', (data) => {
      setMessages(prev => [...prev, {
        senderId: data.senderId,
        receiverId: userId,
        message: data.message,
        createdAt: new Date().toISOString()
      }]);
    });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/messages/conversation/${selectedUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
    const userId = JSON.parse(localStorage.getItem('user')).id;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/messages/send',
        {
          receiverId: selectedUserId,
          message: newMessage
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');

      // Also emit via socket for real-time delivery
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

  if (loading) {
    return <div className="chat-loading">Loading messages...</div>;
  }

  const userId = JSON.parse(localStorage.getItem('user')).id;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>{selectedUserName}</h3>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.senderId === userId ? 'sent' : 'received'}`}
            >
              <p className="message-text">{msg.message}</p>
              <span className="message-time">
                {new Date(msg.createdAt).toLocaleTimeString()}
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
          placeholder="Type your message..."
          disabled={sending}
          className="message-input"
        />
        <button type="submit" disabled={sending} className="send-btn">
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default Chat;