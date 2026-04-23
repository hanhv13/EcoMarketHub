// ============================================================
// FILE: frontend/src/pages/ProductListPage.jsx
// CHỨC NĂNG: Trang chủ — hiển thị danh sách sản phẩm
//            Có tìm kiếm theo từ khoá, lọc theo danh mục và loại
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { useState, useEffect } from 'react'
import { getProductsAPI, getCategoriesAPI } from '../api/products'
import ProductCard from '../components/ProductCard'

export default function ProductListPage() {
  // State lưu danh sách sản phẩm từ API
  const [products,   setProducts]   = useState([])
  // State lưu danh sách danh mục để hiển thị dropdown lọc
  const [categories, setCategories] = useState([])
  // State loading khi đang gọi API
  const [loading,    setLoading]    = useState(true)
  // State lưu thông báo lỗi
  const [error,      setError]      = useState('')
  // State phân trang
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })

  // State lưu các giá trị filter
  const [filters, setFilters] = useState({
    search:   '',    // Từ khoá tìm kiếm
    category: '',    // ID danh mục đang lọc
    type:     '',    // 'sell' hoặc 'rent'
  })
  // State lưu từ khoá đang gõ (chưa submit)
  const [searchInput, setSearchInput] = useState('')

  // ---- Lấy danh mục một lần khi component mount ----
  useEffect(() => {
    getCategoriesAPI()
      .then(res => setCategories(res.data))
      .catch(() => {}) // Lỗi nhẹ, bỏ qua
  }, [])

  // ---- Gọi API sản phẩm mỗi khi filter hoặc page thay đổi ----
  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page]) // Chạy lại khi filters hoặc page thay đổi

  const fetchProducts = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getProductsAPI({
        ...filters,
        page:  pagination.page,
        limit: 12,
      })
      setProducts(res.data.products)
      setPagination(prev => ({ ...prev, ...res.data.pagination }))
    } catch {
      setError('Không thể tải danh sách sản phẩm.')
    } finally {
      setLoading(false)
    }
  }

  // Xử lý submit form tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault()
    // Reset về trang 1 khi tìm kiếm mới
    setPagination(prev => ({ ...prev, page: 1 }))
    setFilters(prev => ({ ...prev, search: searchInput }))
  }

  // Xử lý thay đổi filter danh mục hoặc loại
  const handleFilterChange = (name, value) => {
    setPagination(prev => ({ ...prev, page: 1 })) // Reset về trang 1
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  // Xoá tất cả filter
  const clearFilters = () => {
    setSearchInput('')
    setFilters({ search: '', category: '', type: '' })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return (
    <div className="container page">

      {/* ---- Khu vực tìm kiếm và lọc ---- */}
      <div style={styles.filterBar}>
        {/* Form tìm kiếm */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            className="form-control"
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">Tìm</button>
        </form>

        {/* Lọc theo danh mục */}
        <select
          className="form-control"
          style={{ width: '180px' }}
          value={filters.category}
          onChange={e => handleFilterChange('category', e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        {/* Lọc theo loại */}
        <select
          className="form-control"
          style={{ width: '140px' }}
          value={filters.type}
          onChange={e => handleFilterChange('type', e.target.value)}
        >
          <option value="">Tất cả loại</option>
          <option value="sell">Bán</option>
          <option value="rent">Cho thuê</option>
        </select>

        {/* Nút xoá filter */}
        {(filters.search || filters.category || filters.type) && (
          <button className="btn btn-gray" onClick={clearFilters}>✕ Xoá lọc</button>
        )}
      </div>

      {/* ---- Tiêu đề kết quả ---- */}
      <div style={styles.resultHeader}>
        <h2 style={{ fontSize: '18px', fontWeight: '600' }}>
          {filters.search
            ? `Kết quả tìm kiếm: "${filters.search}"`
            : 'Tất cả sản phẩm'}
        </h2>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>
          {pagination.total} sản phẩm
        </span>
      </div>

      {/* ---- Trạng thái loading ---- */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      )}

      {/* ---- Thông báo lỗi ---- */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* ---- Danh sách sản phẩm ---- */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="empty-state">
              <div className="icon">📦</div>
              <p>Không tìm thấy sản phẩm nào.</p>
              <button className="btn btn-outline" onClick={clearFilters} style={{ marginTop: '12px' }}>
                Xem tất cả sản phẩm
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {/* Map: duyệt qua mảng products, render ProductCard cho mỗi sản phẩm */}
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* ---- Phân trang ---- */}
          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                className="btn btn-outline"
                disabled={pagination.page <= 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                ← Trước
              </button>

              <span style={{ color: '#6b7280', fontSize: '14px' }}>
                Trang {pagination.page} / {pagination.totalPages}
              </span>

              <button
                className="btn btn-outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Sau →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const styles = {
  filterBar: {
    display: 'flex', gap: '12px', alignItems: 'center',
    flexWrap: 'wrap', marginBottom: '24px',
    background: '#fff', padding: '16px', borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  searchForm: {
    display: 'flex', gap: '8px', flex: 1, minWidth: '260px'
  },
  resultHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '16px',
  },
  pagination: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', gap: '16px', marginTop: '32px',
  }
}
