import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const placesAPI = {
  getAll: (params) => api.get('/places', { params }),
  getById: (id) => api.get(`/places/${id}`),
  getByCategory: (category) => api.get(`/places/category/${category}`),
  getRecommendations: () => api.get('/places/recommendations'),
  create: (data) => api.post('/places', data),
  update: (id, data) => api.put(`/places/${id}`, data),
  delete: (id) => api.delete(`/places/${id}`),
  generateItinerary: (data) => api.post('/places/itinerary', data),
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (placeId) => api.post('/favorites', { placeId }),
  remove: (placeId) => api.delete(`/favorites/${placeId}`),
};

export const reviewsAPI = {
  add: (data) => api.post('/reviews', data),
  getByPlace: (placeId) => api.get(`/reviews/${placeId}`),
};

export default api;
