import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import { formatPrice, localized } from '../utils/format'

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const name = localized(product.name, lang)
  const soldOut = product.stock === 0

  const handleAdd = () => {
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <article className="card product-card">
      <Link to={`/products/${product.id}`} className="product-card-link">
        <div
          className="product-thumb"
          style={{ background: product.bg }}
          role="img"
          aria-label={name}
        >
          <span aria-hidden="true">{product.emoji}</span>
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
    </article>
  )
}