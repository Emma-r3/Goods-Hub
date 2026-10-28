import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { CATEGORIES } from '../data/products'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link to="/" className="logo">
            <span aria-hidden="true">🛍️</span> Goods Hub
          </Link>
          <p style={{ marginTop: '0.75rem' }}>{t('footer.tagline')}</p>
        </div>

        <div>
          <h4>{t('footer.shop')}</h4>
          <ul className="footer-shop-list">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link to={`/products?category=${c}`}>{t(`categories.${c}`)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>{t('footer.support')}</h4>
          <ul>
            <li><Link to="/">{t('footer.help')}</Link></li>
            <li><Link to="/">{t('footer.contact')}</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Goods Hub. {t('footer.rights')}
      </div>
    </footer>
  )
}