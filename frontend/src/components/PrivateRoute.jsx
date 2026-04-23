// ============================================================
// FILE: frontend/src/components/PrivateRoute.jsx
// CHỨC NĂNG: Bảo vệ các trang cần đăng nhập
//            Nếu chưa đăng nhập → tự động chuyển sang /login
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================

import { Navigate } from 'react-router-dom'
import { useAuth }  from '../context/AuthContext'

// children: component con được bọc trong PrivateRoute
// Ví dụ: <PrivateRoute><PostProductPage /></PrivateRoute>
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Đang kiểm tra token từ localStorage → chờ, không render gì
  if (loading) {
    return <div className="loading">Đang kiểm tra đăng nhập...</div>
  }

  // Chưa đăng nhập → chuyển về trang login
  // replace: không lưu trang hiện tại vào history (tránh bấm Back về đây)
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Đã đăng nhập → render component con bình thường
  return children
}

export default PrivateRoute
