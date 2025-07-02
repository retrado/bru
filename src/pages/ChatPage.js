// src/pages/ChatPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
  const { userId } = useParams(); // the person you're chatting with
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatUser, setChatUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/message/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages);
        setChatUser(res.data.user); // user you're chatting with
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();
  }, [userId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/message/send`,
        { receiverId: userId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  return (
    <div>
      <h2>Chat with {chatUser?.name || 'User'}</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, maxHeight: 400, overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '10px 0' }}>
            <strong>{msg.sender === userId ? chatUser?.name : 'You'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
