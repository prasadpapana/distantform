import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="not-found section-shell">
      <span className="eyebrow">WRONG TURN, GOOD TASTE</span>
      <p className="not-found-code">404</p>
      <h1>This page took<br /><span>another route.</span></h1>
      <p className="not-found-copy">The page you’re looking for isn’t here. The good stuff is.</p>
      <div className="not-found-actions">
        <Link className="button button-light" to="/"><ArrowLeft size={16} /> BACK HOME</Link>
        <Link className="button button-outline" to="/shop">SHOP T-SHIRTS <ArrowRight size={16} /></Link>
      </div>
    </section>
  )
}
