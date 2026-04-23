// ============================================================
// FILE: frontend/src/context/AuthContext.jsx
// CHỨC NĂNG: Lưu trạng thái đăng nhập toàn app
//            Bất kỳ component nào cũng có thể biết user đang đăng nhập là ai
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react'

// Tạo Context — giống như 1 "biến toàn cục" cho React
// Component nào dùng useContext(AuthContext) sẽ đọc được giá trị này
const AuthContext = createContext(null)

// AuthProvider: bao bọc toàn bộ app, cung cấp dữ liệu auth cho mọi component con
export function AuthProvider({ children }) {
  // State lưu thông tin user đang đăng nhập (null = chưa đăng nhập)
  const [user,  setUser]  = useState(null)
  // State loading: true khi đang kiểm tra token trong localStorage
  const [loading, setLoading] = useState(true)

  // useEffect chạy 1 lần khi app khởi động
  // Mục đích: nếu user đã đăng nhập trước đó, khôi phục lại trạng thái
  useEffect(() => {
    const savedUser  = localStorage.getItem('secondnest_user')
    const savedToken = localStorage.getItem('secondnest_token')

    if (savedUser && savedToken) {
      // JSON.parse: chuyển chuỗi JSON thành object
      setUser(JSON.parse(savedUser))
    }
    setLoading(false) // Xong rồi, không loading nữa
  }, []) // [] = chỉ chạy 1 lần sau khi component mount

  // Hàm đăng nhập: lưu user và token vào state + localStorage
  const login = (userData, token) => {
    setUser(userData)
    // localStorage: lưu dữ liệu trong trình duyệt, tắt máy vẫn còn
    localStorage.setItem('secondnest_user',  JSON.stringify(userData))
    localStorage.setItem('secondnest_token', token)
  }

  // Hàm đăng xuất: xoá user và token
  const logout = () => {
    setUser(null)
    localStorage.removeItem('secondnest_user')
    localStorage.removeItem('secondnest_token')
  }

  // Hàm lấy token để gắn vào Axios header
  const getToken = () => localStorage.getItem('secondnest_token')

  // Cung cấp các giá trị này cho toàn bộ app
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — cách tiện để dùng AuthContext trong bất kỳ component nào
// Thay vì viết: const { user } = useContext(AuthContext)
// Chỉ cần viết: const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
