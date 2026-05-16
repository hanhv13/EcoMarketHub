// ============================================================
// FILE: frontend/src/pages/LoginPage.jsx
// CHỨC NĂNG: Trang đăng nhập — gửi email/password lên backend,
//            nhận token → lưu vào Context + localStorage
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  // State lưu giá trị các ô input
  const [form, setForm] = useState({ email: '', password: '' })
  // State hiển thị thông báo lỗi
  const [error, setError] = useState('')
  // State loading: true khi đang gọi API
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()    // Lấy hàm login từ Context
  const navigate  = useNavigate() // Để chuyển trang sau khi login

  // Hàm xử lý khi user gõ vào ô input
  // Dùng 1 hàm cho tất cả ô bằng cách dùng e.target.name
  const handleChange = (e) => {
    const { name, value } = e.target
    // Spread operator: giữ nguyên các field khác, chỉ cập nhật field đang thay đổi
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault() // Ngăn trình duyệt reload trang (hành vi mặc định của form)
    setError('')        // Xoá lỗi cũ
    setLoading(true)

    try {
      // Gọi API login
      const response = await loginAPI({ email: form.email, password: form.password })
      const { token, user } = response.data  // Lấy dữ liệu từ response

      login(user, token)  // Lưu vào Context + localStorage
      navigate('/')        // Chuyển về trang chủ
    } catch (err) {
      // err.response.data.message: thông báo lỗi từ backend
      setError(err.response?.data?.message || 'Login failed, please try again.')
    } finally {
      setLoading(false) // Dù thành công hay lỗi cũng tắt loading
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>♻️ Login to SecondNest</h1>

        {/* Hiện thông báo lỗi nếu có */}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"        // name phải khớp với key trong state form
              value={form.email}
              onChange={handleChange}
              placeholder="email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={loading}  // Không cho bấm khi đang gọi API
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/register" style={styles.link}>Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '40px', width: '100%', maxWidth: '420px' },
  title: { fontSize: '22px', fontWeight: '700', textAlign: 'center', marginBottom: '24px', color: '#111827' },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' },
  link: { color: '#16a34a', fontWeight: '600' },
}
