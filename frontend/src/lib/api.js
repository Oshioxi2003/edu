import axios from './axios';

// Auth APIs
export const authAPI = {
  login: (credentials) => axios.post('/auth/login/', credentials),
  register: (userData) => axios.post('/auth/register/', userData),
  logout: (refreshToken) => axios.post('/auth/logout/', { refresh_token: refreshToken }),
  refresh: (refreshToken) => axios.post('/auth/refresh/', { refresh: refreshToken }),
  getCurrentUser: () => axios.get('/auth/me/'),
  getProfile: () => axios.get('/auth/profile/'),
  updateProfile: (data) => axios.put('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  patchProfile: (data) => axios.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  changePassword: (data) => axios.post('/auth/change-password/', data),
  getEnrollments: () => axios.get('/auth/enrollments/'),
};

// Catalog APIs
export const catalogAPI = {
  // Books
  getBooks: (params) => axios.get('/catalog/books/', { params }),
  getBook: (slug) => axios.get(`/catalog/books/${slug}/`),
  getBookUnits: (slug) => axios.get(`/catalog/books/${slug}/units/`),
  
  // Units
  getUnit: (unitId) => axios.get(`/catalog/units/${unitId}/`),
  getUnitAssetUrl: (unitId, assetType) => axios.post(`/catalog/units/${unitId}/asset_url/`, {
    asset_type: assetType
  }),
};

// Progress APIs
export const progressAPI = {
  getProgress: () => axios.get('/progress/'),
  getAnalytics: () => axios.get('/progress/analytics/'),
  createSession: (unitId, data) => axios.post(`/progress/sessions/units/${unitId}/tick/`, data),
};

// Quiz APIs
export const quizAPI = {
  getQuestions: (unitId) => axios.get(`/quiz/units/${unitId}/questions/`),
  submitQuiz: (unitId, data) => axios.post(`/quiz/units/${unitId}/submit/`, data),
  getAttempts: (params) => axios.get('/quiz/attempts/', { params }),
  getAttempt: (attemptId) => axios.get(`/quiz/attempts/${attemptId}/`),
  getBestAttempt: (unitId) => axios.get(`/quiz/attempts/units/${unitId}/best/`),
};

// Payment APIs
export const paymentAPI = {
  // Orders
  createOrder: (bookId, provider) => axios.post('/payments/orders/create_order/', { 
    book_id: bookId, 
    provider: provider 
  }),
  getOrders: (params) => axios.get('/payments/orders/', { params }),
  getOrder: (orderId) => axios.get('/payments/orders/', { params: { id: orderId } }),
  
  // VNPay
  createVNPayCheckout: (orderId) => axios.post('/payments/vnpay/checkout/', { 
    order_id: orderId 
  }),
  
  // MoMo
  createMoMoCheckout: (orderId) => axios.post('/payments/momo/checkout/', { 
    order_id: orderId 
  }),
};

export default {
  auth: authAPI,
  catalog: catalogAPI,
  progress: progressAPI,
  quiz: quizAPI,
  payment: paymentAPI,
};

