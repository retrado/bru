import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ Initialize navigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/explore`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        setMessage('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleLike = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/match/like/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setMessage(res.data.message || 'Liked!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to like user');
    }
  };

  return (
    <div>
      <h2>Explore Users</h2>
      {message && <p>{message}</p>}
      {users.length === 0 ? (
        <p>No users to show</p>
      ) : (
        users.map((user) => (
          <div
            key={user._id}
            style={{
              border: '1px solid #ccc',
              marginBottom: '10px',
              padding: '10px'
            }}
          >
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Bio:</strong> {user.bio}</p>
            <p><strong>Interests:</strong> {(user.interests || []).join(', ')}</p>
            <button onClick={() => handleLike(user._id)}>❤️ Like</button>
            <button onClick={() => navigate(`/chat/${user._id}`)}>💬 Chat</button> {/* ✅ Chat button */}
          </div>
        ))
      )}
    </div>
  );
};

export default Explore;



