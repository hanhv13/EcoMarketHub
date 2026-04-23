// ============================================================
// FILE: frontend/src/components/SearchBar.jsx
// CHỨC NĂNG: Ô tìm kiếm + dropdown lọc danh mục + lọc loại
// NGƯỜI PHỤ TRÁCH: M3
// ============================================================

import { useState, useEffect } from 'react'
import axios from 'axios'

// Props nhận vào:
//   onSearch: hàm callback khi user bấm tìm kiếm
//   initialValues: giá trị mặc định ban đầu (nếu có)
function SearchBar({ onSearch, initialValues = {} }) {
  // State lưu giá trị các ô input
  const [search,   setSearch]   = useState(initialValues.search   || '')
  const [category, setCategory] = useState(initialValues.category || '')
  const [type,     setType]     = useState(initialValues.type     || '')

  // State lưu danh sách danh mục lấy từ API
  const [categories, setCategories] = useState([])

  // useEffect: chạy 1 lần khi component được mount (hiển thị lần đầu)
  useEffect(() => {
    // Gọi API lấy danh mục
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error('Không lấy được categories:', err))
  }, []) // [] = chỉ chạy 1 lần

  // Xử lý khi user bấm nút Tìm kiếm
  const handleSubmit = (e) => {
    e.preventDefault() // Ngăn form reload trang
    // Gọi hàm cha truyền vào với các filter hiện tại
    onSearch({ search, category, type })
  }

  // Xử lý khi bấm Xoá bộ lọc
  const handleReset = () => {
    setSearch('')
    setCategory('')
    setType('')
    onSearch({ search: '', category: '', type: '' })
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      {/* Ô tìm kiếm từ khoá */}
      <input
        type="text"
        placeholder="🔍 Tìm kiếm sản phẩm..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Cập nhật state mỗi lần gõ
      />

      {/* Dropdown lọc danh mục */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Tất cả danh mục</option>
        {/* Render danh mục từ API */}
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      {/* Dropdown lọc loại bán/thuê */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Bán & Cho thuê</option>
        <option value="sell">Chỉ bán</option>
        <option value="rent">Chỉ cho thuê</option>
      </select>

      {/* Nút tìm kiếm */}
      <button type="submit" className="btn btn-primary">Tìm kiếm</button>

      {/* Nút xoá filter (chỉ hiện khi có filter) */}
      {(search || category || type) && (
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          ✕ Xoá lọc
        </button>
      )}
    </form>
  )
}

export default SearchBar
