import React, { useState, useEffect } from 'react';
import api from '../api';
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
      const response = await api.get('/api/messages/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="conversations-container">
        <div className="conversations-wrapper">
          <div className="conversations-list">
            <div className="conv-list-header">
              <h2>Messages</h2>
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="conversation-item" style={{pointerEvents: 'none'}}>
                <div className="loading-skeleton" style={{width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0}}></div>
                <div className="conv-info" style={{flex: 1}}>
                  <div className="loading-skeleton" style={{height: '14px', width: '60%', marginBottom: '8px'}}></div>
                  <div className="loading-skeleton" style={{height: '12px', width: '80%'}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="no-conversation-selected">
            <div className="empty-chat-state">
              <span className="empty-icon">💬</span>
              <p>Select a conversation</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="conversations-container" id="conversations-page">
      <div className="conversations-wrapper">
        <div className="conversations-list">
          <div className="conv-list-header">
            <h2>Messages</h2>
            <span className="conv-count">{conversations.length}</span>
          </div>
          <div className="conv-list-body">
            {conversations.length === 0 ? (
              <div className="no-conversations">
                <span>💬</span>
                <p>No conversations yet</p>
                <p className="hint">Match with developers to start chatting</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.userId}
                  className={`conversation-item ${selectedUser?.userId === conv.userId ? 'active' : ''}`}
                  onClick={() => setSelectedUser(conv)}
                >
                  <div className="conv-avatar-wrap">
                    {conv.profileImage ? (
                      <img src={conv.profileImage} alt={conv.name} className="conv-avatar" />
                    ) : (
                      <div className="conv-avatar-placeholder">
                        {conv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="conv-info">
                    <h4>{conv.name}</h4>
                    <p className="last-message">{conv.lastMessage}</p>
                  </div>
                  <span className="conv-time">
                    {new Date(conv.lastMessageTime).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedUser ? (
          <Chat 
            selectedUserId={selectedUser.userId} 
            selectedUserName={selectedUser.name}
          />
        ) : (
          <div className="no-conversation-selected">
            <div className="empty-chat-state">
              <span className="empty-icon">💬</span>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;