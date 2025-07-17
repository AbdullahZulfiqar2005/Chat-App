import React, { useEffect, useRef, useState } from 'react';

function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: 12,
      marginTop: 12,
      background: 'var(--surface)',
      borderRadius: 12,
      boxShadow: '0 2px 8px rgba(67,230,160,0.06)',
      padding: '0.5em 0.7em',
      alignItems: 'center',
    }}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: '1.1em',
          color: 'var(--text)',
        }}
        aria-label="Type a message"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        style={{
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: 8,
          border: 'none',
          padding: '0.5em 1.2em',
          fontWeight: 600,
          fontSize: '1em',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
        aria-label="Send message"
      >
        Send
      </button>
    </form>
  );
}

export default MessageInput; 