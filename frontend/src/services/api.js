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
  updateProfile: (data) => api.put('/auth/profile', data),
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
  generateTimeline: (data) => api.post('/places/timeline', data),
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

export const adminAPI = {
  registerAdmin: (data) => api.post('/admin/register', data),
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  changeRole: (id, role) => api.put(`/admin/user/${id}/role`, { role }),
  toggleStatus: (id, status) => api.put(`/admin/user/${id}/status`, { status }),
  getAnalytics: () => api.get('/admin/analytics'),
  getReviews: (params) => api.get('/admin/reviews', { params }),
  deleteReview: (id) => api.delete(`/admin/review/${id}`),
  getAuditLogs: (params) => api.get('/admin/audit-logs', { params }),
  getTripPlans: (params) => api.get('/admin/trip-plans', { params }),
};

export const enhancedAPI = {
  getTrending: () => api.get('/enhanced/trending'),
  getNearby: (params) => api.get('/enhanced/nearby', { params }),
  getWeather: (city) => api.get('/enhanced/weather', { params: { city } }),
  calculateBudget: (data) => api.post('/enhanced/budget', data),
  savePlan: (data) => api.post('/enhanced/plans', data),
  getPlans: () => api.get('/enhanced/plans'),
  deletePlan: (id) => api.delete(`/enhanced/plans/${id}`),
};

export default api;
