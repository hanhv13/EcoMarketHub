import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  // Format price
  const displayPrice = Number(product.price).toLocaleString('en-US') + ' VND'

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    alert(`Added ${product.title} to cart!`)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    addToCart(product)
    navigate('/cart')
  }

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-img">
        <img 
          src={product.image_url || 'https://placehold.co/300x200?text=No+Image'} 
          alt={product.title} 
          onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=No+Image' }}
        />
        {/* Type Badge */}
        <span className="badge" style={{ 
          background: product.type === 'rent' ? '#8b0000' : '#16a34a' 
        }}>
          {product.type === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.title}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <p className="product-card-price">{displayPrice}</p>
          
          <div className="product-card-meta" style={{ marginBottom: '8px' }}>
            <span>📍 {product.location || 'Vietnam'}</span>
            <span>{product.seller_name}</span>
          </div>

          <div style={{ fontSize: '12px', color: product.stock_quantity > 0 ? '#16a34a' : '#dc2626', marginBottom: '12px', fontWeight: 'bold' }}>
            {product.stock_quantity > 0 ? `In Stock: ${product.stock_quantity}` : 'Out of Stock'}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {product.type === 'rent' ? (
              <button 
                className="btn" 
                style={{ width: '100%', fontSize: '13px', backgroundColor: '#8b0000', color: '#fff' }}
                onClick={(e) => { e.preventDefault(); navigate(`/products/${product.id}`) }}
              >
                Rent Now
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, fontSize: '13px', padding: '8px 4px' }}
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn" 
                  style={{ flex: 1, fontSize: '13px', padding: '8px 4px', backgroundColor: '#16a34a', color: '#fff' }}
                  onClick={handleBuyNow}
                  disabled={product.stock_quantity === 0}
                >
                  Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
