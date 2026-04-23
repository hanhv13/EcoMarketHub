// ============================================================
// FILE: frontend/src/App.jsx
// CHỨC NĂNG: Khai báo toàn bộ routes (đường dẫn trang) của app
//            Bọc toàn bộ app trong AuthProvider để chia sẻ state đăng nhập
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Import tất cả các trang
import Navbar           from './components/Navbar'
import ProductListPage  from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import PostProductPage  from './pages/PostProductPage'
import MyListingsPage   from './pages/MyListingsPage'
import FavoritesPage    from './pages/FavoritesPage'

// ============================================================
// PrivateRoute: bảo vệ các trang cần đăng nhập
// Nếu chưa đăng nhập → chuyển sang trang /login
// ============================================================
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Đang kiểm tra token → chờ, chưa render gì
  if (loading) return <div className="loading"><div className="spinner"></div></div>

  // Chưa đăng nhập → redirect về login
  if (!user) return <Navigate to="/login" replace />

  // Đã đăng nhập → render trang bình thường
  return children
}

// ============================================================
// Component chính — định nghĩa cấu trúc app
// ============================================================
function AppContent() {
  return (
    // BrowserRouter: kích hoạt React Router, quản lý URL trong trình duyệt
    <BrowserRouter>
      {/* Navbar hiển thị ở mọi trang */}
      <Navbar />

      {/* Routes: chỉ render route nào khớp với URL hiện tại */}
      <Routes>
        {/* Trang công khai (ai cũng vào được) */}
        <Route path="/"          element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />

        {/* Trang riêng tư (cần đăng nhập) */}
        <Route path="/post"      element={<PrivateRoute><PostProductPage /></PrivateRoute>} />
        <Route path="/my-listings" element={<PrivateRoute><MyListingsPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />

        {/* Nếu URL không khớp bất kỳ route nào → về trang chủ */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Export App bọc trong AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
