import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ContactsList from '../components/ContactsList';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import { io } from 'socket.io-client';

function Chat() {
  const { user, logout } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  // Connect to Socket.IO
  useEffect(() => {
    if (!user) return;
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL, {
      auth: { uid: user.uid },
      withCredentials: true,
    });
    socketRef.current.emit('userOnline', user.uid);
    socketRef.current.on('onlineUsers', setOnlineUsers);
    return () => {
      socketRef.current.disconnect();
    };
  }, [user]);

  // Send message handler
  const handleSendMessage = (content) => {
    if (!selectedUser || !content.trim()) return;
    socketRef.current.emit('sendMessage', {
      sender: user.uid,
      recipient: selectedUser.uid,
      content,
    });
  };

  // Get current user's display name
  let displayName = user?.displayName;
  if (!displayName && user) {
    const key = `displayName_${user.uid}`;
    displayName = localStorage.getItem(key) || user.email.split('@')[0];
  }

  return (
    <div className="chat-layout" style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%)',
    }}>
      {/* Sidebar: Contacts */}
      <aside className="chat-sidebar" style={{
        width: 300,
        background: 'var(--surface)',
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        boxShadow: '2px 0 16px rgba(162,89,247,0.06)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        height: 'calc(100vh - 4rem)',
        position: 'sticky',
        top: '2rem',
        overflowY: 'auto',
      }}>
        <div style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--primary)', marginBottom: 8 }}>Contacts</div>
        <div style={{ fontWeight: 500, fontSize: '1.1rem', color: 'var(--muted)', marginBottom: 16 }}>
          Your name: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{displayName}</span>
        </div>
        <ContactsList
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
          onlineUsers={onlineUsers}
        />
        <button onClick={logout} style={{ marginTop: 'auto', background: 'var(--error)', color: '#fff' }}>Logout</button>
      </aside>
      {/* Main Chat Area */}
      <main className="chat-main" style={{
        flex: 1,
        background: 'linear-gradient(135deg, #f7f6f2 0%, #e9e4f0 100%)',
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        boxShadow: '-2px 0 16px rgba(67,230,160,0.06)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 'calc(100vh - 4rem)',
      }}>
        <ChatWindow selectedUser={selectedUser} socket={socketRef.current} />
        {selectedUser && (
          <MessageInput onSend={handleSendMessage} disabled={!selectedUser} />
        )}
      </main>
    </div>
  );
}

export default Chat; 