import { useMemo, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'
import { useStore } from '../context/StoreContext'

export default function Shop() {
  const { products, productsLoading, productsError, isShopifyConfigured } = useStore()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('featured')
  const search = params.get('search') || ''
  const category = params.get('category') || 'All'
  const categoryOptions = ['All', ...new Set(products.map((product) => product.category).filter(Boolean))]
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) =>
      (category === 'All' || product.category === category)
      && `${product.title} ${product.description} ${product.color} ${product.category}`.toLowerCase().includes(search.toLowerCase()),
    )
    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    if (sort === 'name') result = [...result].sort((a, b) => a.title.localeCompare(b.title))
    return result
  }, [products, category, search, sort])
  const updateCategory = (value) => {
    const next = new URLSearchParams(params)
    if (value === 'All') next.delete('category')
    else next.set('category', value)
    setParams(next)
  }

  return (
    <div className="shop-page section-shell">
      <div className="shop-title-row"><div><span className="eyebrow">DISTANT FORM — MEN’S T-SHIRTS</span><h1>Shop <span>all.</span></h1></div><p>Men’s tees for every day.<br />Wear them on repeat.</p></div>
      <div className="shop-toolbar">
        <div className="filter-tabs" aria-label="Filter by category">
          {categoryOptions.map((item) => <button key={item} onClick={() => updateCategory(item)} className={category === item ? 'filter-tab active' : 'filter-tab'}>{item}</button>)}
        </div>
        <label className="sort-control"><SlidersHorizontal size={15} /><span>SORT</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label>
      </div>
      {search && <p className="search-result-label">Showing results for <strong>“{search}”</strong> <button onClick={() => { const next = new URLSearchParams(params); next.delete('search'); setParams(next) }}>CLEAR</button></p>}
      {isShopifyConfigured && <div className="storefront-label">LIVE SHOPIFY STOREFRONT</div>}
      {productsLoading ? <div className="empty-state"><span className="loading-spinner" /><h2>Pulling the collection together...</h2><p>Just a moment.</p></div>
        : productsError ? <div className="empty-state"><h2>We couldn't load the collection.</h2><p className="inline-error">{productsError}</p></div>
          : filteredProducts.length ? <><p className="results-count">{filteredProducts.length} PIECES</p><ProductGrid products={filteredProducts} /></>
            : <div className="empty-state"><h2>No matches. Yet.</h2><p>Try another search or explore the whole collection.</p><button className="button button-dark" onClick={() => { setParams({}); }}>VIEW EVERYTHING</button></div>}
    </div>
  )
}
