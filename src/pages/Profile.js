import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ Import Link

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (error) {
        setMessage('Failed to fetch profile: ' + (error.response?.data?.message || error.message));
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Your Profile</h2>
      {profile ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {/* ✅ Add edit profile link */}
          <p>
            <Link to="/profile/edit">✏️ Edit Profile</Link>
          </p>
        </div>
      ) : (
        <p>{message || 'Loading profile...'}</p>
      )}
    </div>
  );
};

export default Profile;
