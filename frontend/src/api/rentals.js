import api from './axiosInstance';

// Create a new rental
export const createRentalAPI = (data) =>
    api.post('/api/rentals', data);

// Get rented dates for a product
export const getProductRentalsAPI = (productId) =>
    api.get(`/api/rentals/${productId}`);
