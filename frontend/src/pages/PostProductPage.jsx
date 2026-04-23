// ============================================================
// FILE: frontend/src/pages/PostProductPage.jsx
// CHỨC NĂNG: Trang đăng tin mới — nhập thông tin + upload ảnh
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProductAPI, getCategoriesAPI, uploadImageAPI } from '../api/products'

export default function PostProductPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  // File ảnh user chọn
  const [imageFile,  setImageFile]  = useState(null)
  // Preview ảnh trước khi upload
  const [imagePreview, setImagePreview] = useState('')

  const [form, setForm] = useState({
    title:       '',
    description: '',
    price:       '',
    category_id: '',
    type:        'sell',
  })

  // Lấy danh mục khi component mount
  useEffect(() => {
    getCategoriesAPI().then(res => setCategories(res.data))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Xử lý khi user chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0] // Lấy file đầu tiên
    if (!file) return

    setImageFile(file)

    // Tạo URL preview để hiển thị ảnh trước khi upload
    // URL.createObjectURL: tạo URL tạm thời từ file trong bộ nhớ trình duyệt
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.price || !form.category_id) {
      return setError('Vui lòng điền đầy đủ tên sản phẩm, giá và danh mục.')
    }

    setLoading(true)
    try {
      let imageUrl = ''

      // Nếu có chọn ảnh → upload lên server trước
      if (imageFile) {
        const uploadRes = await uploadImageAPI(imageFile)
        imageUrl = uploadRes.data.imageUrl // Lấy URL trả về từ server
      }

      // Gọi API tạo sản phẩm với URL ảnh vừa upload
      const res = await createProductAPI({ ...form, image_url: imageUrl })

      // Chuyển đến trang chi tiết sản phẩm vừa tạo
      navigate(`/products/${res.data.product.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng tin thất bại, thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container page">
      <div style={styles.card}>
        <h1 style={styles.title}>📝 Đăng tin mới</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* ---- Ảnh sản phẩm ---- */}
          <div className="form-group">
            <label>Ảnh sản phẩm</label>
            <div style={styles.imageUploadArea}>
              {imagePreview ? (
                // Hiển thị preview ảnh đã chọn
                <img src={imagePreview} alt="Preview" style={styles.preview} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  📷 <br /> Click để chọn ảnh
                </div>
              )}
              {/* Input file ẩn đi, click vào div ở trên để mở */}
              <input
                type="file"
                accept="image/*"     // Chỉ chấp nhận file ảnh
                onChange={handleImageChange}
                style={styles.fileInput}
              />
            </div>
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Chấp nhận: JPG, PNG, WEBP. Tối đa 5MB.
            </small>
          </div>

          {/* ---- Tên sản phẩm ---- */}
          <div className="form-group">
            <label>Tên sản phẩm *</label>
            <input className="form-control" type="text" name="title"
              value={form.title} onChange={handleChange}
              placeholder="VD: Laptop Dell XPS 13 2020" required />
          </div>

          {/* ---- Loại tin và danh mục (2 cột) ---- */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label>Loại tin *</label>
              <select className="form-control" name="type" value={form.type} onChange={handleChange}>
                <option value="sell">Bán</option>
                <option value="rent">Cho thuê</option>
              </select>
            </div>
            <div className="form-group">
              <label>Danh mục *</label>
              <select className="form-control" name="category_id" value={form.category_id}
                onChange={handleChange} required>
                <option value="">-- Chọn danh mục --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ---- Giá ---- */}
          <div className="form-group">
            <label>Giá (VNĐ) *</label>
            <input className="form-control" type="number" name="price"
              value={form.price} onChange={handleChange}
              placeholder="VD: 5000000" min="0" required />
          </div>

          {/* ---- Mô tả ---- */}
          <div className="form-group">
            <label>Mô tả chi tiết</label>
            <textarea className="form-control" name="description"
              value={form.description} onChange={handleChange}
              placeholder="Mô tả tình trạng, lý do bán, thông tin thêm..."
              rows={5} style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-gray"
              style={{ flex: 1 }} onClick={() => navigate(-1)}>
              Huỷ
            </button>
            <button type="submit" className="btn btn-primary"
              style={{ flex: 2 }} disabled={loading}>
              {loading ? 'Đang đăng tin...' : '🚀 Đăng tin ngay'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '32px', maxWidth: '680px', margin: '0 auto' },
  title: { fontSize: '22px', fontWeight: '700', marginBottom: '24px' },
  imageUploadArea: { position: 'relative', border: '2px dashed #d1d5db', borderRadius: '8px', overflow: 'hidden', height: '200px', cursor: 'pointer', background: '#f9fafb', marginBottom: '8px' },
  uploadPlaceholder: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '16px', textAlign: 'center', flexDirection: 'column', gap: '8px' },
  preview: { width: '100%', height: '100%', objectFit: 'cover' },
  fileInput: { position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' },
}
