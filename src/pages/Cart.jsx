import { useState } from 'react'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const formatPrice = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

export default function Cart() {
  const { cart, cartError, cartBusy, updateQuantity, removeItem, checkout, isShopifyConfigured } = useStore()
  const [demoMessage, setDemoMessage] = useState('')
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const onCheckout = () => {
    if (!isShopifyConfigured) setDemoMessage('Demo mode: checkout is not connected. Configure a Shopify Storefront API to enable real checkout.')
    else { setDemoMessage(''); checkout() }
  }
  if (!cart.items.length) return (
    <div className="empty-state cart-empty"><span className="empty-icon"><ShoppingBag size={25} /></span><span className="eyebrow">NOTHING IN HERE (YET)</span><h1>Your bag is <span>waiting.</span></h1><p>Good things are just a click away.</p><Link to="/shop" className="button button-blue">FIND YOUR FIT <ArrowRight size={17} /></Link></div>
  )
  return (
    <div className="cart-page section-shell">
      <div className="cart-title"><div><span className="eyebrow">YOUR GOOD FINDS</span><h1>Your <span>bag.</span></h1></div><Link to="/shop" className="underlined-link"><ArrowLeft size={15} /> KEEP LOOKING</Link></div>
      {!isShopifyConfigured && <div className="demo-banner"><span className="blue-star">✳</span> DEMO MODE — Your bag is saved in this browser. Checkout isn't connected yet.</div>}
      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-table-head"><span>ITEM</span><span>QUANTITY</span><span>TOTAL</span></div>
          {cart.items.map((item) => {
            const lineTotal = item.product.price * item.quantity
            return <article className="cart-item" key={item.key || item.lineId}>
              <Link to={`/product/${encodeURIComponent(item.product.id)}`} className="cart-item-image"><img src={item.product.images?.[0]} alt={item.product.title} /></Link>
              <div className="cart-item-info"><Link to={`/product/${encodeURIComponent(item.product.id)}`} className="cart-item-name">{item.product.title}</Link><span>{item.color || item.product.color} / {item.size}</span><span>{formatPrice(item.product.price, isShopifyConfigured ? item.product.currencyCode : 'INR')}</span><button className="remove-item" onClick={() => removeItem(item)} disabled={cartBusy}><Trash2 size={14} /> REMOVE</button></div>
              <div className="quantity-selector cart-quantity"><button aria-label="Decrease quantity" onClick={() => updateQuantity(item, item.quantity - 1)} disabled={cartBusy}><Minus size={13} /></button><span>{item.quantity}</span><button aria-label="Increase quantity" onClick={() => updateQuantity(item, item.quantity + 1)} disabled={cartBusy}><Plus size={13} /></button></div>
              <strong className="cart-line-price">{formatPrice(lineTotal, isShopifyConfigured ? item.product.currencyCode : 'INR')}</strong>
            </article>
          })}
          {cartError && <p className="inline-error cart-error">{cartError}</p>}
        </div>
        <aside className="order-summary"><span className="eyebrow">THE NUMBERS</span><h2>Order <span>summary.</span></h2><div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal, isShopifyConfigured ? cart.items[0]?.product.currencyCode : 'INR')}</strong></div><div className="summary-row"><span>Shipping</span><span>{isShopifyConfigured ? 'AT CHECKOUT' : subtotal >= 2499 ? 'ON US' : 'CALCULATED AT CHECKOUT'}</span></div><p className="shipping-progress">{isShopifyConfigured ? 'Available shipping rates appear at Shopify checkout.' : subtotal >= 2499 ? 'You unlocked free shipping. Nice.' : `Add ${formatPrice(2499 - subtotal)} for free shipping.`}</p><button className="button button-blue checkout-button" onClick={onCheckout} disabled={cartBusy}>{cartBusy ? 'UPDATING BAG...' : <>CONTINUE TO CHECKOUT <ArrowRight size={17} /></>}</button>{demoMessage && <p className="demo-message">{demoMessage}</p>}<p className="checkout-note">Secure checkout powered by Shopify when connected. No payment is taken in demo mode.</p></aside>
      </div>
    </div>
  )
}
