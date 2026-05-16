import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { getProductsAPI, getCategoriesWithCountAPI } from '../api/products'
import ProductCard from '../components/ProductCard'

// Map category names to SVG icons
const CATEGORY_ICONS = {
  'electronics & tech': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/>
      <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
      <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
    </svg>
  ),
  'fashion & apparel': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a8.59 8.59 0 0 0-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  ),
  'home & living': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 9v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9"/><path d="M9 22V12h6v10M2 10.6L12 2l10 8.6"/>
    </svg>
  ),
  'books & stationery': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  'furniture': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  ),
  'vehicles': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9h-2m-9 4a2 2 0 1 0 4 0 2 2 0 0 0-4 0m9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
    </svg>
  ),
  'sports & outdoor': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/>
    </svg>
  ),
  'others': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
    </svg>
  ),
}

function getCategoryIcon(name) {
  const key = name.toLowerCase()
  return CATEGORY_ICONS[key] || CATEGORY_ICONS['others']
}

export default function ProductListPage() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('search') || ''

  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })

  const [filters, setFilters] = useState({ category: '', type: '', sortPrice: '', location: '' })

  // Fetch categories with live product count on mount
  useEffect(() => {
    getCategoriesWithCountAPI()
      .then(res => setCategories(res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page, searchQuery])

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getProductsAPI({
        ...filters,
        search: searchQuery,
        page:  pagination.page,
        limit: 12,
      })
      setProducts(res.data.products)
      setPagination(prev => ({ ...prev, ...res.data.pagination }))
    } catch {
      setError('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (catId) => {
    setPagination(prev => ({ ...prev, page: 1 }))
    setFilters(prev => ({ ...prev, category: catId === filters.category ? '' : catId }))
  }

  const clearFilters = () => {
    setFilters({ category: '', type: '', sortPrice: '', location: '' })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const toggleSortPrice = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    setFilters(prev => ({
      ...prev,
      sortPrice: prev.sortPrice === 'asc' ? 'desc' : (prev.sortPrice === 'desc' ? '' : 'desc')
    }))
  }

  return (
    <div className="container page">

      {/* ---- Browse Categories (dynamic) ---- */}
      {!searchQuery && (
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '500', color: 'var(--text-main)', marginBottom: '4px' }}>
            Browse Categories
          </h1>
          <p style={{ color: '#8b968f', fontSize: '15px', marginBottom: '24px' }}>
            Find exactly what you need for a conscious lifestyle.
          </p>

          {categories.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Loading categories...</p>
          ) : (
            <div style={styles.catGrid}>
              {[...categories]
                .sort((a, b) => b.product_count - a.product_count)
                .slice(0, 4)
                .map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  style={{
                    ...styles.catBtn,
                    borderColor: filters.category == cat.id ? 'var(--brand-green)' : 'var(--cat-border)',
                    background:  filters.category == cat.id ? 'var(--brand-green-hover)' : 'var(--cat-bg)',
                    color: filters.category == cat.id ? '#fff' : 'var(--text-main)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={styles.catIconWrap}>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div style={styles.catTextWrap}>
                    <span style={styles.catTitle}>{cat.name}</span>
                    <span style={styles.catSub}>
                      {cat.product_count} {cat.product_count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {filters.category && (
            <button
              onClick={clearFilters}
              style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ✕ Clear filter
            </button>
          )}
        </div>
      )}

      {/* ---- Results header ---- */}
      <div style={styles.resultHeader}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-main)' }}>
          {searchQuery
            ? `Search Results for "${searchQuery}"`
            : filters.category
              ? `${categories.find(c => c.id == filters.category)?.name ?? ''} Items`
              : 'Trending Items'}
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-main)' }}
            value={filters.location}
            onChange={(e) => {
              setPagination(prev => ({ ...prev, page: 1 }))
              setFilters(prev => ({ ...prev, location: e.target.value }))
            }}
          >
            <option value="">All Locations</option>
            <option value="Hanoi">Hanoi</option>
            <option value="Ho Chi Minh City">Ho Chi Minh City</option>
            <option value="Da Nang">Da Nang</option>
          </select>

          <select
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', background: 'var(--card-bg)', color: 'var(--text-main)' }}
            value={filters.category}
            onChange={(e) => handleCategoryClick(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            onClick={toggleSortPrice}
            className="btn btn-outline"
            style={{ padding: '8px 16px', minWidth: '90px' }}
          >
            Price {filters.sortPrice === 'asc' ? '↑' : (filters.sortPrice === 'desc' ? '↓' : '')}
          </button>
        </div>
      </div>

      {/* ---- Loading ---- */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      )}

      {/* ---- Error ---- */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* ---- Product Grid ---- */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <p>No products found.</p>
              <button className="btn btn-outline" onClick={clearFilters} style={{ marginTop: '12px' }}>
                View all products
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* ---- Pagination ---- */}
          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                className="btn btn-outline"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                ← Prev
              </button>
              <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                className="btn btn-outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  catGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
  },
  catBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '16px',
    textAlign: 'left',
    width: '280px',
    background: 'var(--cat-bg)',
    border: '1px solid var(--cat-border)',
    borderRadius: '24px',
    cursor: 'pointer',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
    transition: 'all 0.2s',
  },
  catIconWrap: {
    background: 'var(--cat-icon-bg)',
    width: '56px', height: '56px',
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '8px',
  },
  catTextWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', overflow: 'hidden',
  },
  catTitle: {
    fontSize: '18px', fontWeight: '700', color: 'inherit', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%',
  },
  catSub: {
    fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500',
  },
  resultHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: '24px',
    flexWrap: 'wrap', gap: '16px',
  },
  pagination: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', gap: '16px', marginTop: '32px',
  },
}
