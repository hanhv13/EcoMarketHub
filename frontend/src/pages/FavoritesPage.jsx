// ============================================================
// FILE: frontend/src/pages/FavoritesPage.jsx
// CHỨC NĂNG: Trang danh sách sản phẩm đã yêu thích
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getFavoritesAPI, removeFavoriteAPI } from '../api/products'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    setLoading(true)
    try {
      const res = await getFavoritesAPI()
      setFavorites(res.data)
    } catch {
      setError('Failed to load favorites.')
    } finally {
      setLoading(false)
    }
  }

  // Xoá khỏi yêu thích và cập nhật UI ngay lập tức
  const handleRemove = async (productId) => {
    try {
      await removeFavoriteAPI(productId)
      // Lọc bỏ sản phẩm vừa xoá khỏi state (không cần gọi lại API)
      setFavorites(prev => prev.filter(f => f.id !== productId))
    } catch {
      alert('An error occurred, please try again.')
    }
  }

  const formatPrice = (p) => Number(p).toLocaleString('en-US') + ' VND'

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">❤️ My Favorites</h1>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>{favorites.length} products</span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🤍</div>
          <p>You haven't favorited any products yet.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Explore Products
          </Link>
        </div>
      ) : (
        <div style={styles.list}>
          {favorites.map(item => (
            <div key={item.id} style={styles.item}>
              {/* Ảnh — click vào chuyển đến trang chi tiết */}
              <Link to={`/products/${item.id}`}>
                <img
                  src={item.image_url || 'https://placehold.co/100x80?text=No+Img'}
                  alt={item.title}
                  style={styles.thumb}
                  onError={e => { e.target.src = 'https://placehold.co/100x80?text=No+Img' }}
                />
              </Link>

              {/* Thông tin sản phẩm */}
              <div style={styles.info}>
                <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <p style={styles.title}>{item.title}</p>
                </Link>
                <div style={styles.meta}>
                  <span style={{ color: '#16a34a', fontWeight: '700' }}>{formatPrice(item.price)}</span>
                  <span style={styles.tag}>{item.category_name}</span>
                  <span style={styles.tag}>{item.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                  <span style={styles.tag}>👤 {item.seller_name}</span>
                  {/* Nếu tin đã đóng → cảnh báo */}
                  {item.status !== 'active' && (
                    <span style={{ ...styles.tag, background: '#fee2e2', color: '#991b1b' }}>
                      ⚠️ Closed
                    </span>
                  )}
                </div>
              </div>

              {/* Nút xoá yêu thích */}
              <button
                onClick={() => handleRemove(item.id)}
                style={styles.removeBtn}
                title="Remove from favorites"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' },
  thumb: { width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  info: { flex: 1 },
  title: { fontWeight: '600', fontSize: '15px', marginBottom: '8px' },
  meta: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  tag: { fontSize: '12px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '20px' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '8px', borderRadius: '8px', flexShrink: 0 },
}
