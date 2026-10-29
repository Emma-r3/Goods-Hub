import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import ProductCard from '../components/ProductCard'
import { products as fallbackProducts, CATEGORIES, CATEGORY_ICONS } from '../data/products'
import api from '../utils/api'

export default function Home() {
  const { t } = useLanguage()
  const [featured, setFeatured] = useState(() =>
    fallbackProducts.filter((p) => p.featured).slice(0, 8)
  )

  useEffect(() => {
    let isMounted = true
    const loadFeatured = async () => {
      try {
        const res = await api.getProducts('featured=true')
        if (isMounted && res.success && res.products?.length > 0) {
          setFeatured(res.products.slice(0, 8))
        }
      } catch {
        // Keeps fallback products silently if API isn't ready
      }
    }
    loadFeatured()
    return () => { isMounted = false }
  }, [])

  const perks = [
    { icon: '🚚', title: t('home.perk1Title'), text: t('home.perk1Text') },
    { icon: '🔒', title: t('home.perk2Title'), text: t('home.perk2Text') },
    { icon: '↩️', title: t('home.perk3Title'), text: t('home.perk3Text') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>{t('home.heroTitle')}</h1>
            <p>{t('home.heroSubtitle')}</p>
            <Link to="/products" className="btn btn-light">
              {t('home.shopNow')}
            </Link>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span>🎧</span>
            <span>👟</span>
            <span>⌚</span>
            <span>🎒</span>
            <span>💡</span>
            <span>🥤</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container section">
        <div className="section-header">
          <h2>{t('home.categories')}</h2>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              to={`/products?category=${c}`}
              className="card category-card"
            >
              <span className="category-icon" aria-hidden="true">
                {CATEGORY_ICONS[c]}
              </span>
              {t(`categories.${c}`)}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ paddingBottom: 'var(--space-6)' }}>
        <div className="section-header">
          <h2>{t('home.featured')}</h2>
          <Link to="/products" className="link-more">
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="grid-products">
          {featured.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="container section">
        <div className="perks-grid">
          {perks.map((p, idx) => (
            <div key={idx} className="perk">
              <span className="perk-icon" aria-hidden="true">
                {p.icon}
              </span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
