// ============================================================
// FILE: frontend/src/components/ProductCard.jsx
// CHỨC NĂNG: Hiển thị thông tin tóm tắt của 1 sản phẩm trong lưới
//            Dùng ở trang ProductListPage và FavoritesPage
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { Link } from 'react-router-dom'

// props: dữ liệu truyền từ component cha vào
// product: object chứa thông tin sản phẩm
export default function ProductCard({ product }) {
  // Hàm format giá tiền: 12000000 → "12.000.000 đ"
  const formatPrice = (price) =>
    Number(price).toLocaleString('vi-VN') + ' đ'

  return (
    // Link bao ngoài toàn bộ card → click vào đâu cũng chuyển trang
    <Link to={`/products/${product.id}`} style={styles.link}>
      <div style={styles.card}>
        {/* Ảnh sản phẩm */}
        <div style={styles.imageWrap}>
          <img
            src={product.image_url || 'https://placehold.co/300x200?text=No+Image'}
            alt={product.title}
            style={styles.image}
            // Nếu ảnh lỗi → hiện ảnh placeholder
            onError={(e) => { e.target.src = 'https://placehold.co/300x200?text=No+Image' }}
          />
          {/* Badge loại: Bán / Cho thuê */}
          <span style={{
            ...styles.badge,
            background: product.type === 'rent' ? '#7c3aed' : '#16a34a'
          }}>
            {product.type === 'rent' ? 'Cho thuê' : 'Bán'}
          </span>
        </div>

        {/* Thông tin sản phẩm */}
        <div style={styles.info}>
          {/* Tên sản phẩm — giới hạn 2 dòng */}
          <p style={styles.title}>{product.title}</p>

          {/* Giá */}
          <p style={styles.price}>{formatPrice(product.price)}</p>

          {/* Danh mục và người bán */}
          <div style={styles.meta}>
            <span style={styles.category}>{product.category_name}</span>
            <span style={styles.seller}>👤 {product.seller_name}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  link: { textDecoration: 'none', color: 'inherit' },
  card: {
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageWrap: { position: 'relative', paddingTop: '66%', background: '#f3f4f6' },
  image: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',  // Ảnh lấp đầy không bị méo
  },
  badge: {
    position: 'absolute', top: '8px', left: '8px',
    color: '#fff', fontSize: '11px', fontWeight: '600',
    padding: '3px 8px', borderRadius: '20px',
  },
  info: { padding: '12px' },
  title: {
    fontSize: '14px', fontWeight: '600',
    color: '#111827',
    display: '-webkit-box',
    WebkitLineClamp: 2,       // Giới hạn 2 dòng
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    marginBottom: '6px',
    lineHeight: '1.4',
  },
  price: {
    fontSize: '16px', fontWeight: '700',
    color: '#16a34a', marginBottom: '8px',
  },
  meta: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: '11px', color: '#6b7280',
    background: '#f3f4f6', padding: '2px 8px',
    borderRadius: '20px',
  },
  seller: { fontSize: '11px', color: '#9ca3af' },
}
