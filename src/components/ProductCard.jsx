import { useState } from 'react'
import { ArrowUpRight, Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const formatPrice = (amount, currencyCode = 'INR') => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: currencyCode,
  maximumFractionDigits: 0,
}).format(amount)

export default function ProductCard({ product, index = 0, showQuickAdd = false }) {
  const { wishlist, toggleWishlist, isShopifyConfigured, addItem, cartBusy, cartError } = useStore()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(product.color || product.colors?.[0] || 'Default')
  const [added, setAdded] = useState(false)
  const saved = wishlist.some((item) => item.id === product.id)
  const image = product.images?.[0]
  const sizes = product.sizes?.length ? product.sizes : product.variants?.map((variant) => variant.size) || []
  const addToBag = async () => {
    if (!selectedSize) return
    setAdded(await addItem(product, selectedSize, selectedColor, 1))
  }
  return (
    <article className="product-card" style={{ '--card-delay': `${index * 70}ms` }}>
      <div className="product-card-image-wrap">
        <Link to={`/product/${encodeURIComponent(product.id)}`} className="product-card-image-link" aria-label={`View ${product.title}`}>
          {image ? <img src={image} alt={product.imageAlt || `Men's ${product.title} T-shirt`} loading={index > 3 ? 'lazy' : 'eager'} /> : <div className="image-placeholder">DISTANT FORM</div>}
        </Link>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className={`wishlist-button ${saved ? 'is-saved' : ''}`} aria-label={saved ? `Remove ${product.title} from wishlist` : `Add ${product.title} to wishlist`} onClick={() => toggleWishlist(product)}><Heart size={17} fill={saved ? 'currentColor' : 'none'} /></button>
        <Link className="quick-view" to={`/product/${encodeURIComponent(product.id)}`}>DISCOVER <ArrowUpRight size={15} /></Link>
      </div>
      <div className="product-card-meta">
        <div><Link to={`/product/${encodeURIComponent(product.id)}`} className="product-name">{product.title}</Link><span className="product-color">{product.color}</span></div>
        <span className="product-price">{formatPrice(product.price, isShopifyConfigured ? product.currencyCode : 'INR')}</span>
      </div>
      {showQuickAdd && <div className="wishlist-quick-add">
        <label>SIZE<select aria-label={`Choose size for ${product.title}`} value={selectedSize} onChange={(event) => { setSelectedSize(event.target.value); setAdded(false) }}><option value="">Select size</option>{sizes.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
        {product.colors?.length > 1 && <label>COLOR<select aria-label={`Choose color for ${product.title}`} value={selectedColor} onChange={(event) => setSelectedColor(event.target.value)}>{product.colors.map((color) => <option key={color} value={color}>{color}</option>)}</select></label>}
        <button type="button" className="button button-outline wishlist-add-button" onClick={addToBag} disabled={!selectedSize || cartBusy}>{cartBusy ? 'ADDING…' : added ? 'ADDED TO BAG' : <><ShoppingBag size={15} /> ADD TO BAG</>}</button>
        {cartError && <span className="inline-error" role="alert">{cartError}</span>}
      </div>}
    </article>
  )
}
