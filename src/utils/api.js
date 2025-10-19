import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// File APIs
export const fileAPI = {
  upload: (formData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAll: () => api.get('/files'),
  getOne: (id) => api.get(`/files/${id}`),
  delete: (id) => api.delete(`/files/${id}`),
};

// Insight APIs
export const insightAPI = {
  generate: (fileId) => api.post(`/insights/generate/${fileId}`),
  getByFile: (fileId) => api.get(`/insights/file/${fileId}`),
  getAll: () => api.get('/insights'),
};

// Vitals APIs
export const vitalsAPI = {
  add: (data) => api.post('/vitals', data),
  getAll: () => api.get('/vitals'),
  getOne: (id) => api.get(`/vitals/${id}`),
  update: (id, data) => api.put(`/vitals/${id}`, data),
  delete: (id) => api.delete(`/vitals/${id}`),
  getAdvice: (id) => api.get(`/vitals/${id}/advice`),
};

export default api;
