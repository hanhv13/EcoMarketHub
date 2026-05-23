import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProductByIdAPI, checkFavoriteAPI, addFavoriteAPI, removeFavoriteAPI } from '../api/products'
import { getReviewsBySellerAPI } from '../api/reviews'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addDays, addMonths } from 'date-fns'
import { createRentalAPI, getProductRentalsAPI } from '../api/rentals'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [sellerStats, setSellerStats] = useState({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [bookedDates, setBookedDates] = useState([])
  const [isFavorited, setIsFavorited] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getProductByIdAPI(id)
      setProduct(res.data)
      
      const statsRes = await getReviewsBySellerAPI(res.data.seller_id)
      setSellerStats(statsRes.data.stats)
      
      if (res.data.type === 'rent') {
        const rentalRes = await getProductRentalsAPI(id)
        setBookedDates(rentalRes.data)
      }
      
      if (user) {
        try {
          const favRes = await checkFavoriteAPI(id)
          setIsFavorited(favRes.data.isFavorited)
        } catch (e) {}
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>
  if (!product) return <div className="container page">Product not found.</div>

  let images = []
  try {
    images = product.images ? (typeof product.images === 'string' ? JSON.parse(product.images) : product.images) : []
  } catch (e) {
    images = []
  }
  if (images.length === 0 && product.image_url) images.push(product.image_url)

  const displayPrice = Number(product.price).toLocaleString('en-US') + ' VND'

  const excludeDates = []
  bookedDates.forEach(b => {
    let current = new Date(b.start_date)
    const end = new Date(b.end_date)
    while (current <= end) {
      excludeDates.push(new Date(current))
      current = addDays(current, 1)
    }
  })
  const maxDate = addMonths(new Date(), 1)

  const handleAction = async () => {
    if (product.type === 'rent') {
      if (!startDate || !endDate) return alert('Please select a valid rental date range.')
      try {
        await createRentalAPI({
          product_id: product.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        })
        alert('Rental booked successfully!')
        setStartDate(null)
        setEndDate(null)
        const rentalRes = await getProductRentalsAPI(product.id)
        setBookedDates(rentalRes.data)
      } catch (err) {
        alert(err.response?.data?.message || 'Error booking rental. Please login first.')
      }
    } else {
      addToCart(product)
      navigate('/cart')
    }
  }

  const handleAddToCart = () => {
    addToCart(product)
    alert('Product added to cart!')
  }

  const toggleFavorite = async () => {
    if (!user) return alert('Please login to favorite products')
    try {
      if (isFavorited) {
        await removeFavoriteAPI(id)
        setIsFavorited(false)
      } else {
        await addFavoriteAPI(id)
        setIsFavorited(true)
      }
    } catch (err) {
      alert('Error updating favorites')
    }
  }

  return (
    <div className="container page" style={styles.page}>
      {/* Breadcrumb */}
      <nav style={styles.breadcrumb}>
        <Link to="/">Home</Link> / <Link to={`/?category=${product.category_id}`}>{product.category_name}</Link> / {product.title}
      </nav>

      <div style={styles.mainGrid}>
        {/* Left Column: Image Gallery */}
        <div style={styles.leftCol}>
          <div style={styles.mainImageWrapper}>
            <img 
              src={images[activeImage] || 'https://placehold.co/600x600?text=No+Image'} 
              alt={product.title} 
              style={styles.mainImage}
            />
            {product.is_premium && <div style={styles.premiumBadge}>Premium Listing</div>}
          </div>
          
          {images.length > 1 && (
            <div style={styles.thumbGrid}>
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  style={{...styles.thumbWrapper, border: activeImage === idx ? '2px solid #16a34a' : '2px solid transparent'}}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} alt="" style={styles.thumbImage} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div style={styles.rightCol}>
          <div style={styles.infoCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={styles.title}>{product.title}</h1>
              <button 
                onClick={toggleFavorite} 
                style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: isFavorited ? '#ef4444' : '#d1d5db', transition: 'color 0.2s' }}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>
            <p style={styles.price}>{displayPrice}</p>
            
            <div style={{...styles.statsGrid, gridTemplateColumns: 'repeat(4, 1fr)'}}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Condition</span>
                <span style={styles.statValue}>{product.condition || 'Used'}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Location</span>
                <span style={styles.statValue}>{product.location || 'Vietnam'}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Listed</span>
                <span style={styles.statValue}>{new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Stock</span>
                <span style={{...styles.statValue, color: product.stock_quantity > 0 ? '#16a34a' : '#dc2626'}}>
                  {product.stock_quantity > 0 ? product.stock_quantity : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div style={styles.descriptionSection}>
              <h3 style={styles.sectionTitle}>Description</h3>
              <p style={styles.descriptionText}>{product.description || 'No description provided.'}</p>
            </div>

            <div style={styles.actionButtons}>
              {user?.id === product.seller_id ? (
                <div style={{ padding: '16px', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '12px', textAlign: 'center', fontWeight: '600' }}>
                  You cannot purchase or rent your own product.
                </div>
              ) : (
                <>
                  {product.type === 'rent' && (
                    <div style={{marginBottom: '16px'}}>
                      <h4 style={{marginBottom: '8px', fontSize: '14px', color: '#4b5563'}}>Select Rental Dates (Max 1 month)</h4>
                      <DatePicker
                        selected={startDate}
                        onChange={(dates) => {
                          const [start, end] = dates;
                          
                          if (start && end) {
                            let isValid = true;
                            let current = new Date(start);
                            while (current <= end) {
                              if (excludeDates.some(ed => ed.toDateString() === current.toDateString())) {
                                isValid = false;
                                break;
                              }
                              current = addDays(current, 1);
                            }
                            
                            if (!isValid) {
                              alert('Selected range includes already booked dates. Please choose another range.');
                              setStartDate(null);
                              setEndDate(null);
                              return;
                            }
                          }
                          
                          setStartDate(start);
                          setEndDate(end);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        minDate={new Date()}
                        maxDate={maxDate}
                        excludeDates={excludeDates}
                        placeholderText="Start Date - End Date"
                        customInput={<input style={styles.dateInput} />}
                      />
                    </div>
                  )}

                  {product.type === 'rent' ? (
                    <button 
                      style={{ ...styles.btnBuy, backgroundColor: '#8b0000', opacity: product.stock_quantity === 0 ? 0.5 : 1 }} 
                      onClick={handleAction}
                      disabled={product.stock_quantity === 0}
                    >
                      {product.stock_quantity === 0 ? 'Out of Stock' : 'Rent Now'}
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button 
                        style={{ ...styles.btnBuy, backgroundColor: '#f59e0b', flex: 1, opacity: product.stock_quantity === 0 ? 0.5 : 1 }} 
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0}
                      >
                        Add to Cart
                      </button>
                      <button 
                        style={{ ...styles.btnBuy, flex: 1, opacity: product.stock_quantity === 0 ? 0.5 : 1 }} 
                        onClick={handleAction}
                        disabled={product.stock_quantity === 0}
                      >
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Buy Now'}
                      </button>
                    </div>
                  )}
                </>
              )}
              <button style={styles.btnChat} onClick={() => alert('Starting chat with seller...')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Chat with Seller
              </button>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div style={styles.sellerCard}>
            <div style={styles.sellerHeader}>
              <div style={styles.avatar}>{product.seller_name?.charAt(0).toUpperCase()}</div>
              <div>
                <h4 style={styles.sellerName}>{product.seller_name}</h4>
                <div style={styles.ratingBox}>
                  <span style={styles.stars}>⭐ {sellerStats.averageRating}</span>
                  <span style={styles.reviewCount}>({sellerStats.totalReviews} reviews)</span>
                </div>
              </div>
            </div>
            <Link to={`/seller/${product.seller_id}`} style={styles.btnViewStore}>View Store</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' },
  breadcrumb: { fontSize: '14px', color: '#6b7280', marginBottom: '24px' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' },
  
  // Left Column
  leftCol: { display: 'flex', flexDirection: 'column', gap: '16px' },
  mainImageWrapper: { position: 'relative', borderRadius: '16px', overflow: 'hidden', backgroundColor: '#f9fafb', aspectScale: '1/1', border: '1px solid #e5e7eb' },
  mainImage: { width: '100%', height: 'auto', display: 'block' },
  premiumBadge: { position: 'absolute', top: '16px', left: '16px', backgroundColor: 'var(--brand-green)', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', boxShadow: '0 4px 12px rgba(22,163,74,0.3)' },
  thumbGrid: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  thumbWrapper: { width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s' },
  thumbImage: { width: '100%', height: '100%', objectFit: 'cover' },

  // Right Column
  rightCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
  infoCard: { backgroundColor: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f3f4f6' },
  title: { fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '12px' },
  price: { fontSize: '24px', fontWeight: '700', color: 'var(--price-color)', marginBottom: '24px' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px', backgroundColor: '#fdfcf0', padding: '16px', borderRadius: '12px' },
  statItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  statLabel: { fontSize: '12px', color: '#8b968f', textTransform: 'uppercase', letterSpacing: '0.05em' },
  statValue: { fontSize: '14px', fontWeight: '600', color: '#1f2937' },

  descriptionSection: { marginBottom: '32px' },
  sectionTitle: { fontSize: '18px', fontWeight: '700', color: '#111827', marginBottom: '12px' },
  descriptionText: { fontSize: '15px', color: '#4b5563', lineHeight: '1.6' },

  actionButtons: { display: 'flex', flexDirection: 'column', gap: '12px' },
  dateInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '15px' },
  btnBuy: { width: '100%', padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--btn-buy-bg)', color: '#fff', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' },
  btnChat: { width: '100%', padding: '16px', borderRadius: '12px', border: '2px solid var(--brand-green)', backgroundColor: 'transparent', color: 'var(--brand-green)', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

  sellerCard: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  sellerHeader: { display: 'flex', alignItems: 'center', gap: '16px' },
  avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--cat-icon-bg)', color: 'var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '20px' },
  sellerName: { fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '4px' },
  ratingBox: { display: 'flex', alignItems: 'center', gap: '8px' },
  stars: { fontSize: '14px', fontWeight: '600', color: '#fbbf24' },
  reviewCount: { fontSize: '13px', color: '#9ca3af' },
  btnViewStore: { fontSize: '14px', fontWeight: '600', color: 'var(--brand-green)', textDecoration: 'none' }
}
