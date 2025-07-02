// src/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://retrado-k3qh.onrender.com', // 🔗 Your live backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
