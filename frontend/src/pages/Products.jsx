import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import ProductCard from '../components/ProductCard'
import { products as fallbackProducts, CATEGORIES } from '../data/products'
import api from '../utils/api'

const SORT_OPTIONS = [
  { value: 'default', label: 'products.sortDefault' },
  { value: 'low', label: 'products.sortLow' },
  { value: 'high', label: 'products.sortHigh' },
  { value: 'rating', label: 'products.sortRating' },
]

export default function Products() {
  const { t } = useLanguage()
  const [params, setParams] = useSearchParams()
  const [productList, setProductList] = useState(fallbackProducts)
  const [loading, setLoading] = useState(false)

  const rawCategory = params.get('category')
  const category = CATEGORIES.includes(rawCategory) ? rawCategory : 'all'
  const query = params.get('q') || ''
  const sort = params.get('sort') || 'default'

  // Fetch live products from Backend API
  useEffect(() => {
    let isMounted = true
    const fetchApiProducts = async () => {
      try {
        setLoading(true)
        const res = await api.getProducts()
        if (isMounted && res.success && res.products?.length > 0) {
          setProductList(res.products)
        }
      } catch (err) {
        console.warn('Backend not reachable yet, using offline products:', err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchApiProducts()
    return () => { isMounted = false }
  }, [])

  // Update a single URL parameter, remove if empty/default
  const updateParam = (key, value, defaultValue) => {
    const next = new URLSearchParams(params)
    if (!value || value === defaultValue) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    let list = productList.filter((p) => {
      const matchCategory = category === 'all' || p.category === category
      // Search in both EN and ID names
      const nameEn = p.name?.en || (typeof p.name === 'string' ? p.name : '')
      const nameId = p.name?.id || (typeof p.name === 'string' ? p.name : '')
      const matchQuery =
        !q ||
        nameEn.toLowerCase().includes(q) ||
        nameId.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })

    if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [productList, category, query, sort])

  return (
    <div className="container section">
      <h1>{t('products.title')}</h1>

      <div className="toolbar">
        <div className="search-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            type="search"
            className="input"
            value={query}
            placeholder={t('nav.searchPlaceholder')}
            aria-label={t('products.searchLabel')}
            onChange={(e) => updateParam('q', e.target.value, '')}
          />
        </div>

        <div className="sort-wrap">
          <label htmlFor="sort">{t('products.sortBy')}</label>
          <select
            id="sort"
            className="input"
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value, 'default')}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {t(o.label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chips" role="group" aria-label={t('detail.category')}>
        <button
          className="chip"
          aria-pressed={category === 'all'}
          onClick={() => updateParam('category', 'all', 'all')}
        >
          {t('products.allCategories')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className="chip"
            aria-pressed={category === c}
            onClick={() => updateParam('category', c, 'all')}
          >
            {t(`categories.${c}`)}
          </button>
        ))}
      </div>

      <p className="results-info" aria-live="polite">
        {loading ? t('products.loading') : t('products.results', { count: filtered.length })}
      </p>

      {filtered.length > 0 ? (
        <div className="grid-products">
          {filtered.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <span className="emoji" aria-hidden="true">🔍</span>
          <p>{t('products.noResults')}</p>
          <button className="btn btn-outline" onClick={() => setParams({})}>
            {t('products.clearFilters')}
          </button>
        </div>
      )}
    </div>
  )
}
