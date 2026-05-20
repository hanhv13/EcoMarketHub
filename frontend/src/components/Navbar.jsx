import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCartItemCount } from '../utils/cartStorage'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode')
      setIsDarkMode(true)
    }
    setCartCount(getCartItemCount())

    const handleCartChange = () => setCartCount(getCartItemCount())
    window.addEventListener('secondnest-cart-changed', handleCartChange)
    window.addEventListener('storage', handleCartChange)

    return () => {
      window.removeEventListener('secondnest-cart-changed', handleCartChange)
      window.removeEventListener('storage', handleCartChange)
    }
  }, [])

  const handleToggleTheme = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode')
      localStorage.setItem('theme', 'light')
      setIsDarkMode(false)
    } else {
      document.body.classList.add('dark-mode')
      localStorage.setItem('theme', 'dark')
      setIsDarkMode(true)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`)
    } else {
      navigate('/')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      {/* 1. Left: Logo */}
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          EcoHubMarket
        </Link>
      </div>

      {/* 2. Middle: Nav Links */}
      <div className="navbar-middle">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
        <Link to="/greenhub" className={`nav-link ${isActive('/greenhub') ? 'active' : ''}`}>GreenHub</Link>
        <Link to="/rewards" className={`nav-link ${isActive('/rewards') ? 'active' : ''}`}>Rewards</Link>
        <Link to="/my-listings" className={`nav-link ${isActive('/my-listings') ? 'active' : ''}`}>Profile</Link>
      </div>

      {/* 3. Right: Actions */}
      <div className="navbar-right">
        {/* Search Bar */}
        <form className="header-search" onSubmit={handleSearch}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--text-muted)', marginRight: '6px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* Cart Button */}
        <Link to="/cart" className="nav-icon" title="Cart" style={{ position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-6px', right: '-8px', minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '999px', background: '#16a34a', color: '#fff', fontSize: '11px', fontWeight: '700', lineHeight: '18px', textAlign: 'center', boxShadow: '0 2px 6px rgba(22,163,74,0.35)' }}>
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </Link>

        {/* Theme Toggle Button */}
        <button onClick={handleToggleTheme} className="nav-icon" title="Toggle Theme">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor"></path>
          </svg>
        </button>

        {/* User / Login */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/my-listings" className="avatar" title="My Listings">
              {user.username.charAt(0).toUpperCase()}
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{padding: '6px 12px', fontSize: '12px'}}>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm" style={{padding: '6px 16px'}}>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
