// ============================================================
// FILE: frontend/src/pages/CartPage.jsx
// CHỨC NĂNG: Trang giỏ hàng & thanh toán (Khung giao diện sơ bộ)
// ============================================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function CartPage() {
  const navigate = useNavigate()
  const { cartItems, updateQuantity, removeFromCart, checkoutItems } = useCart()
  const { user } = useAuth()

  // Trạng thái lưu trữ danh sách ID các sản phẩm ĐƯỢC CHỌN (mặc định rỗng - không chọn gì)
  const [selectedItemIds, setSelectedItemIds] = useState([])

  // Trạng thái form thanh toán
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  })

  // Chỉ tính tổng tiền cho những món được chọn
  const totalAmount = cartItems
    .filter(item => selectedItemIds.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Chọn/Bỏ chọn 1 sản phẩm
  const toggleSelectItem = (id) => {
    setSelectedItemIds(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) // Đã có -> xoá đi (bỏ chọn)
        : [...prev, id] // Chưa có -> thêm vào (chọn)
    )
  }

  // Chọn/Bỏ chọn tất cả
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItemIds(cartItems.map(item => item.id))
    } else {
      setSelectedItemIds([])
    }
  }

  // Xử lý khi nhấn thanh toán
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedItemIds.length === 0) {
      alert('Please select at least 1 product to checkout.')
      return
    }

    if (!form.fullName || !form.phone || !form.address) {
      alert('Please fill in all required shipping information.')
      return
    }

    const selectedItems = cartItems.filter(item => selectedItemIds.includes(item.id))
    const checkoutPayload = {
      items: selectedItems.map(item => ({ id: item.id, quantity: item.quantity }))
    }

    try {
      const res = await api.post('/api/products/checkout', checkoutPayload)

      const earnedPoints = res.data.earnedPoints || 0
      if (earnedPoints > 0) {
        alert(`Successfully checked out ${selectedItemIds.length} orders!\nThank you ${form.fullName}.\nYou earned ${earnedPoints} Green Points for buying upcycled products!`)
      } else {
        alert(`Successfully checked out ${selectedItemIds.length} orders!\nThank you ${form.fullName}.\nWe will deliver to: ${form.address}`)
      }

      checkoutItems(selectedItemIds)
      setSelectedItemIds([])
      navigate('/') 
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Checkout failed. Please try again.')
    }
  }

  // Responsive đơn giản
  const isMobile = window.innerWidth < 768;

  return (
    <div className="container page">
      <h1 style={styles.pageTitle}>🛒 Your Cart</h1>
      
      <div style={{ ...styles.grid, gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr' }}>
        {/* Cột trái: Danh sách sản phẩm */}
        <div style={styles.cartSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Selected Products</h2>
            {cartItems.length > 0 && (
              <label style={styles.selectAllLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedItemIds.length === cartItems.length && cartItems.length > 0}
                  onChange={handleSelectAll}
                  style={styles.checkbox}
                />
                Select All
              </label>
            )}
          </div>
          
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div style={styles.itemList}>
              {cartItems.map(item => (
                <label key={item.id} style={styles.cartItem}>
                  <input 
                    type="checkbox" 
                    checked={selectedItemIds.includes(item.id)}
                    onChange={() => toggleSelectItem(item.id)}
                    style={styles.itemCheckbox}
                  />
                  <img src={item.image_url || (item.images && item.images.length > 0 ? (typeof item.images === 'string' ? JSON.parse(item.images)[0] : item.images[0]) : 'https://placehold.co/80x80?text=No+Image')} alt={item.title} style={styles.itemImage} />
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemTitle}>
                      {item.title} {item.is_upcycled ? '♻️' : ''}
                    </h3>
                    <p style={styles.itemPrice}>{Number(item.price).toLocaleString('en-US')} VND</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={(e) => { e.preventDefault(); updateQuantity(item.id, item.quantity - 1) }} style={styles.qtyBtn}>-</button>
                    <span style={styles.itemQuantity}>{item.quantity}</span>
                    <button onClick={(e) => { e.preventDefault(); updateQuantity(item.id, item.quantity + 1) }} style={styles.qtyBtn}>+</button>
                    <button onClick={(e) => { e.preventDefault(); removeFromCart(item.id) }} style={styles.removeBtn}>🗑️</button>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div style={styles.totalBox}>
            <span style={styles.totalLabel}>
              Total ({selectedItemIds.length} items):
            </span>
            <span style={styles.totalValue}>{totalAmount.toLocaleString('en-US')} VND</span>
          </div>
        </div>

        {/* Cột phải: Form thông tin thanh toán */}
        <div style={styles.checkoutSection}>
          <h2 style={styles.sectionTitle}>Shipping Information</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                className="form-control" 
                type="text" 
                name="fullName"
                value={form.fullName} 
                onChange={handleChange}
                placeholder="Ex: John Doe" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input 
                className="form-control" 
                type="tel" 
                name="phone"
                value={form.phone} 
                onChange={handleChange}
                placeholder="Ex: 0912345678" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Shipping Address *</label>
              <textarea 
                className="form-control" 
                name="address"
                value={form.address} 
                onChange={handleChange}
                placeholder="House Number, Street, Ward, District, City"
                rows={3} 
                style={{ resize: 'vertical' }}
                required 
              />
            </div>

            <div className="form-group">
              <label>Additional Notes</label>
              <textarea 
                className="form-control" 
                name="note"
                value={form.note} 
                onChange={handleChange}
                placeholder="Notes about delivery time..."
                rows={2} 
                style={{ resize: 'vertical' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '16px', padding: '12px', opacity: selectedItemIds.length === 0 ? 0.7 : 1 }}
            >
              💳 Proceed to Checkout
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', marginBottom: '24px' },
  grid: { 
    display: 'grid', 
    gap: '24px',
  },
  cartSection: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  checkoutSection: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', height: 'fit-content' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', margin: 0 },
  selectAllLabel: { display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#4b5563' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
  itemList: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' },
  cartItem: { display: 'flex', gap: '16px', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
  itemCheckbox: { width: '18px', height: '18px', cursor: 'pointer' },
  itemImage: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' },
  itemPrice: { fontSize: '15px', color: '#dc2626', fontWeight: '600', margin: 0 },
  itemQuantity: { fontSize: '14px', color: '#6b7280' },
  totalBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #e5e7eb' },
  totalLabel: { fontSize: '16px', fontWeight: '600', color: '#374151' },
  totalValue: { fontSize: '22px', fontWeight: '700', color: '#dc2626' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  qtyBtn: { width: '28px', height: '28px', borderRadius: '4px', border: '1px solid #d1d5db', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: '#374151' },
  removeBtn: { marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ef4444' }
}
