import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  // Format price
  const displayPrice = Number(product.price).toLocaleString('en-US') + ' VND'

  // Handle buy/rent click (immediate action as requested)
  const handleAction = (e) => {
    e.preventDefault() // Stop navigation to detail page
    const action = product.type === 'rent' ? 'Rent' : 'Buy'
    alert(`Processing ${action} request for: ${product.title}`)
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
        <p className="product-card-price">{displayPrice}</p>
        
        <div className="product-card-meta">
          <span>📍 {product.location || 'Vietnam'}</span>
          <span>{product.seller_name}</span>
        </div>

        <button 
          className="btn" 
          style={{ 
            width: '100%', 
            marginTop: '12px', 
            fontSize: '13px',
            backgroundColor: product.type === 'rent' ? '#8b0000' : '#16a34a',
            color: '#fff'
          }}
          onClick={handleAction}
        >
          {product.type === 'rent' ? 'Rent Now' : 'Buy Now'}
        </button>
      </div>
    </Link>
  )
}
