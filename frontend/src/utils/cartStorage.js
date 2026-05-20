const CART_STORAGE_KEY = 'secondnest_cart'
const CART_FOCUS_KEY = 'secondnest_cart_focus'
const CART_CHANGE_EVENT = 'secondnest-cart-changed'

function readCart() {
  try {
    const rawCart = localStorage.getItem(CART_STORAGE_KEY)
    const parsedCart = rawCart ? JSON.parse(rawCart) : []

    return Array.isArray(parsedCart) ? parsedCart : []
  } catch {
    return []
  }
}

function emitCartChange(cartItems) {
  const eventDetail = {
    items: cartItems,
    itemCount: cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
  }

  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT, { detail: eventDetail }))
}

function writeCart(cartItems) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  emitCartChange(cartItems)
}

function normalizeProduct(product, quantity = 1) {
  return {
    id: product.id,
    title: product.title,
    price: Number(product.price),
    quantity,
    image_url: product.image_url || (Array.isArray(product.images) ? product.images[0] : ''),
    type: product.type || 'sell',
    location: product.location || 'Vietnam',
    seller_name: product.seller_name || '',
  }
}

export function getCartItems() {
  return readCart()
}

export function getCartItemCount() {
  return readCart().reduce((sum, item) => sum + (item.quantity || 0), 0)
}

export function addToCart(product, quantity = 1) {
  const cartItems = readCart()
  const existingItem = cartItems.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.push(normalizeProduct(product, quantity))
  }

  writeCart(cartItems)
  return cartItems
}

export function updateCartItemQuantity(productId, quantity) {
  const cartItems = readCart()
  const nextCartItems = cartItems
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0)

  writeCart(nextCartItems)
  return nextCartItems
}

export function removeCartItem(productId) {
  const nextCartItems = readCart().filter((item) => item.id !== productId)
  writeCart(nextCartItems)
  return nextCartItems
}

export function clearCart() {
  writeCart([])
}

export function focusCartItem(productId) {
  localStorage.setItem(CART_FOCUS_KEY, String(productId))
}

export function consumeCartFocus() {
  const focusedItemId = localStorage.getItem(CART_FOCUS_KEY)
  if (focusedItemId) {
    localStorage.removeItem(CART_FOCUS_KEY)
  }
  return focusedItemId ? Number(focusedItemId) : null
}