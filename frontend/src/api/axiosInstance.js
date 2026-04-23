// ============================================================
// FILE: frontend/src/api/axiosInstance.js
// CHỨC NĂNG: Tạo 1 instance Axios được cấu hình sẵn
//            - Base URL trỏ vào backend
//            - Tự động gắn token JWT vào mọi request
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================

import axios from 'axios'

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  // import.meta.env.VITE_API_URL đọc từ file .env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json', // Mọi request đều gửi JSON
  },
})

// Interceptor: chạy trước MỌI request, tự gắn token vào header
// Giống như nhân viên bảo vệ kiểm tra thẻ trước khi vào cửa
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('secondnest_token')
    if (token) {
      // Gắn token vào header Authorization
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config // Cho request đi tiếp
  },
  (error) => Promise.reject(error)
)

// Interceptor: chạy sau khi nhận response
// Nếu server trả về 401 (hết hạn token) → tự động đăng xuất
api.interceptors.response.use(
  (response) => response, // Response OK → trả về bình thường
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → xoá và chuyển về trang login
      localStorage.removeItem('secondnest_token')
      localStorage.removeItem('secondnest_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
