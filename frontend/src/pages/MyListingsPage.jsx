// ============================================================
// FILE: frontend/src/pages/MyListingsPage.jsx
// CHỨC NĂNG: Trang "Tin của tôi" — xem, sửa, xoá tin đã đăng
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProductsByUserAPI, getCategoriesAPI, getFavoritesAPI, removeFavoriteAPI } from '../api/products'
import { useAuth } from '../context/AuthContext'

export default function MyListingsPage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [favorites,  setFavorites]  = useState([])
  const [loading,    setLoading]    = useState(true)
  const [favLoading, setFavLoading] = useState(false)
  const [error,      setError]      = useState('')
  const [favError,   setFavError]   = useState('')
  const [activeTab,  setActiveTab]  = useState('listings') // listings or favorites

  useEffect(() => {
    if (user) {
      fetchMyListings()
      fetchFavorites()
      getCategoriesAPI().then(res => setCategories(res.data))
    }
  }, [user])

  const fetchMyListings = async () => {
    setLoading(true)
    try {
      const res = await getProductsByUserAPI(user.id)
      setProducts(res.data)
    } catch {
      setError('Failed to load your listings.')
    } finally {
      setLoading(false)
    }
  }

  const fetchFavorites = async () => {
    setFavLoading(true)
    try {
      const res = await getFavoritesAPI()
      setFavorites(res.data)
    } catch {
      setFavError('Failed to load favorites.')
    } finally {
      setFavLoading(false)
    }
  }

  const handleRemoveFavorite = async (productId) => {
    try {
      await removeFavoriteAPI(productId)
      setFavorites(prev => prev.filter(f => f.id !== productId))
    } catch {
      alert('An error occurred, please try again.')
    }
  }

  const formatPrice = (p) => Number(p).toLocaleString('en-US') + ' VND'
  const formatDate  = (d) => new Date(d).toLocaleDateString('en-US')

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page">
      <div className="page-header" style={{ marginBottom: '16px' }}>
        <h1 className="page-title" style={{ color: 'var(--text-main)' }}>👤 My Profile</h1>
        <Link to="/post" className="btn btn-primary">+ Post New Ad</Link>
      </div>

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab('listings')} 
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'listings' ? styles.activeTabBtn : {})
          }}
        >
          📋 My Listings ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('favorites')} 
          style={{
            ...styles.tabBtn,
            ...(activeTab === 'favorites' ? styles.activeTabBtn : {})
          }}
        >
          ❤️ Saved Favorites ({favorites.length})
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {favError && <div className="alert alert-error">{favError}</div>}

      {activeTab === 'listings' ? (
        products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p style={{ color: 'var(--text-muted)' }}>You haven't posted any ads yet.</p>
            <Link to="/post" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Post your first ad
            </Link>
          </div>
        ) : (
          <div style={styles.list}>
            {products.map(product => (
              <div key={product.id} style={styles.item}>
                {/* Ảnh */}
                <img
                  src={product.image_url || 'https://placehold.co/100x80?text=No+Img'}
                  alt={product.title}
                  style={styles.thumb}
                  onError={e => { e.target.src = 'https://placehold.co/100x80?text=No+Img' }}
                />

                {/* Thông tin */}
                <div style={styles.itemInfo}>
                  <p style={styles.itemTitle}>{product.title}</p>
                  <div style={styles.itemMeta}>
                    <span style={{ color: 'var(--price-color)', fontWeight: '600' }}>{formatPrice(product.price)}</span>
                    <span style={styles.metaTag}>{product.category_name}</span>
                    <span style={{
                      ...styles.metaTag,
                      background: product.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: product.status === 'active' ? '#10b981' : '#ef4444',
                      borderColor: product.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    }}>
                      {product.status === 'active' ? '✅ Active' : '❌ Hidden'}
                    </span>
                    <span style={styles.metaTag}>{formatDate(product.created_at)}</span>
                  </div>
                </div>

                {/* Nút hành động */}
                <div style={styles.itemActions}>
                  <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ fontSize: '13px', padding: '6px 12px' }}>
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        favLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}><div className="spinner"></div></div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🤍</div>
            <p style={{ color: 'var(--text-muted)' }}>You haven't favorited any products yet.</p>
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
                <div style={styles.itemInfo}>
                  <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <p style={styles.itemTitle}>{item.title}</p>
                  </Link>
                  <div style={styles.itemMeta}>
                    <span style={{ color: 'var(--price-color)', fontWeight: '700' }}>{formatPrice(item.price)}</span>
                    <span style={styles.metaTag}>{item.category_name}</span>
                    <span style={styles.metaTag}>{item.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                    <span style={styles.metaTag}>👤 {item.seller_name}</span>
                    {/* Nếu tin đã đóng → cảnh báo */}
                    {item.status !== 'active' && (
                      <span style={{ ...styles.metaTag, background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        ⚠️ Closed
                      </span>
                    )}
                  </div>
                </div>

                {/* Nút xoá yêu thích */}
                <div style={styles.itemActions}>
                  <button
                    onClick={() => handleRemoveFavorite(item.id)}
                    style={styles.removeBtn}
                    title="Remove from favorites"
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { background: 'var(--card-bg)', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid var(--border-color)' },
  thumb: { width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemTitle: { fontWeight: '600', fontSize: '15px', marginBottom: '8px', color: 'var(--text-main)' },
  itemMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  metaTag: { fontSize: '12px', background: 'var(--cat-bg)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--border-color)' },
  itemActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  tabContainer: {
    display: 'flex',
    gap: '16px',
    borderBottom: '2px solid var(--border-color)',
    marginBottom: '24px',
    paddingBottom: '2px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 16px',
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s',
  },
  activeTabBtn: {
    color: 'var(--brand-green)',
    borderBottomColor: 'var(--brand-green)',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, background 0.2s',
  }
}
