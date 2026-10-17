import { ArrowRight, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useStore } from '../context/StoreContext'

export default function Wishlist() {
  const { wishlist } = useStore()
  return (
    <div className="wishlist-page section-shell">
      <div className="page-heading"><span className="eyebrow">THE ONES YOU LOVE</span><h1>Your <span>wishlist.</span></h1><p>Good taste. We'll keep these close.</p></div>
      {wishlist.length ? <ProductGrid products={wishlist} /> : <div className="empty-state"><span className="empty-icon"><Heart size={24} /></span><h2>Keep the good ones close.</h2><p>Tap the heart on anything you love and find it here later.</p><Link to="/shop" className="button button-dark">FIND YOUR FAVORITES <ArrowRight size={16} /></Link></div>}
    </div>
  )
}
