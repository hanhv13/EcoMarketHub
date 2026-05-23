import { createContext, useState, useEffect, useContext } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  const { user } = useAuth()
  const cartKey = user ? `cart_${user.id}` : 'cart_guest'

  const [cartItems, setCartItems] = useState([])

  // Load cart when user changes
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(cartKey)
      setCartItems(storedCart ? JSON.parse(storedCart) : [])
    } catch (err) {
      console.error('Error reading cart from localStorage', err)
      setCartItems([])
    }
  }, [cartKey])

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems))
  }, [cartItems, cartKey])

  const addToCart = (product) => {
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingItem = prev.find(item => item.id === product.id)
      if (existingItem) {
        if (existingItem.quantity >= product.stock_quantity) {
          alert(`Cannot add more than available stock (${product.stock_quantity})!`)
          return prev
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      if (product.stock_quantity <= 0) {
        alert('Product is out of stock!')
        return prev
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId)
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        if (quantity > item.stock_quantity) {
          alert(`Cannot exceed available stock (${item.stock_quantity})!`)
          return { ...item, quantity: item.stock_quantity }
        }
        return { ...item, quantity }
      }
      return item
    }))
  }

  const checkoutItems = (itemIds) => {
    setCartItems(prev => prev.filter(item => !itemIds.includes(item.id)))
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      checkoutItems
    }}>
      {children}
    </CartContext.Provider>
  )
}
