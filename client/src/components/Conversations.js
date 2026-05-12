import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import './Conversations.css';

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading conversations...</div>;
  }

  return (
    <div className="conversations-container">
      <div className="conversations-wrapper">
        <div className="conversations-list">
          <h2>Messages</h2>
          {conversations.length === 0 ? (
            <p className="no-conversations">No conversations yet</p>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.userId}
                className={`conversation-item ${selectedUser?.userId === conv.userId ? 'active' : ''}`}
                onClick={() => setSelectedUser(conv)}
              >
                {conv.profileImage && (
                  <img src={conv.profileImage} alt={conv.name} className="conv-avatar" />
                )}
                <div className="conv-info">
                  <h4>{conv.name}</h4>
                  <p className="last-message">{conv.lastMessage}</p>
                  <span className="conv-time">
                    {new Date(conv.lastMessageTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {selectedUser ? (
          <Chat 
            selectedUserId={selectedUser.userId} 
            selectedUserName={selectedUser.name}
          />
        ) : (
          <div className="no-conversation-selected">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;