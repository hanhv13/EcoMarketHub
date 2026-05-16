import api from './axiosInstance'

export const getReviewsBySellerAPI = (sellerId) => api.get(`/api/reviews/${sellerId}`)
export const createReviewAPI = (data) => api.post('/api/reviews', data)
