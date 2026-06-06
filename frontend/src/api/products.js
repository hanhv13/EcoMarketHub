import api from './axiosInstance'

// Lấy danh sách sản phẩm (có thể kèm filter)
// params VD: { search: 'laptop', category: 1, type: 'sell', page: 1 }
export const getProductsAPI = (params = {}) =>
  api.get('/api/products', { params })

// Lấy chi tiết 1 sản phẩm theo id
export const getProductByIdAPI = (id) =>
  api.get(`/api/products/${id}`)

// Tạo sản phẩm mới (cần đăng nhập)
export const createProductAPI = (data) =>
  api.post('/api/products', data)

// Cập nhật sản phẩm
export const updateProductAPI = (id, data) =>
  api.put(`/api/products/${id}`, data)

// Xoá sản phẩm
export const deleteProductAPI = (id) =>
  api.delete(`/api/products/${id}`)

// Lấy tin đăng của 1 user
export const getProductsByUserAPI = (userId) =>
  api.get(`/api/products/user/${userId}`)

// Lấy danh sách đồ đã mua
export const getPurchasedItemsAPI = () =>
  api.get('/api/products/purchases')

// Get all categories
export const getCategoriesAPI = () =>
  api.get('/api/categories')

// Get all categories with their active product count
export const getCategoriesWithCountAPI = () =>
  api.get('/api/products/categories-with-count')

// Upload ảnh sản phẩm
// imageFile: File object từ <input type="file">
export const uploadImageAPI = (imageFile) => {
  // FormData: định dạng đặc biệt để gửi file lên server
  const formData = new FormData()
  formData.append('image', imageFile) // 'image' phải khớp với tên field trong multer
  return api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' } // Ghi đè Content-Type cho upload
  })
}

// ============================================================
// FILE: frontend/src/api/favorites.js
// ============================================================

// Lấy danh sách yêu thích của user hiện tại
export const getFavoritesAPI = () =>
  api.get('/api/favorites')

// Kiểm tra 1 sản phẩm có được yêu thích không
export const checkFavoriteAPI = (productId) =>
  api.get(`/api/favorites/check/${productId}`)

// Thêm vào yêu thích
export const addFavoriteAPI = (productId) =>
  api.post(`/api/favorites/${productId}`)

// Xoá khỏi yêu thích
export const removeFavoriteAPI = (productId) =>
  api.delete(`/api/favorites/${productId}`)
