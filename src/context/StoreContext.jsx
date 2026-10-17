import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { sampleProducts } from '../data/products'
import { addCartLine, fetchProducts, removeCartLine, shopifyConfigured, updateCartLine } from '../services/shopify'

const StoreContext = createContext(null)
const CART_KEY = 'threadly-cart-v1'
const WISHLIST_KEY = 'threadly-wishlist-v1'

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error)
    return fallback
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(shopifyConfigured ? [] : sampleProducts)
  const [productsLoading, setProductsLoading] = useState(shopifyConfigured)
  const [productsError, setProductsError] = useState('')
  const [cart, setCart] = useState(() => {
    const stored = readStorage(CART_KEY, { id: null, checkoutUrl: null, items: [] })
    return shopifyConfigured === Boolean(stored.id) ? stored : { id: null, checkoutUrl: null, items: [] }
  })
  const [wishlist, setWishlist] = useState(() => readStorage(WISHLIST_KEY, []))
  const [cartError, setCartError] = useState('')
  const [cartBusy, setCartBusy] = useState(false)

  useEffect(() => {
    if (!shopifyConfigured) return
    let active = true
    fetchProducts()
      .then((items) => {
        if (active) setProducts(items)
      })
      .catch((error) => {
        if (active) setProductsError(error.message)
      })
      .finally(() => {
        if (active) setProductsLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Unable to persist the cart in local storage.', error)
      setCartError('Your browser could not save the cart. Check available storage and try again.')
    }
  }, [cart])

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
    } catch (error) {
      console.error('Unable to persist the wishlist in local storage.', error)
    }
  }, [wishlist])

  const addItem = async (product, size, color, quantity = 1) => {
    setCartError('')
    setCartBusy(true)
    try {
      if (shopifyConfigured) {
        const variant = product.variants?.find((item) => item.size === size && item.color === color)
        if (!variant?.id) throw new Error('This product has no available Shopify variant.')
        if (!variant.availableForSale) throw new Error('This size and color combination is currently sold out.')
        const cartProduct = { ...product, color, price: variant.price }
        const existing = cart.items.find((item) => item.variantId === variant.id)
        const response = await addCartLine(cart.id, variant.id, existing ? existing.quantity + quantity : quantity)
        const line = response.lines.nodes.find((item) => item.merchandise.id === variant.id)
        const nextItems = cart.items.filter((item) => item.variantId !== variant.id)
        nextItems.push({ product: cartProduct, size, color, quantity: line?.quantity || quantity, variantId: variant.id, lineId: line?.id })
        setCart({ id: response.id, checkoutUrl: response.checkoutUrl, items: nextItems })
      } else {
        setCart((current) => {
          const key = `${product.id}:${size}:${color}`
          const existing = current.items.find((item) => item.key === key)
          const items = existing
            ? current.items.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item)
            : [...current.items, { product, size, color, quantity, key, variantId: product.variantId }]
          return { ...current, items }
        })
      }
      return true
    } catch (error) {
      setCartError(error.message)
      return false
    } finally {
      setCartBusy(false)
    }
  }

  const updateQuantity = async (item, quantity) => {
    if (quantity < 1) return removeItem(item)
    setCartError('')
    if (!shopifyConfigured) {
      setCart((current) => ({ ...current, items: current.items.map((entry) => entry.key === item.key ? { ...entry, quantity } : entry) }))
      return true
    }
    setCartBusy(true)
    try {
      const response = await updateCartLine(cart.id, item.lineId, quantity)
      setCart((current) => ({
        ...current,
        checkoutUrl: response.checkoutUrl,
        items: current.items.map((entry) => entry.lineId === item.lineId ? { ...entry, quantity } : entry),
      }))
      return true
    } catch (error) {
      setCartError(error.message)
      return false
    } finally {
      setCartBusy(false)
    }
  }

  const removeItem = async (item) => {
    setCartError('')
    if (!shopifyConfigured) {
      setCart((current) => ({ ...current, items: current.items.filter((entry) => entry.key !== item.key) }))
      return true
    }
    setCartBusy(true)
    try {
      const response = await removeCartLine(cart.id, item.lineId)
      setCart((current) => ({
        id: response.id,
        checkoutUrl: response.checkoutUrl,
        items: current.items.filter((entry) => entry.lineId !== item.lineId),
      }))
      return true
    } catch (error) {
      setCartError(error.message)
      return false
    } finally {
      setCartBusy(false)
    }
  }

  const toggleWishlist = (product) => {
    setWishlist((current) => current.some((item) => item.id === product.id)
      ? current.filter((item) => item.id !== product.id)
      : [...current, product])
  }

  const checkout = () => {
    if (shopifyConfigured) {
      if (!cart.checkoutUrl) {
        setCartError('Your Shopify checkout is not available yet. Try refreshing the cart.')
        return false
      }
      window.location.assign(cart.checkoutUrl)
      return true
    }
    return false
  }

  const value = useMemo(() => ({
    products, productsLoading, productsError, cart, cartError, cartBusy, wishlist,
    addItem, updateQuantity, removeItem, toggleWishlist, checkout,
    isShopifyConfigured: shopifyConfigured,
  }), [products, productsLoading, productsError, cart, cartError, cartBusy, wishlist])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider.')
  return context
}
