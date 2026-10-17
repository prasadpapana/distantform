import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { bestSellers, categories, newArrivals } from '../data/products'
import { useStore } from '../context/StoreContext'

export default function Home() {
  const { products, productsLoading, productsError } = useStore()
  const featured = products.length ? products : bestSellers
  const fresh = products.length ? products.slice(-4).reverse() : newArrivals
  const shopCategories = [...new Set((products.length ? products : categories.slice(1).map((category, index) => ({ category, id: index }))).map((product) => typeof product === 'string' ? product : product.category))].slice(0, 2)
  return (
    <>
      <section className="hero">
        <img className="hero-image" src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=2200&q=90" alt="Streetwear collection in a sunlit city" />
        <div className="hero-shade" />
        <div className="hero-content">
          <div className="eyebrow hero-eyebrow"><span className="eyebrow-mark">✳</span> DISTANT FORM — MEN’S EVERYDAY TEES</div>
          <h1>T-Shirts<br />That <span>Speak.</span></h1>
          <p>For the ones who never needed<br />to say too much.</p>
          <Link to="/shop" className="button button-blue">SHOP THE COLLECTION <ArrowUpRight size={17} /></Link>
        </div>
        <div className="hero-note">01 / 04 <span className="hero-note-line" /> A NEW KIND OF EVERYDAY</div>
        <a className="hero-scroll" href="#collection"><ArrowDown size={16} /> SCROLL TO EXPLORE</a>
      </section>

      <section className="category-section section-shell" id="collection">
        <div className="section-heading"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Find your <span>kind.</span></h2></div><Link to="/shop" className="underlined-link">SHOP EVERYTHING <ArrowRight size={16} /></Link></div>
        <div className="category-grid">
          {shopCategories.map((category, index) => (
            <Link key={category} to={`/shop?category=${encodeURIComponent(category)}`} className={`category-tile category-tile-${index + 1}`}>
              <img src={index === 0 ? 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1100&q=85' : 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1100&q=85'} alt={`${category} collection`} loading="lazy" />
              <span className="category-index">0{index + 1} / 02</span><span className="category-name">{category}</span><span className="category-arrow"><ArrowUpRight size={20} /></span>
            </Link>
          ))}
          <Link to="/shop" className="category-tile category-tile-all">
            <div className="category-copy"><span className="eyebrow">THE FULL LINEUP</span><strong>Good<br />things<br />only.</strong><span className="category-cta">DISCOVER ALL <ArrowRight size={15} /></span></div>
            <span className="category-index">03 / 03</span>
          </Link>
        </div>
      </section>

      <section className="products-section section-shell section-dark">
        <div className="section-heading"><div><span className="eyebrow">THE PEOPLE HAVE SPOKEN</span><h2>Most <span>loved.</span></h2></div><Link to="/shop" className="underlined-link">SHOP BESTSELLERS <ArrowRight size={16} /></Link></div>
        {productsLoading ? <p className="loading-note">Finding your new favorites...</p> : productsError ? <div className="inline-error">{productsError}</div> : <ProductGrid products={featured.slice(0, 4)} />}
      </section>

      <section className="manifesto">
        <span className="eyebrow">NOT JUST ANOTHER TEE</span>
        <h2>Made for the<br /><span>in-between.</span></h2>
        <p>The coffee run. The long way home.<br />The plans that turn into stories.</p>
        <Link to="/about" className="button button-dark">GET TO KNOW US <ArrowUpRight size={17} /></Link>
        <div className="manifesto-stamp">DISTANT FORM<br /><span>MEN’S TEES. EVERY DAY.</span></div>
      </section>

      <section className="products-section section-shell arrivals-section">
        <div className="section-heading"><div><span className="eyebrow">FRESH OFF THE PRESS</span><h2>Just <span>dropped.</span></h2></div><Link to="/shop" className="underlined-link">SEE WHAT'S NEW <ArrowRight size={16} /></Link></div>
        {productsLoading ? <p className="loading-note">Loading the latest drop...</p> : <ProductGrid products={fresh.slice(0, 4)} />}
      </section>
      <section className="quote-strip"><span className="blue-star">✳</span><p>“Finally, a tee that gets me.”</p><span>THE DISTANT FORM COMMUNITY</span></section>
    </>
  )
}
