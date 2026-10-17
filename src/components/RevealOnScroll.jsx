import { useEffect, useRef, useState } from 'react'

export default function RevealOnScroll({ children, className = '', as: Element = 'div', id }) {
  const elementRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) {
      setVisible(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <Element id={id} ref={elementRef} className={`scroll-reveal ${visible ? 'is-revealed' : ''} ${className}`}>{children}</Element>
}
