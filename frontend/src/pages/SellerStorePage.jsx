import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductsByUserAPI } from '../api/products'
import { getReviewsBySellerAPI } from '../api/reviews'
import ProductCard from '../components/ProductCard'

export default function SellerStorePage() {
  const { id } = useParams()
  const [products, setProducts] = useState([])
  const [sellerInfo, setSellerInfo] = useState(null)
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, reviewsRes] = await Promise.all([
        getProductsByUserAPI(id),
        getReviewsBySellerAPI(id)
      ])
      
      const userProducts = productsRes.data
      setProducts(userProducts)
      setStats(reviewsRes.data.stats)
      
      // If the seller has products, we can extract their name/avatar from the first product
      // since our API returns it in the product info if we joined the users table.
      // Wait, `getProductsByUser` in `productController.js` only joins `categories`, not `users`.
      // Let's just show "Seller Store" if we don't have user info from an endpoint.
      if (userProducts.length > 0 && userProducts[0].seller_name) {
        setSellerInfo({
          name: userProducts[0].seller_name,
          avatar: userProducts[0].seller_avatar
        })
      } else {
        setSellerInfo({ name: `Seller #${id}`, avatar: null })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  return (
    <div className="container page" style={styles.page}>
      {/* Store Header */}
      <div style={styles.headerCard}>
        <div style={styles.avatar}>
          {sellerInfo?.avatar ? (
            <img src={sellerInfo.avatar} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}}/>
          ) : (
            sellerInfo?.name?.charAt(0).toUpperCase() || 'S'
          )}
        </div>
        <div style={styles.headerInfo}>
          <h1 style={styles.sellerName}>{sellerInfo?.name}'s Store</h1>
          <div style={styles.statsRow}>
            <span style={styles.statPill}>
              ⭐ {stats.averageRating} ({stats.totalReviews} reviews)
            </span>
            <span style={styles.statPill}>
              📦 {products.length} Active Listings
            </span>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div style={styles.contentSection}>
        <h2 style={styles.sectionTitle}>All Products by {sellerInfo?.name}</h2>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🏪</div>
            <p>This seller currently has no active listings.</p>
            <Link to="/" className="btn btn-outline" style={{marginTop: '16px'}}>Back to Home</Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' },
  headerCard: {
    backgroundColor: 'var(--card-bg)',
    padding: '40px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginBottom: '40px',
    border: '1px solid var(--border-color)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'var(--brand-green)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '40px',
    fontWeight: '700',
    flexShrink: 0
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  sellerName: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: 0
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap'
  },
  statPill: {
    padding: '6px 16px',
    backgroundColor: 'var(--bg-body)',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-main)',
    border: '1px solid var(--border-color)'
  },
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-main)',
    borderBottom: '2px solid var(--border-color)',
    paddingBottom: '12px'
  }
}
