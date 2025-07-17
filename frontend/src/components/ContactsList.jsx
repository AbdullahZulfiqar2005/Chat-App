import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ContactsList({ selectedUser, onSelect, onlineUsers }) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setContacts(res.data);
      } catch {
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {contacts.map(contact => (
        <div
          key={contact._id}
          onClick={() => onSelect(contact)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0.7em 1em',
            borderRadius: 10,
            background: selectedUser && selectedUser._id === contact._id ? 'var(--primary)' : 'var(--surface)',
            color: selectedUser && selectedUser._id === contact._id ? '#fff' : 'var(--text)',
            cursor: 'pointer',
            boxShadow: selectedUser && selectedUser._id === contact._id ? '0 2px 8px rgba(162,89,247,0.10)' : 'none',
            fontWeight: 500,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <span style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: onlineUsers?.includes(contact._id) ? 'var(--accent)' : 'var(--muted)',
            display: 'inline-block',
          }} />
          <span>{contact.username}</span>
        </div>
      ))}
    </div>
  );
}

export default ContactsList; 