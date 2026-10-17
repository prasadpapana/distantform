import { useState } from 'react'
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const formatPrice = (amount, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
const initialAddress = { fullName: '', mobile: '', streetAddress: '', city: '', state: '', pinCode: '' }
const indianStates = [
  ['AN', 'Andaman and Nicobar Islands'], ['AP', 'Andhra Pradesh'], ['AR', 'Arunachal Pradesh'], ['AS', 'Assam'],
  ['BR', 'Bihar'], ['CH', 'Chandigarh'], ['CT', 'Chhattisgarh'], ['DN', 'Dadra and Nagar Haveli and Daman and Diu'],
  ['DL', 'Delhi'], ['GA', 'Goa'], ['GJ', 'Gujarat'], ['HR', 'Haryana'], ['HP', 'Himachal Pradesh'],
  ['JK', 'Jammu and Kashmir'], ['JH', 'Jharkhand'], ['KA', 'Karnataka'], ['KL', 'Kerala'], ['LA', 'Ladakh'],
  ['LD', 'Lakshadweep'], ['MP', 'Madhya Pradesh'], ['MH', 'Maharashtra'], ['MN', 'Manipur'], ['ML', 'Meghalaya'],
  ['MZ', 'Mizoram'], ['NL', 'Nagaland'], ['OR', 'Odisha'], ['PY', 'Puducherry'], ['PB', 'Punjab'],
  ['RJ', 'Rajasthan'], ['SK', 'Sikkim'], ['TN', 'Tamil Nadu'], ['TS', 'Telangana'], ['TR', 'Tripura'],
  ['UP', 'Uttar Pradesh'], ['UT', 'Uttarakhand'], ['WB', 'West Bengal'],
]

export default function Cart() {
  const { cart, cartError, cartBusy, updateQuantity, removeItem, checkout, isShopifyConfigured } = useStore()
  const [address, setAddress] = useState(initialAddress)
  const [formErrors, setFormErrors] = useState({})
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const updateAddress = (event) => {
    const { name, value } = event.target
    setAddress((current) => ({ ...current, [name]: name === 'mobile' ? value.replace(/\D/g, '').slice(0, 10) : value }))
    setFormErrors((current) => ({ ...current, [name]: '' }))
    setCheckoutMessage('')
  }
  const onCheckout = async (event) => {
    event.preventDefault()
    const errors = {}
    for (const field of ['fullName', 'mobile', 'streetAddress', 'city', 'state', 'pinCode']) {
      if (!address[field].trim()) errors[field] = 'This field is required.'
    }
    if (address.fullName.trim() && address.fullName.trim().length < 2) errors.fullName = 'Enter your full name.'
    if (address.mobile && !/^[6-9]\d{9}$/.test(address.mobile)) errors.mobile = 'Enter a valid 10-digit Indian mobile number.'
    if (address.pinCode && !/^[1-9]\d{5}$/.test(address.pinCode.trim())) errors.pinCode = 'Enter a valid 6-digit Indian PIN code.'
    setFormErrors(errors)
    setCheckoutMessage('')
    if (Object.keys(errors).length) return
    const success = await checkout(address)
    if (!success && !isShopifyConfigured) setCheckoutMessage('Guest checkout is not connected yet. Configure the Shopify Storefront API in .env.local; the address has not been sent or saved.')
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
        <aside className="order-summary">
          <span className="eyebrow">THE NUMBERS</span><h2>Order <span>summary.</span></h2>
          <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(subtotal, isShopifyConfigured ? cart.items[0]?.product.currencyCode : 'INR')}</strong></div>
          <div className="summary-row"><span>Shipping</span><span>{isShopifyConfigured ? 'AT CHECKOUT' : 'CALCULATED AT CHECKOUT'}</span></div>
          <p className="shipping-progress">{isShopifyConfigured ? 'Available shipping rates appear at Shopify checkout.' : 'Demo mode: checkout is unavailable until Shopify Storefront API settings are added.'}</p>
          <form className="shipping-address-form" onSubmit={onCheckout} noValidate>
            <span className="eyebrow">GUEST DELIVERY ADDRESS</span>
            <label>Full name<input name="fullName" autoComplete="name" value={address.fullName} onChange={updateAddress} aria-invalid={Boolean(formErrors.fullName)} /></label>
            {formErrors.fullName && <span className="field-error">{formErrors.fullName}</span>}
            <label>Mobile number<div className="phone-input"><span>+91</span><input name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" value={address.mobile} onChange={updateAddress} maxLength={10} aria-invalid={Boolean(formErrors.mobile)} /></div></label>
            {formErrors.mobile && <span className="field-error">{formErrors.mobile}</span>}
            <label>House / street address<textarea name="streetAddress" autoComplete="street-address" rows={2} value={address.streetAddress} onChange={updateAddress} aria-invalid={Boolean(formErrors.streetAddress)} /></label>
            {formErrors.streetAddress && <span className="field-error">{formErrors.streetAddress}</span>}
            <label>City<input name="city" autoComplete="address-level2" value={address.city} onChange={updateAddress} aria-invalid={Boolean(formErrors.city)} /></label>
            {formErrors.city && <span className="field-error">{formErrors.city}</span>}
            <label>State<select name="state" autoComplete="address-level1" value={address.state} onChange={updateAddress} aria-invalid={Boolean(formErrors.state)}><option value="">Choose your state</option>{indianStates.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></label>
            {formErrors.state && <span className="field-error">{formErrors.state}</span>}
            <label>PIN code<input name="pinCode" inputMode="numeric" autoComplete="postal-code" value={address.pinCode} onChange={updateAddress} maxLength={6} aria-invalid={Boolean(formErrors.pinCode)} /></label>
            {formErrors.pinCode && <span className="field-error">{formErrors.pinCode}</span>}
            <button className="button button-blue checkout-button" type="submit" disabled={cartBusy}>{cartBusy ? 'CONNECTING TO SHOPIFY...' : <>CONTINUE AS GUEST <ArrowRight size={17} /></>}</button>
          </form>
          {(checkoutMessage || cartError) && <p className={isShopifyConfigured ? 'inline-error checkout-feedback' : 'demo-message checkout-feedback'} role="alert">{checkoutMessage || cartError}</p>}
          <p className="checkout-note">Your address is sent securely to Shopify only when continuing to checkout. It is not saved in this browser.</p>
        </aside>
      </div>
    </div>
  )
}
