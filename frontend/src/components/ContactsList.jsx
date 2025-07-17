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
          params: { uid: user.uid },
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
          key={contact.uid}
          onClick={() => onSelect(contact)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0.7em 1em',
            borderRadius: 10,
            background: selectedUser && selectedUser.uid === contact.uid ? 'var(--primary)' : 'var(--surface)',
            color: selectedUser && selectedUser.uid === contact.uid ? '#fff' : 'var(--text)',
            cursor: 'pointer',
            boxShadow: selectedUser && selectedUser.uid === contact.uid ? '0 2px 8px rgba(162,89,247,0.10)' : 'none',
            fontWeight: 500,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          <span style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: onlineUsers?.includes(contact.uid) ? 'var(--accent)' : 'var(--muted)',
            display: 'inline-block',
          }} />
          <span>{contact.displayName || contact.email.split('@')[0]}</span>
        </div>
      ))}
    </div>
  );
}

export default ContactsList; 