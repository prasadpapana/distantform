import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductGrid from '../components/ProductGrid'

const price = (amount, currency) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR', maximumFractionDigits: 0 }).format(amount)

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, productsLoading, productsError, addItem, cartBusy, cartError, wishlist, toggleWishlist, isShopifyConfigured } = useStore()
  const product = products.find((item) => item.id === id)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const [formError, setFormError] = useState('')
  if (productsLoading) return <div className="empty-state product-loading"><span className="loading-spinner" /><h2>Loading this piece...</h2></div>
  if (productsError) return <div className="empty-state product-loading"><h2>We couldn't load this piece.</h2><p className="inline-error">{productsError}</p><Link to="/shop" className="underlined-link">BACK TO SHOP</Link></div>
  if (!product) return <div className="empty-state product-loading"><h2>That piece has moved on.</h2><Link to="/shop" className="underlined-link">BACK TO SHOP <ArrowRight size={16} /></Link></div>

  const saved = wishlist.some((item) => item.id === product.id)
  const sizes = product.sizes?.length ? product.sizes : ['One size']
  const colors = product.colors?.length ? product.colors : [product.color || 'Default']
  const color = selectedColor || colors[0]
  const matchingVariant = (size, selectedColorValue) => product.variants?.find((variant) => variant.size === size && variant.color === selectedColorValue)
  const unavailable = product.variants?.filter((variant) => !variant.availableForSale && variant.color === color).map((variant) => variant.size) || []
  const submit = async () => {
    if (!selectedSize) { setFormError('Pick your size first.'); return }
    setFormError('')
    const success = await addItem(product, selectedSize, color, quantity)
    if (success) setAdded(true)
  }

  return (
    <>
      <div className="breadcrumbs"><Link to="/shop"><ArrowLeft size={15} /> SHOP</Link><span>/</span><span>{product.title.toUpperCase()}</span></div>
      <section className="product-detail section-shell">
        <div className="product-gallery">
          <div className="product-main-image"><img src={product.images?.[activeImage] || product.images?.[0]} alt={product.imageAlt || product.title} /></div>
          <div className="product-thumbnails">{product.images?.slice(0, 4).map((image, index) => <button key={image} className={activeImage === index ? 'thumbnail active' : 'thumbnail'} onClick={() => setActiveImage(index)} aria-label={`View product image ${index + 1}`}><img src={image} alt="" /></button>)}</div>
          <div className="gallery-caption">BUILT FOR THE EVERYDAY <span>✳</span></div>
        </div>
        <div className="product-detail-info">
          <span className="eyebrow">{product.category || 'DISTANT FORM MEN’S TEES'}</span>
          <div className="detail-title-line"><h1>{product.title}</h1><button className={`detail-heart ${saved ? 'is-saved' : ''}`} aria-label="Toggle wishlist" onClick={() => toggleWishlist(product)}><Heart size={20} fill={saved ? 'currentColor' : 'none'} /></button></div>
          <div className="detail-price-line"><strong>{price(product.price, isShopifyConfigured ? product.currencyCode : 'INR')}</strong>{product.compareAt && <del>{price(product.compareAt, 'INR')}</del>}</div>
          <div className="detail-divider" />
          <p className="detail-description">{product.description}</p>
          <div className="color-choice"><div className="selection-label">COLOR <span>{color}</span></div><div className="color-options">{colors.map((option) => <button type="button" key={option} className={`color-swatch-button ${color === option ? 'selected' : ''}`} onClick={() => { setSelectedColor(option); setSelectedSize(''); setFormError('') }} aria-label={`Choose ${option}`} aria-pressed={color === option}><span className="color-swatch" style={{ backgroundColor: option === product.color ? product.colorHex : '#d8d8d3' }} /></button>)}</div></div>
          <div className="size-choice">
            <div className="selection-label">SELECT SIZE <button type="button" onClick={() => setFormError('Our fit is relaxed. If you like a closer fit, size down.')}>SIZE GUIDE</button></div>
            <div className="size-options">{sizes.map((size) => {
              const variant = matchingVariant(size, color)
              const soldOut = unavailable.includes(size) || (product.variants && !variant)
              return <button type="button" key={size} disabled={soldOut} onClick={() => { setSelectedSize(size); setFormError('') }} className={`${selectedSize === size ? 'selected' : ''} ${soldOut ? 'sold-out' : ''}`}>{size}</button>
            })}</div>
          </div>
          <div className="add-row">
            <div className="quantity-selector"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(Math.min(10, quantity + 1))}><Plus size={14} /></button></div>
            <button type="button" className="button button-blue add-button" onClick={submit} disabled={cartBusy || (isShopifyConfigured && !product.variants?.length)}>{cartBusy ? 'ADDING...' : added ? <><Check size={17} /> ADDED TO BAG</> : <><ShoppingBag size={17} /> ADD TO BAG</>}</button>
          </div>
          {(formError || cartError) && <p className="inline-error detail-error">{formError || cartError}</p>}
          {added && <Link to="/cart" className="added-link">IN YOUR BAG — VIEW BAG <ArrowRight size={15} /></Link>}
          <div className="detail-perks"><p><span>01</span> Thoughtfully made, made to last.</p><p><span>02</span> Easy 7-day returns on unworn pieces.</p><p><span>03</span> {isShopifyConfigured ? 'Shipping options shown at checkout.' : 'Free shipping over ₹2,499.'}</p></div>
          <div className="product-accordions"><details><summary>FIT & FABRIC <Plus size={15} /></summary><p>Relaxed, easy fit. Premium cotton with a soft, substantial hand feel. For exact measurements, use the size guide before ordering.</p></details><details><summary>CARE INSTRUCTIONS <Plus size={15} /></summary><p>Wash inside out with similar colors. Cold wash, gentle cycle. Do not bleach. Hang dry to keep your tee looking its best.</p></details></div>
        </div>
      </section>
      <section className="section-shell related-products"><div className="section-heading"><div><span className="eyebrow">GOOD COMPANY</span><h2>Goes well <span>with.</span></h2></div><Link className="underlined-link" to="/shop">SHOP ALL <ArrowRight size={16} /></Link></div><ProductGrid products={products.filter((item) => item.id !== product.id).slice(0, 4)} /></section>
    </>
  )
}
