import axios from './axios';

// Auth APIs
export const authAPI = {
  login: (credentials) => axios.post('/users/login/', credentials),
  register: (userData) => axios.post('/users/register/', userData),
  logout: () => axios.post('/users/logout/'),
  getCurrentUser: () => axios.get('/users/me/'),
  updateProfile: (data) => axios.patch('/users/me/', data),
  changePassword: (data) => axios.post('/users/change-password/', data),
};

// Catalog APIs
export const catalogAPI = {
  getBooks: (params) => axios.get('/catalog/books/', { params }),
  getBook: (id) => axios.get(`/catalog/books/${id}/`),
  getUnits: (bookId) => axios.get(`/catalog/books/${bookId}/units/`),
  getUnit: (bookId, unitId) => axios.get(`/catalog/books/${bookId}/units/${unitId}/`),
};

// Progress APIs
export const progressAPI = {
  getUserProgress: () => axios.get('/progress/'),
  getBookProgress: (bookId) => axios.get(`/progress/books/${bookId}/`),
  updateUnitProgress: (unitId, data) => axios.post(`/progress/units/${unitId}/`, data),
};

// Quiz APIs
export const quizAPI = {
  getQuestions: (unitId) => axios.get(`/quiz/units/${unitId}/questions/`),
  submitAnswers: (unitId, data) => axios.post(`/quiz/units/${unitId}/submit/`, data),
  getResults: (submissionId) => axios.get(`/quiz/results/${submissionId}/`),
  getUnitResults: (unitId) => axios.get(`/quiz/units/${unitId}/results/`),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (bookId, method) => axios.post('/payments/orders/', { 
    book_id: bookId, 
    payment_method: method 
  }),
  checkOrderStatus: (orderId) => axios.get(`/payments/orders/${orderId}/`),
  getPaymentHistory: () => axios.get('/payments/history/'),
  verifyPayment: (params) => axios.post('/payments/verify/', params),
};

export default {
  auth: authAPI,
  catalog: catalogAPI,
  progress: progressAPI,
  quiz: quizAPI,
  payment: paymentAPI,
};

