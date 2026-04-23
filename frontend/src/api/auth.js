// ============================================================
// FILE: frontend/src/api/auth.js
// CHỨC NĂNG: Các hàm gọi API liên quan đến Authentication
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================
import api from './axiosInstance'

// Đăng ký tài khoản mới
export const registerAPI = (data) =>
  api.post('/api/auth/register', data)
  // data = { username, email, password }

// Đăng nhập
export const loginAPI = (data) =>
  api.post('/api/auth/login', data)
  // data = { email, password }
  // Trả về: { token, user: { id, username, email } }

// Lấy thông tin user đang đăng nhập (dùng token)
export const getMeAPI = () =>
  api.get('/api/auth/me')
