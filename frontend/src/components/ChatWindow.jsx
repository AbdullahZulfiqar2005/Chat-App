import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

function ChatWindow({ selectedUser, socket }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    if (!selectedUser) return;
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/api/messages/${selectedUser.uid}`, {
      params: { uid: user.uid },
    })
      .then(res => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, [selectedUser, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for real-time messages
  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => {
      if ((msg.sender === selectedUser.uid && msg.recipient === user.uid) ||
          (msg.sender === user.uid && msg.recipient === selectedUser.uid)) {
        setMessages(prev => [...prev, msg]);
      }
    };
    socket.on('receiveMessage', handler);
    socket.on('messageSent', handler);
    return () => {
      socket.off('receiveMessage', handler);
      socket.off('messageSent', handler);
    };
  }, [socket, selectedUser, user]);

  if (!selectedUser) return (
    <div style={{
      display: 'flex',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      background: 'linear-gradient(135deg, #f7f6f2 0%, #e9e4f0 100%)',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #fff 60%, #f7f6f2 100%)',
        borderRadius: 32,
        boxShadow: '0 8px 32px rgba(162,89,247,0.10)',
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
      }}>
        <div style={{
          width: 110,
          height: 110,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #A259F7 60%, #43E6A0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 4px 24px rgba(162,89,247,0.15)',
        }}>
          <img src="/global-chat-logo.png" alt="Global Chat Logo" style={{ width: 70, height: 70, borderRadius: '50%' }} />
        </div>
        <h1 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '2.3rem', margin: 0, letterSpacing: 1 }}>Global Chat</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.15rem', marginTop: 14, textAlign: 'center', fontWeight: 500 }}>
          Connect instantly with anyone, anywhere.<br />Your conversations, beautifully simple.
        </p>
      </div>
    </div>
  );
  if (loading) return <div>Loading messages...</div>;
  if (messages.length === 0) return <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: '30%' }}>No messages yet. Say hello!</div>;

  let lastDate = '';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 12 }}>
        {messages.map((msg, idx) => {
          const msgDate = formatDate(msg.createdAt);
          const showDate = msgDate !== lastDate;
          lastDate = msgDate;
          return (
            <React.Fragment key={msg._id || idx}>
              {showDate && (
                <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.95em', margin: '18px 0 8px' }}>{msgDate}</div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === user.uid ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div
                  title={formatTime(msg.createdAt)}
                  style={{
                    background: msg.sender === user.uid ? 'var(--primary)' : 'var(--surface)',
                    color: msg.sender === user.uid ? '#fff' : 'var(--text)',
                    borderRadius: 16,
                    padding: '0.7em 1.1em',
                    maxWidth: '85%',
                    boxShadow: '0 2px 8px rgba(162,89,247,0.08)',
                    fontSize: '1.05em',
                    wordBreak: 'break-word',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  {msg.sender !== user.uid && (
                    <div style={{
                      fontSize: '0.75em',
                      color: 'var(--muted)',
                      marginBottom: 4,
                      fontWeight: 600,
                    }}>
                      {selectedUser?.displayName || selectedUser?.email?.split('@')[0] || 'Sender'}
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatWindow; 