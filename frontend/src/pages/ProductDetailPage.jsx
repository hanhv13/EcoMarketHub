// ============================================================
// FILE: frontend/src/pages/ProductDetailPage.jsx
// CHỨC NĂNG: Hiển thị chi tiết 1 sản phẩm + nút yêu thích
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProductByIdAPI } from '../api/products'
import { checkFavoriteAPI, addFavoriteAPI, removeFavoriteAPI } from '../api/products'
import { useAuth } from '../context/AuthContext'

export default function ProductDetailPage() {
  const { id }    = useParams()    // Lấy id từ URL: /products/5 → id = '5'
  const navigate  = useNavigate()
  const { user }  = useAuth()

  const [product,     setProduct]     = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [favLoading,  setFavLoading]  = useState(false)
  const [error,       setError]       = useState('')

  // Tải thông tin sản phẩm khi component mount hoặc id thay đổi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await getProductByIdAPI(id)
        setProduct(res.data)

        // Nếu đã đăng nhập → kiểm tra đã yêu thích chưa
        if (user) {
          const favRes = await checkFavoriteAPI(id)
          setIsFavorited(favRes.data.isFavorited)
        }
      } catch {
        setError('Không tìm thấy sản phẩm.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  // Xử lý toggle yêu thích
  const handleFavorite = async () => {
    if (!user) {
      // Chưa đăng nhập → chuyển sang trang login
      navigate('/login')
      return
    }
    setFavLoading(true)
    try {
      if (isFavorited) {
        await removeFavoriteAPI(id)
        setIsFavorited(false)
      } else {
        await addFavoriteAPI(id)
        setIsFavorited(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra.')
    } finally {
      setFavLoading(false)
    }
  }

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + ' đ'
  const formatDate  = (d) => new Date(d).toLocaleDateString('vi-VN')

  if (loading) return <div className="loading"><div className="spinner"></div></div>
  if (error)   return <div className="container page"><div className="alert alert-error">{error}</div></div>
  if (!product) return null

  return (
    <div className="container page">
      {/* Breadcrumb điều hướng */}
      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#6b7280' }}>
        <Link to="/" style={{ color: '#16a34a' }}>Trang chủ</Link>
        {' '} › {product.category_name} › {product.title}
      </p>

      <div style={styles.layout}>
        {/* ---- Cột trái: Ảnh ---- */}
        <div style={styles.imageCol}>
          <img
            src={product.image_url || 'https://placehold.co/600x450?text=No+Image'}
            alt={product.title}
            style={styles.image}
            onError={e => { e.target.src = 'https://placehold.co/600x450?text=No+Image' }}
          />
        </div>

        {/* ---- Cột phải: Thông tin ---- */}
        <div style={styles.infoCol}>
          {/* Badge loại */}
          <span style={{
            ...styles.badge,
            background: product.type === 'rent' ? '#7c3aed' : '#16a34a'
          }}>
            {product.type === 'rent' ? '🏠 Cho thuê' : '🛒 Bán'}
          </span>

          <h1 style={styles.title}>{product.title}</h1>

          <p style={styles.price}>{formatPrice(product.price)}</p>

          <div style={styles.meta}>
            <div style={styles.metaRow}>
              <span style={styles.label}>Danh mục:</span>
              <span>{product.category_name}</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.label}>Ngày đăng:</span>
              <span>{formatDate(product.created_at)}</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.label}>Người bán:</span>
              <span>👤 {product.seller_name}</span>
            </div>
            <div style={styles.metaRow}>
              <span style={styles.label}>Liên hệ:</span>
              <span>📧 {product.seller_email}</span>
            </div>
          </div>

          {/* Mô tả */}
          <div style={styles.descBox}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Mô tả sản phẩm:</p>
            <p style={{ color: '#374151', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
              {product.description || 'Không có mô tả.'}
            </p>
          </div>

          {/* Nút hành động */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={handleFavorite}
              disabled={favLoading}
              style={{
                ...styles.btnFav,
                background: isFavorited ? '#fee2e2' : '#f3f4f6',
                color:      isFavorited ? '#dc2626' : '#374151',
                border:     isFavorited ? '1px solid #fca5a5' : '1px solid #e5e7eb',
              }}
            >
              {isFavorited ? '❤️ Đã yêu thích' : '🤍 Yêu thích'}
            </button>

            <a
              href={`mailto:${product.seller_email}`}
              className="btn btn-primary"
              style={{ flex: 1, textAlign: 'center', padding: '12px' }}
            >
              📧 Liên hệ người bán
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  layout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' },
  imageCol: { borderRadius: '10px', overflow: 'hidden', background: '#f3f4f6' },
  image: { width: '100%', height: '400px', objectFit: 'cover', display: 'block' },
  infoCol: { display: 'flex', flexDirection: 'column' },
  badge: { display: 'inline-block', color: '#fff', fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '20px', width: 'fit-content', marginBottom: '12px' },
  title: { fontSize: '22px', fontWeight: '700', marginBottom: '12px', lineHeight: '1.4' },
  price: { fontSize: '28px', fontWeight: '700', color: '#16a34a', marginBottom: '20px' },
  meta: { background: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '16px' },
  metaRow: { display: 'flex', gap: '12px', marginBottom: '8px', fontSize: '14px' },
  label: { color: '#6b7280', minWidth: '90px' },
  descBox: { background: '#f9fafb', borderRadius: '8px', padding: '16px' },
  btnFav: { padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' },
}
