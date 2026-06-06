// ============================================================
// FILE: frontend/src/App.jsx
// FUNCTION: Declare all routes of the application
//            Wraps the entire app in AuthProvider to share login state
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar           from './components/Navbar'
import ProductListPage  from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import PostProductPage  from './pages/PostProductPage'
import EditProductPage  from './pages/EditProductPage'
import MyListingsPage   from './pages/MyListingsPage'
import FavoritesPage    from './pages/FavoritesPage'
import CartPage         from './pages/CartPage'
import GreenhubPage     from './pages/GreenhubPage'
import RewardsPage      from './pages/RewardsPage'
import EventPage        from './pages/EventPage'
import AboutPage        from './pages/AboutPage'
import ContactPage      from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import VerifyEmailPage  from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import SellerStorePage  from './pages/SellerStorePage'
import AdminDashboard   from './pages/AdminDashboard'
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
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar displayed on all pages */}
        <Navbar />

        {/* Routes: only render the route that matches the current URL */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            {/* Public Routes (accessible to everyone) */}
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/cart"      element={<CartPage />} />
            <Route path="/about"     element={<AboutPage />} />
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="/privacy"   element={<PrivacyPolicyPage />} />

            {/* Private Routes (require login) */}
            <Route path="/"          element={<PrivateRoute><ProductListPage /></PrivateRoute>} />
            <Route path="/products/:id" element={<PrivateRoute><ProductDetailPage /></PrivateRoute>} />
            <Route path="/post"      element={<PrivateRoute><PostProductPage /></PrivateRoute>} />
            <Route path="/edit-product/:id" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
            <Route path="/my-listings" element={<PrivateRoute><MyListingsPage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
            <Route path="/greenhub"  element={<PrivateRoute><GreenhubPage /></PrivateRoute>} />
            <Route path="/rewards"   element={<PrivateRoute><RewardsPage /></PrivateRoute>} />
            <Route path="/events"    element={<PrivateRoute><EventPage /></PrivateRoute>} />
            <Route path="/seller/:id" element={<PrivateRoute><SellerStorePage /></PrivateRoute>} />
            <Route path="/admin"     element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

            {/* If URL doesn't match any route → go home */}
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer displayed on all pages */}
        <Footer />
      </div>
    </BrowserRouter>
  )
}

// Export App wrapped in AuthProvider and CartProvider
export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  )
}
