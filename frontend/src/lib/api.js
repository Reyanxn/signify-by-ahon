import axios from 'axios';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
  addAddress: (data) => API.post('/auth/address', data),
  deleteAddress: (id) => API.delete(`/auth/address/${id}`),
};

export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getFeatured: () => API.get('/products/featured'),
  getTrending: () => API.get('/products/trending'),
  getBySlug: (slug) => API.get(`/products/${slug}`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getAllAdmin: () => API.get('/categories/all'),
  getBySlug: (slug) => API.get(`/categories/${slug}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const orderAPI = {
  getAll: () => API.get('/orders'),
  getById: (id) => API.get(`/orders/${id}`),
  create: (data) => API.post('/orders', data),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  pay: (id, data) => API.put(`/orders/${id}/pay`, data),
};

export const bannerAPI = {
  getAll: (params) => API.get('/banners', { params }),
  getAllAdmin: () => API.get('/banners/all'),
  create: (data) => API.post('/banners', data),
  update: (id, data) => API.put(`/banners/${id}`, data),
  delete: (id) => API.delete(`/banners/${id}`),
};

export const cartAPI = {
  get: () => API.get('/cart'),
  getGuest: (guestId) => API.get(`/cart/guest/${guestId}`),
  add: (data) => API.post('/cart/add', data),
  update: (itemId, data) => API.put(`/cart/update/${itemId}`, data),
  remove: (itemId, guestId) => API.delete(`/cart/remove/${itemId}`, { data: { guestId } }),
};

export const uploadAPI = {
  upload: (formData) => API.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadSingle: (formData) => API.post('/upload/single', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const userAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`),
};

export const settingAPI = {
  get: () => API.get('/settings'),
  update: (data) => API.put('/settings', data),
};

export default API;
