const GA_ID = import.meta.env.VITE_GA_ID

// Load gtag.js once. Does nothing if VITE_GA_ID is not set (e.g. local dev).
export function initGA() {
  if (!GA_ID || window.gtag) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // Page views are sent manually on route change
  window.gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageView(path) {
  if (!window.gtag) return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (!window.gtag) return
  window.gtag('event', name, params)
}

// Convert a product or cart item into the GA4 "items" format
export function toGAItem(p, quantity = 1) {
  const name = typeof p.name === 'string' ? p.name : p.name?.en
  return {
    item_id: String(p._id || p.id),
    item_name: name,
    item_category: p.category,
    price: p.price,
    quantity,
  }
}