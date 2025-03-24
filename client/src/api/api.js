import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const getUsers = () => api.get('/users');
export const createUser = (data) => api.post('/users', data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const createOrder = (data) => api.post('/orders', data);
export const getOrdersByUser = (userId) => api.get(`/orders/${userId}`);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);