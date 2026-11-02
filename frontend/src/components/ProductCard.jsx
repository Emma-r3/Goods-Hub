import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import AuthModal from './AuthModal'
import { formatPrice, localized } from '../utils/format'
import { trackEvent, toGAItem } from '../utils/analytics'

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [added, setAdded] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const name = localized(product.name, lang)
  const soldOut = product.stock === 0
  const productId = product.id || product._id

  // Tambah ke keranjang + catat ke Google Analytics
  const addToCartAndTrack = () => {
    addItem(product, 1)
    trackEvent('add_to_cart', {
      currency: 'IDR',
      value: product.price,
      items: [toGAItem(product, 1)],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const handleAdd = () => {
    // Harus login dulu sebelum menambah ke keranjang
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    addToCartAndTrack()
  }

  // Setelah login lewat modal berhasil, lanjut tambah produk
  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    addToCartAndTrack()
  }

  return (
    <article className="card product-card">
      <Link to={`/products/${productId}`} className="product-card-link">
        <div
          className="product-thumb"
          style={{ background: product.bg || '#f3f4f6' }}
          role="img"
          aria-label={name}
        >
          <span aria-hidden="true">{product.emoji || '📦'}</span>
        </div>
        <div className="product-body">
          <p className="product-category">{t(`categories.${product.category}`)}</p>
          <h3 className="product-name">{name}</h3>
          <p className="product-rating">
            <span className="star" aria-hidden="true">★</span> {product.rating}
          </p>
          <p className="product-price">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <div className="product-actions">
        <button
          className={`btn btn-block ${added ? 'btn-success' : 'btn-primary'}`}
          onClick={handleAdd}
          disabled={soldOut}
        >
          {soldOut ? t('detail.outOfStock') : added ? t('detail.added') : t('detail.addToCart')}
        </button>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </article>
  )
}