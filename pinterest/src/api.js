// src/api.js
import axios from 'axios';
import URL from './url';

const api = axios.create({
  baseURL: URL,
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default api;