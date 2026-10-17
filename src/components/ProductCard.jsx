import { ArrowUpRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const formatPrice = (amount, currencyCode = 'INR') => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: currencyCode,
  maximumFractionDigits: 0,
}).format(amount)

export default function ProductCard({ product, index = 0 }) {
  const { wishlist, toggleWishlist, isShopifyConfigured } = useStore()
  const saved = wishlist.some((item) => item.id === product.id)
  const image = product.images?.[0]
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
    </article>
  )
}
