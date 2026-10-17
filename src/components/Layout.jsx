import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { useStore } from '../context/StoreContext'

export default function Layout() {
  const { isShopifyConfigured } = useStore()
  return (
    <div className="min-h-screen">
      <div className="announcement">
        <span>DISTANT FORM — MEN’S EVERYDAY T-SHIRTS</span>
        <span className="announcement-dot">●</span>
        <span>{isShopifyConfigured ? 'SHIPPING OPTIONS AT CHECKOUT' : 'FREE SHIPPING ON ORDERS OVER ₹2,499'}</span>
      </div>
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </div>
  )
}
