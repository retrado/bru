import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    bio: '',
    interests: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const { name, age, bio, interests } = res.data;
        setFormData({
          name,
          age: age || '',
          bio: bio || '',
          interests: (interests || []).join(', ')
        });
      } catch (err) {
        setMessage('Failed to load profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL}/profile/update`, {
        name: formData.name,
        age: Number(formData.age),
        bio: formData.bio,
        interests: formData.interests.split(',').map(i => i.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Profile updated!');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /><br />
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} /><br />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} /><br />
        <input type="text" name="interests" placeholder="Interests (comma-separated)" value={formData.interests} onChange={handleChange} /><br />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
