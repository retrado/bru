import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

// ✅ Use REACT_APP_SOCKET_URL for production backend socket connection
const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');

const Chat = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/message/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const newMessage = {
        receiverId: userId,
        text,
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/message/send`,
        newMessage,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      socket.emit('sendMessage', {
        senderId: currentUser._id,
        receiverId: userId,
        message: text,
      });

      setMessages(prev => [...prev, { ...newMessage, sender: currentUser._id }]);
      setText('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  useEffect(() => {
    fetchMessages();

    // ✅ Join room for real-time messaging
    socket.emit('join', currentUser._id);

    // ✅ Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      if (msg.senderId === userId) {
        setMessages(prev => [...prev, { sender: msg.senderId, text: msg.message }]);
      }
    });

    return () => {
      // ⚠️ Don't disconnect global socket, just remove listener
      socket.off('receiveMessage');
    };
  }, [userId, currentUser._id]);

  return (
    <div>
      <h2>Chat with User: {userId}</h2>
      <div style={{ border: '1px solid gray', padding: '10px', height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender === userId ? 'Them' : 'You'}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Chat;
