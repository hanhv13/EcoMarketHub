// ============================================================
// FILE: frontend/src/pages/CartPage.jsx
// CHỨC NĂNG: Trang giỏ hàng & thanh toán
// ============================================================

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addToCart, clearCart, consumeCartFocus, getCartItems, removeCartItem, updateCartItemQuantity } from '../utils/cartStorage'

export default function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])

  // Trạng thái lưu trữ danh sách ID các sản phẩm ĐƯỢC CHỌN (mặc định rỗng - không chọn gì)
  const [selectedItemIds, setSelectedItemIds] = useState([])

  // Trạng thái form thanh toán
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    note: ''
  })

  useEffect(() => {
    const nextCartItems = getCartItems()
    setCartItems(nextCartItems)

    const focusedItemId = consumeCartFocus()
    if (focusedItemId && nextCartItems.some(item => item.id === focusedItemId)) {
      setSelectedItemIds([focusedItemId])
    }
  }, [])

  // Chỉ tính tổng tiền cho những món được chọn
  const totalAmount = cartItems
    .filter(item => selectedItemIds.includes(item.id))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const selectedCount = selectedItemIds.length

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

  const syncCart = (nextItems) => {
    setCartItems(nextItems)
    setSelectedItemIds(prev => prev.filter(itemId => nextItems.some(item => item.id === itemId)))
  }

  const handleQuantityChange = (id, delta) => {
    const item = cartItems.find(cartItem => cartItem.id === id)
    if (!item) return

    const nextQuantity = item.quantity + delta
    const nextItems = updateCartItemQuantity(id, nextQuantity)
    syncCart(nextItems)
  }

  const handleRemoveItem = (id) => {
    const nextItems = removeCartItem(id)
    syncCart(nextItems)
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
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Kiểm tra xem đã chọn sản phẩm nào chưa
    if (selectedItemIds.length === 0) {
      alert('Please select at least 1 product to checkout.')
      return
    }

    // Validate form cơ bản
    if (!form.fullName || !form.phone || !form.address) {
      alert('Please fill in all required shipping information.')
      return
    }

    alert(`Successfully checked out ${selectedItemIds.length} orders!\nThank you ${form.fullName}.\nWe will deliver to: ${form.address}`)
    const remainingItems = cartItems.filter(item => !selectedItemIds.includes(item.id))
    clearCart()
    remainingItems.forEach(item => {
      addToCart(item, item.quantity)
    })
    setCartItems(remainingItems)
    setSelectedItemIds([])
    setForm({ fullName: '', phone: '', address: '', note: '' })
    navigate('/') // Chuyển về trang chủ sau khi thanh toán xong
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
                  <img src={item.image_url} alt={item.title} style={styles.itemImage} />
                  <div style={styles.itemInfo}>
                    <h3 style={styles.itemTitle}>{item.title}</h3>
                    <p style={styles.itemPrice}>{item.price.toLocaleString('en-US')} VND</p>
                    <p style={styles.itemMeta}>{item.type === 'rent' ? 'Rental item' : 'Marketplace item'}</p>
                  </div>
                  <div style={styles.itemActions}>
                    <div style={styles.quantityStepper}>
                      <button type="button" style={styles.qtyButton} onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                      <span style={styles.itemQuantity}>Qty {item.quantity}</span>
                      <button type="button" style={styles.qtyButton} onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                    </div>
                    <button type="button" style={styles.removeButton} onClick={() => handleRemoveItem(item.id)}>
                      Remove
                    </button>
                  </div>
                </label>
              ))}
            </div>
          )}

          <div style={styles.totalBox}>
            <span style={styles.totalLabel}>
              Total ({selectedCount} items):
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
  itemMeta: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  itemActions: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  quantityStepper: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyButton: { width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer', fontWeight: '700' },
  itemQuantity: { fontSize: '14px', color: '#6b7280', minWidth: '56px', textAlign: 'center' },
  removeButton: { background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px', fontWeight: '600' },
  totalBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '2px solid #e5e7eb' },
  totalLabel: { fontSize: '16px', fontWeight: '600', color: '#374151' },
  totalValue: { fontSize: '22px', fontWeight: '700', color: '#dc2626' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' }
}
