import { useState } from 'react'
import { ArrowUpRight, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const submit = (event) => {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="wordmark footer-wordmark">DISTANT FORM<span className="wordmark-period">.</span></Link>
          <p>Good clothes. Good energy.<br />Nothing to prove.</p>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="social-link"><Instagram size={16} /> FOLLOW ALONG <ArrowUpRight size={14} /></a>
        </div>
        <div className="footer-links">
          <div><h3>EXPLORE</h3><Link to="/shop">Shop all</Link><Link to="/shop?category=Graphic+tees">Graphic tees</Link><Link to="/shop?category=Essential+tees">Essential tees</Link><Link to="/about">Our story</Link></div>
          <div><h3>HERE TO HELP</h3><Link to="/contact">Contact</Link><Link to="/faq">FAQs</Link><Link to="/shipping">Shipping</Link><Link to="/returns">Returns</Link></div>
        </div>
        <div className="newsletter">
          <h3>GOOD THINGS, OCCASIONALLY.</h3>
          <p>First dibs on new drops, plus a little something for your first order.</p>
          {subscribed ? <div className="newsletter-success">You're on the list. See you in your inbox.</div> : (
            <form onSubmit={submit} className="newsletter-form">
              <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" aria-label="Your email address" />
              <button type="submit" aria-label="Subscribe to newsletter"><ArrowUpRight size={20} /></button>
            </form>
          )}
          <span className="fine-print">By subscribing, you agree to our privacy policy. No spam, ever.</span>
        </div>
      </div>
      <div className="footer-bottom"><span>© 2025 DISTANT FORM STUDIO. MADE FOR EVERY DAY.</span><span>DESIGNED IN INDIA <span className="blue-star">✳</span></span><Link to="/faq">PRIVACY & TERMS</Link></div>
    </footer>
  )
}
