// ============================================================
// FILE: frontend/src/pages/MyListingsPage.jsx
// CHỨC NĂNG: Trang "Tin của tôi" — xem, sửa, xoá tin đã đăng
// NGƯỜI PHỤ TRÁCH: M4
// ============================================================

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProductsByUserAPI, deleteProductAPI, updateProductAPI, getCategoriesAPI } from '../api/products'
import { useAuth } from '../context/AuthContext'

export default function MyListingsPage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()

  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')

  // State cho modal sửa tin
  const [editing,    setEditing]    = useState(null)   // Sản phẩm đang sửa (null = không sửa gì)
  const [editForm,   setEditForm]   = useState({})
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchMyListings()
      getCategoriesAPI().then(res => setCategories(res.data))
    }
  }, [user])

  const fetchMyListings = async () => {
    setLoading(true)
    try {
      const res = await getProductsByUserAPI(user.id)
      setProducts(res.data)
    } catch {
      setError('Không thể tải danh sách tin của bạn.')
    } finally {
      setLoading(false)
    }
  }

  // Mở modal sửa: điền sẵn thông tin sản phẩm vào form
  const openEdit = (product) => {
    setEditing(product)
    setEditForm({
      title:       product.title,
      description: product.description || '',
      price:       product.price,
      category_id: product.category_id,
      type:        product.type,
      status:      product.status,
    })
  }

  // Xử lý lưu khi sửa
  const handleEditSave = async () => {
    setEditLoading(true)
    try {
      await updateProductAPI(editing.id, editForm)
      setEditing(null)    // Đóng modal
      fetchMyListings()   // Tải lại danh sách
    } catch (err) {
      alert(err.response?.data?.message || 'Cập nhật thất bại.')
    } finally {
      setEditLoading(false)
    }
  }

  // Xoá sản phẩm (có confirm trước)
  const handleDelete = async (product) => {
    // window.confirm: hộp thoại xác nhận, trả về true/false
    const confirmed = window.confirm(`Bạn chắc chắn muốn xoá tin "${product.title}"?`)
    if (!confirmed) return

    try {
      await deleteProductAPI(product.id)
      // Xoá khỏi state local (không cần gọi lại API)
      setProducts(prev => prev.filter(p => p.id !== product.id))
    } catch (err) {
      alert(err.response?.data?.message || 'Xoá thất bại.')
    }
  }

  const formatPrice = (p) => Number(p).toLocaleString('vi-VN') + ' đ'
  const formatDate  = (d) => new Date(d).toLocaleDateString('vi-VN')

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page">
      <div className="page-header">
        <h1 className="page-title">📋 Tin của tôi</h1>
        <Link to="/post" className="btn btn-primary">+ Đăng tin mới</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="icon">📭</div>
          <p>Bạn chưa đăng tin nào.</p>
          <Link to="/post" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Đăng tin đầu tiên
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
                  <span style={{ color: '#16a34a', fontWeight: '600' }}>{formatPrice(product.price)}</span>
                  <span style={styles.metaTag}>{product.category_name}</span>
                  <span style={{
                    ...styles.metaTag,
                    background: product.status === 'active' ? '#dcfce7' : '#fee2e2',
                    color: product.status === 'active' ? '#166534' : '#991b1b',
                  }}>
                    {product.status === 'active' ? '✅ Đang hiển thị' : '❌ Đã ẩn'}
                  </span>
                  <span style={styles.metaTag}>{formatDate(product.created_at)}</span>
                </div>
              </div>

              {/* Nút hành động */}
              <div style={styles.itemActions}>
                <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ fontSize: '13px' }}>
                  Xem
                </Link>
                <button className="btn btn-gray" style={{ fontSize: '13px' }}
                  onClick={() => openEdit(product)}>
                  ✏️ Sửa
                </button>
                <button className="btn btn-danger" style={{ fontSize: '13px' }}
                  onClick={() => handleDelete(product)}>
                  🗑️ Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---- Modal sửa tin ---- */}
      {editing && (
        // Overlay tối phía sau modal
        <div style={styles.overlay} onClick={() => setEditing(null)}>
          {/* Ngăn click trong modal làm đóng overlay */}
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px', fontSize: '18px' }}>✏️ Sửa tin đăng</h2>

            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input className="form-control" value={editForm.title}
                onChange={e => setEditForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Giá (VNĐ)</label>
                <input className="form-control" type="number" value={editForm.price}
                  onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} />
              </div>
              <div className="form-group">
                <label>Danh mục</label>
                <select className="form-control" value={editForm.category_id}
                  onChange={e => setEditForm(p => ({ ...p, category_id: e.target.value }))}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label>Loại tin</label>
                <select className="form-control" value={editForm.type}
                  onChange={e => setEditForm(p => ({ ...p, type: e.target.value }))}>
                  <option value="sell">Bán</option>
                  <option value="rent">Cho thuê</option>
                </select>
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select className="form-control" value={editForm.status}
                  onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  <option value="active">Đang hiển thị</option>
                  <option value="hidden">Ẩn tin</option>
                  <option value="sold">Đã bán</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea className="form-control" rows={4} value={editForm.description}
                onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button className="btn btn-gray" onClick={() => setEditing(null)}>Huỷ</button>
              <button className="btn btn-primary" onClick={handleEditSave} disabled={editLoading}>
                {editLoading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  list: { display: 'flex', flexDirection: 'column', gap: '12px' },
  item: { background: '#fff', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' },
  thumb: { width: '100px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemTitle: { fontWeight: '600', fontSize: '15px', marginBottom: '8px' },
  itemMeta: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' },
  metaTag: { fontSize: '12px', background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '20px' },
  itemActions: { display: 'flex', gap: '8px', flexShrink: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '20px' },
  modal: { background: '#fff', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' },
}
