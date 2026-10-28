import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import ProductCard from '../components/ProductCard'
import { products, getProductById } from '../data/products'
import { formatPrice, localized } from '../utils/format'

function ProductView({ product }) {
  const { lang, t } = useLanguage()
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const name = localized(product.name, lang)
  const soldOut = product.stock === 0
  const lowStock = product.stock > 0 && product.stock <= 10

  // Related products: same category first, then others, max 4
  const related = [
    ...products.filter((p) => p.category === product.category && p.id !== product.id),
    ...products.filter((p) => p.category !== product.category),
  ].slice(0, 4)

  const handleAdd = () => {
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
          style={{ background: product.bg }}
          role="img"
          aria-label={name}
        >
          <span aria-hidden="true">{product.emoji}</span>
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

          <div className="detail-desc">
            <h2>{t('detail.description')}</h2>
            <p>{localized(product.description, lang)}</p>
          </div>

          {!soldOut && (
            <div className="buy-box">
              <div>
                <span className="qty-label" id="qty-label">{t('detail.quantity')}</span>
                <div className="qty-stepper" role="group" aria-labelledby="qty-label">
                  <button
                    aria-label={t('detail.decrease')}
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="qty-value" aria-live="polite">{qty}</span>
                  <button
                    aria-label={t('detail.increase')}
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                className={`btn btn-add ${added ? 'btn-success' : 'btn-primary'}`}
                onClick={handleAdd}
              >
                {added ? t('detail.added') : t('detail.addToCart')}
              </button>
            </div>
          )}

          {added && (
            <Link to="/cart" className="cart-link">
              {t('detail.viewCart')} →
            </Link>
          )}
        </div>
      </div>

      <section className="related">
        <h2>{t('detail.related')}</h2>
        <div className="grid-products">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const { t } = useLanguage()
  const product = getProductById(id)

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

  return <ProductView key={product.id} product={product} />
}