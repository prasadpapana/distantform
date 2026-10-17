import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ArrowRight, Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { cart, wishlist } = useStore()
  const count = cart.items.reduce((total, item) => total + item.quantity, 0)
  const submitSearch = (event) => {
    event.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(search.trim())}`)
    setSearchOpen(false)
    setSearch('')
  }
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <div className="nav-inner">
        <button className="icon-button mobile-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Link to="/" className="wordmark" aria-label="DISTANT FORM home">DISTANT FORM<span className="wordmark-period">.</span></Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <NavLink to="/shop" onClick={closeMenu}>Shop all</NavLink>
          <NavLink to="/shop?category=Graphic+tees" onClick={closeMenu}>Graphic tees</NavLink>
          <NavLink to="/shop?category=Essential+tees" onClick={closeMenu}>Essential tees</NavLink>
          <NavLink to="/about" onClick={closeMenu}>Our story</NavLink>
        </nav>
        <div className="nav-actions">
          <button className="icon-button" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search products"><Search size={19} /></button>
          <Link className="icon-button wishlist-nav" to="/wishlist" aria-label={`Wishlist, ${wishlist.length} items`}><Heart size={19} />{wishlist.length > 0 && <span className="icon-count">{wishlist.length}</span>}</Link>
          <Link className="icon-button cart-nav" to="/cart" aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={19} />{count > 0 && <span className="icon-count">{count}</span>}</Link>
        </div>
      </div>
      {searchOpen && (
        <form className="search-panel" onSubmit={submitSearch}>
          <Search size={18} />
          <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the collection..." aria-label="Search the collection" />
          <button className="text-button" type="submit">SEARCH <ArrowRight size={15} /></button>
        </form>
      )}
    </header>
  )
}
