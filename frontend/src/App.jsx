// ============================================================
// FILE: frontend/src/App.jsx
// FUNCTION: Declare all routes of the application
//            Wraps the entire app in AuthProvider to share login state
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

import Navbar           from './components/Navbar'
import ProductListPage  from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import PostProductPage  from './pages/PostProductPage'
import MyListingsPage   from './pages/MyListingsPage'
import FavoritesPage    from './pages/FavoritesPage'
import CartPage         from './pages/CartPage'
import GreenhubPage     from './pages/GreenhubPage'
import RewardsPage      from './pages/RewardsPage'
import EventPage        from './pages/EventPage'
import Footer           from './components/Footer'

// ============================================================
// PrivateRoute: protect pages that require login
// If not logged in → redirect to /login
// ============================================================
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  // Checking token → wait, don't render yet
  if (loading) return <div className="loading"><div className="spinner"></div></div>

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" replace />

  // Logged in → render page normally
  return children
}

// ============================================================
// Main Component — defines the app structure
// ============================================================
function AppContent() {
  return (
    <BrowserRouter>
      {/* Navbar displayed on all pages */}
      <Navbar />

      {/* Routes: only render the route that matches the current URL */}
      <Routes>
        {/* Public Routes (accessible to everyone) */}
        <Route path="/"          element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/cart"      element={<CartPage />} />

        {/* Private Routes (require login) */}
        <Route path="/post"      element={<PrivateRoute><PostProductPage /></PrivateRoute>} />
        <Route path="/my-listings" element={<PrivateRoute><MyListingsPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/greenhub"  element={<PrivateRoute><GreenhubPage /></PrivateRoute>} />
        <Route path="/rewards"   element={<PrivateRoute><RewardsPage /></PrivateRoute>} />
        <Route path="/events"    element={<PrivateRoute><EventPage /></PrivateRoute>} />

        {/* If URL doesn't match any route → go home */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>

      {/* Footer displayed on all pages */}
      <Footer />
    </BrowserRouter>
  )
}

// Export App wrapped in AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
