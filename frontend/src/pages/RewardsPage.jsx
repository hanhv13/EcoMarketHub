import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosInstance'

export default function RewardsPage() {
  const { user } = useAuth()
  const [points, setPoints] = useState(0)
  
  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [shippingInfo, setShippingInfo] = useState({ address: '', phone: '' })

  useEffect(() => {
    if (user) {
      api.get('/api/auth/me')
      .then(res => setPoints(res.data.green_points || 0))
      .catch(err => console.error(err))
    }
  }, [user])

  const sponsorProducts = [
    { id: 1, title: 'Bamboo Toothbrush Set', sponsor: 'EcoLife Co.', points: 10000, image: 'https://images.unsplash.com/photo-1600180766348-7356248c89c8?w=400&q=80' },
    { id: 2, title: 'Organic Cotton Tote', sponsor: 'ReNew Apparel', points: 15000, image: 'https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?w=400&q=80' },
    { id: 3, title: 'Stainless Steel Water Bottle', sponsor: 'GreenTech Innovations', points: 25000, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80' },
    { id: 4, title: 'Beeswax Food Wraps', sponsor: 'EarthFirst Organics', points: 12000, image: 'https://images.unsplash.com/photo-1610418579040-77a8288da6c3?w=400&q=80' }
  ]

  const handleRedeemClick = (product) => {
    if (points < product.points) {
      alert("You don't have enough Green Points to redeem this item.")
      return
    }
    setSelectedProduct(product)
    setShowModal(true)
  }

  const confirmRedeem = async () => {
    if (!shippingInfo.address || !shippingInfo.phone) {
      alert('Please provide your phone number and address.')
      return
    }

    try {
      const res = await api.post('/api/auth/points/deduct', { points: selectedProduct.points })
      setPoints(res.data.green_points)
      setShowModal(false)
      setShippingInfo({ address: '', phone: '' })
      alert(`Successfully redeemed ${selectedProduct.title}! We will ship it to ${shippingInfo.address}.`)
    } catch (err) {
      alert('Failed to redeem item. Please try again.')
    }
  }

  if (!user) {
    return (
      <div className="container page" style={{ textAlign: 'center', padding: '60px 0' }}>
        <h2>Please login to view your Green Points and Rewards.</h2>
      </div>
    )
  }

  return (
    <div className="container page">
      {/* Header section with Points Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>🎁 Sponsor Rewards Store</h2>
        <div style={{ backgroundColor: 'var(--brand-green)', color: 'white', padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <span style={{ fontSize: '14px', opacity: 0.9 }}>Green Points</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{points.toLocaleString('en-US')}</span>
        </div>
      </div>

      {/* How to Earn Points Section */}
      <div style={{ backgroundColor: '#fdfcf0', border: '1px solid #fef08a', padding: '24px', borderRadius: '12px', marginBottom: '40px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#854d0e', fontSize: '20px' }}>🌱 How to earn Green Points?</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#422006', lineHeight: '1.8', fontSize: '16px' }}>
          <li><strong>Buy Upcycled Items:</strong> Earn points equal to <strong>5% of the item's price</strong>.</li>
          <li><strong>Rent Items:</strong> Earn <strong>500 points</strong> when you rent items instead of buying new ones.</li>
          <li><strong>Join Green Events:</strong> Earn up to <strong>5,000 points</strong> by attending eco-friendly workshops and events.</li>
        </ul>
      </div>

      {/* Rewards Store */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {sponsorProducts.map(product => (
          <div key={product.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column' }}>
            <img src={product.image} alt={product.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 'bold', marginBottom: '4px' }}>By {product.sponsor}</div>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>{product.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ fontWeight: 'bold', color: '#2563eb', fontSize: '18px' }}>{product.points} pts</span>
                <button 
                  onClick={() => handleRedeemClick(product)}
                  style={{
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.opacity = '0.9'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  Redeem
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Redemption Modal */}
      {showModal && selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', borderRadius: '16px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '22px' }}>Confirm Redemption</h2>
            <p style={{ marginBottom: '24px', color: '#4b5563', lineHeight: '1.5' }}>
              You are about to redeem <strong>{selectedProduct.title}</strong> for <strong style={{color: '#dc2626'}}>{selectedProduct.points} pts</strong>.
            </p>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Phone Number *</label>
              <input 
                type="text" 
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                placeholder="Ex: 0912345678"
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Shipping Address *</label>
              <textarea 
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '80px', resize: 'vertical' }}
                placeholder="Full address to receive your reward..."
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmRedeem}
                style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#16a34a', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Confirm & Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
