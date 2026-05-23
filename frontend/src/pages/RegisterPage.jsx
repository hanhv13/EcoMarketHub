// ============================================================
// FILE: frontend/src/pages/RegisterPage.jsx
// CHỨC NĂNG: Trang đăng ký tài khoản mới
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerAPI } from '../api/auth'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Kiểm tra mật khẩu xác nhận
    if (form.password !== form.confirm) {
      return setError('Passwords do not match.')
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      await registerAPI({
        username: form.username,
        email:    form.email,
        password: form.password,
      })

      setSuccess('Registration successful! Redirecting to login...')
      // Đợi 1.5s rồi chuyển trang để user đọc thông báo
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>♻️ Sign Up for EcoMarketHub</h1>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input className="form-control" type="text" name="username"
              value={form.username} onChange={handleChange}
              placeholder="Ex: john_doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-control" type="email" name="email"
              value={form.email} onChange={handleChange}
              placeholder="email@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-control" type="password" name="password"
              value={form.password} onChange={handleChange}
              placeholder="At least 6 characters" required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input className="form-control" type="password" name="confirm"
              value={form.confirm} onChange={handleChange}
              placeholder="Confirm your password" required />
          </div>

          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
