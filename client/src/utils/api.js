import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const whiteboardAPI = {
  create: (title, isPublic) => api.post('/whiteboards', { title, isPublic }),
  getAll: () => api.get('/whiteboards'),
  getById: (roomId) => api.get(`/whiteboards/${roomId}`),
  update: (roomId, data) => api.put(`/whiteboards/${roomId}`, data),
  delete: (roomId) => api.delete(`/whiteboards/${roomId}`),
};

export const roomAPI = {
  join: (roomId) => api.post(`/rooms/${roomId}/join`),
  leave: (roomId) => api.post(`/rooms/${roomId}/leave`),
};

export default api;
