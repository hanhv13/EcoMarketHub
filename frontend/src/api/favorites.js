import api from './axiosInstance'

// Lấy danh sách sản phẩm yêu thích của user hiện tại
export const getFavorites = () => api.get('/favorites')

// Kiểm tra 1 sản phẩm có đang được yêu thích không
// Trả về { isFavorited: true/false }
export const checkFavorite = (productId) => api.get(`/favorites/check/${productId}`)

// Thêm sản phẩm vào yêu thích
export const addFavorite = (productId) => api.post(`/favorites/${productId}`)

// Xoá sản phẩm khỏi yêu thích
export const removeFavorite = (productId) => api.delete(`/favorites/${productId}`)
