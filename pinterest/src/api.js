// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:55',
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default api;