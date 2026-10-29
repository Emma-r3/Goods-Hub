import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { FREE_SHIPPING_THRESHOLD } from '../context/CartProvider'
import { formatPrice, localized } from '../utils/format'
import AuthModal from '../components/AuthModal'

export default function Cart() {
  const { lang, t } = useLanguage()
  const {
    items, totalItems, subtotal, shipping, total,
    updateQty, removeItem, clearCart,
  } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    navigate('/checkout')
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="container section">
        <h1>{t('cart.title')}</h1>
        <div className="card empty-state" style={{ marginTop: '1.5rem' }}>
          <span className="emoji" aria-hidden="true">🛒</span>
          <p>{t('cart.empty')}</p>
          <Link to="/products" className="btn btn-primary">
            {t('cart.startShopping')}
          </Link>
        </div>
      </div>
    )
  }

  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="container section">
      <h1>
        {t('cart.title')}{' '}
        <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}>
          ({t('cart.items', { count: totalItems })})
        </span>
      </h1>

      <div className="cart-layout">
        {/* Item list */}
        <div>
          <ul className="cart-list">
            {items.map((item) => {
              const name = localized(item.name, lang)
              return (
                <li key={item.id} className="card cart-item">
                  <Link to={`/products/${item.id}`}>
                    <div
                      className="cart-thumb"
                      style={{ background: item.bg }}
                      role="img"
                      aria-label={name}
                    >
                      <span aria-hidden="true">{item.emoji}</span>
                    </div>
                  </Link>

                  <div className="cart-item-info">
                    <h3>
                      <Link to={`/products/${item.id}`}>{name}</Link>
                    </h3>
                    <p className="cart-unit-price">
                      {formatPrice(item.price)} {t('cart.each')}
                    </p>
                  </div>

                  <div className="cart-item-controls">
                    <div className="qty-stepper" role="group" aria-label={name}>
                      <button
                        aria-label={t('detail.decrease')}
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                      >
                        −
                      </button>
                      <span className="qty-value" aria-live="polite">{item.qty}</span>
                      <button
                        aria-label={t('detail.increase')}
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        disabled={item.qty >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <span className="cart-line-total">
                      {formatPrice(item.price * item.qty)}
                    </span>
                    <button className="btn-link" onClick={() => removeItem(item.id)}>
                      {t('cart.remove')}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="cart-footer-actions" style={{ marginTop: '1rem' }}>
            <Link to="/products" className="link-more">
              ← {t('cart.continueShopping')}
            </Link>
            <button className="btn-link" onClick={clearCart}>
              {t('cart.clear')}
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="card summary">
          <h2>{t('cart.summary')}</h2>

          <div className="ship-progress">
            {remaining > 0
              ? t('cart.freeShippingLeft', { amount: formatPrice(remaining) })
              : t('cart.freeShippingUnlocked')}
            <div className="ship-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="summary-row">
            <span>{t('cart.subtotal')}</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>{t('cart.shipping')}</span>
            <span>{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button
            className="btn btn-primary btn-block"
            onClick={handleCheckout}
          >
            {t('cart.checkout')}
          </button>
        </aside>
      </div>

      {/* Auth Modal Popup */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  )
}
