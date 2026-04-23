// ============================================================
// FILE: frontend/src/components/Navbar.jsx
// CHỨC NĂNG: Thanh điều hướng trên cùng của app
//            Hiển thị khác nhau tuỳ vào trạng thái đăng nhập
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()  // Lấy thông tin user và hàm logout từ Context
  const navigate = useNavigate()       // Dùng để chuyển trang bằng code

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    logout()           // Xoá user khỏi state và localStorage
    navigate('/')      // Chuyển về trang chủ
  }

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        {/* Logo / Tên app — click vào về trang chủ */}
        <Link to="/" style={styles.logo}>
          ♻️ SecondNest
        </Link>

        {/* Menu điều hướng */}
        <div style={styles.menu}>
          {user ? (
            /* Đã đăng nhập: hiển thị menu đầy đủ */
            <>
              <span style={styles.greeting}>Xin chào, {user.username}!</span>
              <Link to="/"            style={styles.link}>Trang chủ</Link>
              <Link to="/favorites"   style={styles.link}>❤️ Yêu thích</Link>
              <Link to="/my-listings" style={styles.link}>📋 Tin của tôi</Link>
              <Link to="/post"        style={{...styles.link, ...styles.btnPost}}>
                + Đăng tin
              </Link>
              <button onClick={handleLogout} style={styles.btnLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            /* Chưa đăng nhập: chỉ hiện login và register */
            <>
              <Link to="/"         style={styles.link}>Trang chủ</Link>
              <Link to="/login"    style={styles.link}>Đăng nhập</Link>
              <Link to="/register" style={{...styles.link, ...styles.btnPost}}>
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// CSS viết dưới dạng object JavaScript (inline styles)
const styles = {
  nav: {
    background: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',  // Luôn dính trên cùng khi cuộn
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#16a34a',
    textDecoration: 'none',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  link: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '14px',
    padding: '6px 8px',
    borderRadius: '6px',
    transition: 'background 0.2s',
  },
  btnPost: {
    background: '#16a34a',
    color: '#ffffff',
    padding: '8px 14px',
    borderRadius: '8px',
    fontWeight: '600',
  },
  btnLogout: {
    background: 'none',
    border: '1px solid #e5e7eb',
    padding: '7px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
  },
  greeting: {
    fontSize: '13px',
    color: '#6b7280',
  }
}
