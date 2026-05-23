import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import BrandMarquee from './BrandMarquee'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Calculate total items in cart
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode')
      setIsDarkMode(true)
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

  const brands = [
    {
      name: 'EcoLife Co.',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-icon">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7.5 7.5 0 0 1-9 10z" />
          <path d="M9.8 6.1C11 8.5 13 10 16 10" />
        </svg>
      )
    },
    {
      name: 'GreenTech',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-icon">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      )
    },
    {
      name: 'ReNew Apparel',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-icon">
          <path d="M20.38 3.46L16 6a2 2 0 0 1-2 0l-4-2.5a2 2 0 0 0-2 0L3.62 6.54A2 2 0 0 0 2.5 8.25V18a2 2 0 0 0 2 2h15a2 2 0 0 0 2-2V8.25a2 2 0 0 0-1.12-1.79z" />
          <path d="M12 20V10" />
        </svg>
      )
    },
    {
      name: 'EarthFirst',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="brand-icon">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    }
  ]

  return (
    <>
      <BrandMarquee />
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
          {user?.role === 'admin' && (
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`} style={{color: 'var(--brand-green)', fontWeight: 'bold'}}>Admin Panel</Link>
          )}
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
            {totalCartItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {totalCartItems}
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
    </>
  )
}
