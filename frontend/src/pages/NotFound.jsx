import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'

export default function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="container section not-found">
      <h1>{t('notFound.title')}</h1>
      <p className="text-muted" style={{ margin: '1rem 0 1.5rem' }}>
        {t('notFound.text')}
      </p>
      <Link to="/" className="btn btn-primary">
        {t('notFound.back')}
      </Link>
    </div>
  )
}