import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { lang, setLang, t } = useLanguage()
  const { totalItems } = useCart()

  const closeMenu = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <span aria-hidden="true">🛍️</span> Goods Hub
        </Link>

        <nav
          id="main-menu"
          className={`nav-links ${open ? 'open' : ''}`}
          aria-label="Main"
        >
          <NavLink to="/" end className="nav-link" onClick={closeMenu}>
            {t('nav.home')}
          </NavLink>
          <NavLink to="/products" className="nav-link" onClick={closeMenu}>
            {t('nav.products')}
          </NavLink>
          <NavLink to="/orders" className="nav-link" onClick={closeMenu}>
            {t('nav.orders')}
          </NavLink>
        </nav>

        <div className="nav-actions">
          <div className="lang-switch" role="group" aria-label={t('common.language')}>
            <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
              EN
            </button>
            <button aria-pressed={lang === 'id'} onClick={() => setLang('id')}>
              ID
            </button>
          </div>

          <Link to="/cart" className="icon-btn" aria-label={t('nav.cart')} onClick={closeMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          <button
            className="icon-btn menu-toggle"
            aria-label={t('nav.menu')}
            aria-expanded={open}
            aria-controls="main-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}