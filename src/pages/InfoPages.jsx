import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Instagram, Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import RevealOnScroll from '../components/RevealOnScroll'

function PageIntro({ eyebrow, title, copy }) {
  return <div className="info-hero"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div>
}

export function About() {
  return (
    <div className="info-page">
      <PageIntro eyebrow="A LITTLE ABOUT US" title={<>We believe in<br /><span>the everyday.</span></>} copy="The best things aren't always the loudest. Sometimes they're just the ones you reach for, again and again." />
      <RevealOnScroll as="section" className="about-story section-shell"><div className="about-image"><img src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1300&q=85" alt="Man wearing a graphic T-shirt" /></div><div className="about-copy"><span className="eyebrow">THE DISTANT FORM IDEA</span><h2>Less noise.<br /><span>More you.</span></h2><p>DISTANT FORM started with a simple thought: what if the tee you wore on an ordinary Tuesday felt like the best thing in your wardrobe?</p><p>So we made the essentials we couldn't find—considered shapes, quality you can feel, and just enough character to say something without saying too much.</p><p>Designed in India. Made for wherever the day takes you.</p><Link to="/shop" className="underlined-link">MEET YOUR NEW FAVORITE <ArrowRight size={16} /></Link></div></RevealOnScroll>
      <RevealOnScroll as="section" className="values-strip"><div><span>01</span><h3>GOOD BY DESIGN</h3><p>Thoughtful details. Nothing extra for the sake of it.</p></div><div><span>02</span><h3>MADE TO REPEAT</h3><p>Comfort that gets better with every wear.</p></div><div><span>03</span><h3>ALWAYS YOURS</h3><p>Easy pieces that let you be the whole point.</p></div></RevealOnScroll>
      <RevealOnScroll as="section" className="about-bottom"><span className="blue-star">✳</span><p>It's not about dressing up.<br /><strong>It's about showing up as you.</strong></p><Link to="/shop" className="button button-light">SHOP DISTANT FORM <ArrowUpRight size={16} /></Link></RevealOnScroll>
    </div>
  )
}

export function Contact() {
  const [sent, setSent] = useState(false)
  const submit = (event) => { event.preventDefault(); setSent(true) }
  return (
    <div className="info-page contact-page section-shell">
      <PageIntro eyebrow="WE'RE ALL EARS" title={<>Let's talk<br /><span>thread.</span></>} copy="A question, a thought, a really good playlist recommendation? We're here for all of it." />
      <div className="contact-layout"><div className="contact-details"><a href="mailto:hello@distantform.example"><Mail size={18} /><span><small>DROP US A NOTE</small>hello@distantform.example</span><ArrowUpRight size={16} /></a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={18} /><span><small>FIND US ON INSTAGRAM</small>@distantform.studio</span><ArrowUpRight size={16} /></a><div className="contact-response"><span className="blue-star">✳</span><p>Real people, real replies.<br />Usually within 1–2 business days.</p></div><div className="contact-location"><MapPin size={17} /> DESIGNED IN INDIA, WORN EVERYWHERE.</div></div>
        <form className="contact-form" onSubmit={submit}><span className="eyebrow">SEND A MESSAGE</span><label>Your name<input required name="name" placeholder="What should we call you?" /></label><label>Email address<input required name="email" type="email" placeholder="you@example.com" /></label><label>What's on your mind?<textarea required name="message" rows="4" placeholder="Tell us a little more..." /></label><button className="button button-dark" type="submit">{sent ? 'MESSAGE READY — THANK YOU' : 'SEND YOUR NOTE'} <ArrowRight size={16} /></button>{sent && <p className="form-success">Thanks for reaching out! This demo form doesn't send messages yet. Please email hello@distantform.example directly.</p>}</form></div>
    </div>
  )
}

const faqs = [
  ['How does DISTANT FORM fit?', 'Our men’s tees have a relaxed, everyday fit with a little extra room. Choose your usual size for the intended look, or size down for a closer fit. The product page includes a size guide tip.'],
  ['What are your tees made from?', 'Our sample collection uses premium-feel cotton. For live products, check the garment details on each product page and the product information provided by the Shopify store.'],
  ['How long does shipping take?', 'Orders are typically processed within 1–2 business days. Delivery times depend on your location and are confirmed at checkout. See our shipping page for details.'],
  ['Can I return or exchange an item?', 'Unworn pieces with tags attached can be returned within 7 days of delivery. See the returns page for eligibility and how to get in touch.'],
  ['How do I care for my tee?', 'Wash inside out with similar colors on a gentle, cold cycle. Avoid bleach and hang dry when possible.'],
  ['Can I change or cancel my order?', 'Get in touch as soon as you can. We will do our best to help if your order has not been processed or shipped yet.'],
]

export function FAQ() {
  return <div className="faq-page section-shell"><PageIntro eyebrow="THE QUICK ANSWERS" title={<>Good to<br /><span>know.</span></>} copy="The little details, all in one place. Still wondering? Get in touch and a real person will help." /><div className="faq-list">{faqs.map(([question, answer], index) => <details key={question}><summary><span><i>0{index + 1}</i>{question}</span><span className="faq-plus">+</span></summary><p>{answer}</p></details>)}</div><p className="faq-contact">Didn't find your answer? <Link to="/contact">Talk to a human <ArrowUpRight size={14} /></Link></p></div>
}

export function Shipping() {
  return <div className="info-page policy-page section-shell"><PageIntro eyebrow="THE JOURNEY TO YOU" title={<>On its way<br /><span>to you.</span></>} copy="Good things are worth a little wait. Here's what to expect once your DISTANT FORM order is on its way." /><div className="policy-content"><div><span>01</span><h2>Processing</h2><p>We aim to prepare orders within 1–2 business days. You will receive shipping information after an order is fulfilled by the connected store.</p></div><div><span>02</span><h2>Delivery</h2><p>Delivery times and available destinations depend on the Shopify store's shipping settings. Any shipping charges are shown at checkout before you place an order.</p></div><div><span>03</span><h2>A little treat</h2><p>In this demo design, free shipping is highlighted on orders over ₹2,499. Your real store should confirm rates and thresholds in Shopify before launch.</p></div><div className="policy-note"><span className="blue-star">✳</span><p>Have a question about an order? <Link to="/contact">Get in touch <ArrowUpRight size={14} /></Link></p></div></div></div>
}

export function Returns() {
  return <div className="info-page policy-page section-shell"><PageIntro eyebrow="NO HARD FEELINGS" title={<>Not quite<br /><span>your thing?</span></>} copy="We get it. Sometimes a fit just isn't the one. Here's how returns are designed to work." /><div className="policy-content"><div><span>01</span><h2>Try it on</h2><p>Keep items unworn, unwashed, and with original tags attached. Please keep the packaging until you know you're keeping the piece.</p></div><div><span>02</span><h2>Reach out</h2><p>Contact the store within 7 days of delivery with your order number and the item you'd like to return. The seller will confirm whether it qualifies.</p></div><div><span>03</span><h2>We’ll help</h2><p>Return shipping, refunds, exchanges, and eligible conditions are handled by the Shopify store. Check the store's current returns policy before ordering.</p></div><div className="policy-note"><span className="blue-star">✳</span><p>This is a sample policy page. <Link to="/contact">Ask us a question <ArrowUpRight size={14} /></Link></p></div></div></div>
}
