// ============================================================
// FILE: frontend/src/pages/EditProductPage.jsx
// CHỨC NĂNG: Trang sửa tin đã đăng
// ============================================================

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductByIdAPI, updateProductAPI, getCategoriesAPI, uploadImageAPI } from '../api/products'
import { useAuth } from '../context/AuthContext'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(false)
  const [fetching,   setFetching]   = useState(true)
  const [error,      setError]      = useState('')
  
  // File ảnh user chọn (chỉ có nếu user đổi ảnh)
  const [imageFile,  setImageFile]  = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const [form, setForm] = useState({
    title:       '',
    description: '',
    price:       '',
    category_id: '',
    type:        'sell',
    status:      'active',
    is_upcycled: false,
    stock_quantity: 1
  })

  useEffect(() => {
    // Load categories first
    getCategoriesAPI().then(res => setCategories(res.data)).catch(console.error)

    // Load existing product
    getProductByIdAPI(id).then(res => {
      const p = res.data
      if (p.seller_id !== user.id) {
        setError('You do not have permission to edit this product.')
      } else {
        setForm({
          title: p.title,
          description: p.description || '',
          price: p.price,
          category_id: p.category_id || '',
          type: p.type,
          status: p.status,
          is_upcycled: p.is_upcycled,
          stock_quantity: p.stock_quantity
        })
        setImagePreview(p.image_url)
      }
      setFetching(false)
    }).catch(err => {
      console.error(err)
      setError('Product not found.')
      setFetching(false)
    })
  }, [id, user.id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => {
      const newForm = { 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }
      if (name === 'is_upcycled' && !checked) {
        newForm.stock_quantity = 1
      }
      return newForm
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.price || !form.category_id) {
      return setError('Please provide title, price, and category.')
    }

    setLoading(true)
    try {
      let dataToUpdate = { ...form }

      if (imageFile) {
        const uploadRes = await uploadImageAPI(imageFile)
        dataToUpdate.image_url = uploadRes.data.imageUrl
      }

      await updateProductAPI(id, dataToUpdate)
      navigate('/my-listings')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ad, please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page">
      <div style={styles.card}>
        <h1 style={styles.title}>✏️ Edit Ad</h1>

        {error && <div className="alert alert-error">{error}</div>}

        {!error && (
          <form onSubmit={handleSubmit}>
            {/* ---- Ảnh sản phẩm ---- */}
            <div className="form-group">
              <label>Product Image</label>
              <div style={styles.imageUploadArea}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" style={styles.preview} />
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    📷 <br /> Click to select image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={styles.fileInput}
                />
              </div>
              <small style={{ color: '#6b7280', fontSize: '12px' }}>
                Click to change image. Accepted: JPG, PNG, WEBP. Max 5MB.
              </small>
            </div>

            {/* ---- Tên sản phẩm ---- */}
            <div className="form-group">
              <label>Title *</label>
              <input className="form-control" type="text" name="title"
                value={form.title} onChange={handleChange}
                required />
            </div>

            {/* ---- Loại tin và trạng thái ---- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Type *</label>
                <select className="form-control" name="type" value={form.type} onChange={handleChange}>
                  <option value="sell">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select className="form-control" name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                  <option value="sold">Sold / Rented out</option>
                </select>
              </div>
            </div>

            {/* ---- Danh mục và Giá ---- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Category *</label>
                <select className="form-control" name="category_id" value={form.category_id}
                  onChange={handleChange} required>
                  <option value="">-- Select Category --</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price (VND) *</label>
                <input className="form-control" type="number" name="price"
                  value={form.price} onChange={handleChange}
                  min="0" required />
              </div>
            </div>

            {/* ---- Is Upcycled & Stock Quantity ---- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="is_upcycled" 
                  checked={form.is_upcycled} 
                  onChange={handleChange} 
                  style={{ width: '18px', height: '18px' }}
                />
                <span>This is an Upcycled/Recycled product</span>
              </label>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Stock Quantity * { !form.is_upcycled && <span style={{fontSize: '12px', color: '#dc2626'}}>(Used items are max 1)</span> }</label>
                <input 
                  className="form-control" 
                  type="number" 
                  name="stock_quantity"
                  value={form.stock_quantity} 
                  onChange={handleChange}
                  min="1" required 
                  disabled={!form.is_upcycled}
                  style={{ backgroundColor: !form.is_upcycled ? '#f3f4f6' : '#fff' }}
                />
              </div>
            </div>

            {/* ---- Mô tả ---- */}
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" name="description"
                value={form.description} onChange={handleChange}
                rows={5} style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" className="btn btn-gray"
                style={{ flex: 1 }} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary"
                style={{ flex: 2 }} disabled={loading}>
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </form>
        )}
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
