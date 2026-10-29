import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import ProductCard from '../components/ProductCard'
import AuthModal from '../components/AuthModal'
import { products as fallbackProducts, getProductById as getFallbackProduct } from '../data/products'
import { formatPrice, localized } from '../utils/format'
import api from '../utils/api'

function ProductView({ product, allProducts }) {
  const { lang, t } = useLanguage()
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const name = localized(product.name, lang)
  const desc = localized(product.description, lang)
  const soldOut = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 10

  // Related products
  const pool = allProducts?.length > 0 ? allProducts : fallbackProducts
  const related = [
    ...pool.filter((p) => p.category === product.category && (p.id !== product.id && p._id !== product._id)),
    ...pool.filter((p) => p.category !== product.category),
  ].slice(0, 4)

  const handleAdd = () => {
    // Require login to add to cart
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // After successful login via modal, proceed to add item
  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="container section">
      <Link to="/products" className="back-link">
        ← {t('detail.backToProducts')}
      </Link>

      <div className="detail-grid">
        <div
          className="detail-image"
          style={{ background: product.bg || '#f3f4f6' }}
          role="img"
          aria-label={name}
        >
          <span aria-hidden="true">{product.emoji || '📦'}</span>
        </div>

        <div className="detail-info">
          <p className="text-muted">{t(`categories.${product.category}`)}</p>
          <h1>{name}</h1>
          <p className="product-rating">
            <span className="star" aria-hidden="true">★</span> {product.rating}
          </p>
          <p className="detail-price">{formatPrice(product.price)}</p>

          {soldOut ? (
            <span className="stock-status out">{t('detail.outOfStock')}</span>
          ) : lowStock ? (
            <span className="stock-status low">
              {t('detail.stockLeft', { count: product.stock })}
            </span>
          ) : (
            <span className="stock-status in">{t('detail.inStock')}</span>
          )}

          <p className="detail-desc">{desc}</p>

          <div className="add-to-cart-box">
            <div className="qty-picker" role="group" aria-label={t('detail.quantity')}>
              <button
                type="button"
                className="qty-btn"
                aria-label={t('detail.decrease')}
                disabled={qty <= 1 || soldOut}
                onClick={() => setQty((q) => Math.max(1, q - 1))}
              >
                −
              </button>
              <span className="qty-value" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                className="qty-btn"
                aria-label={t('detail.increase')}
                disabled={qty >= product.stock || soldOut}
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn btn-primary add-btn"
              disabled={soldOut}
              onClick={handleAdd}
            >
              {added ? t('detail.added') : t('detail.addToCart')}
            </button>
          </div>

          {added && (
            <p className="added-notice" role="status">
              <Link to="/cart" className="link-more">
                {t('detail.viewCart')} →
              </Link>
            </p>
          )}
        </div>
      </div>

      <section className="related">
        <h2>{t('detail.related')}</h2>
        <div className="grid-products">
          {related.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

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

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useLanguage()
  const [product, setProduct] = useState(() => getFallbackProduct(id))
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchDetail = async () => {
      try {
        setLoading(true)
        const res = await api.getProductById(id)
        if (isMounted && res.success && res.product) {
          setProduct(res.product)
        }
        const listRes = await api.getProducts()
        if (isMounted && listRes.success && listRes.products) {
          setAllProducts(listRes.products)
        }
      } catch (err) {
        console.warn('Using offline product detail:', err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchDetail()
    return () => { isMounted = false }
  }, [id])

  if (loading && !product) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p className="text-muted">{t('detail.loading')}</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container section not-found">
        <h1>{t('detail.notFound')}</h1>
        <p style={{ margin: '1.5rem 0' }}>
          <Link to="/products" className="btn btn-primary">
            {t('detail.backToProducts')}
          </Link>
        </p>
      </div>
    )
  }

  return <ProductView key={product.id || product._id} product={product} allProducts={allProducts} />
}
