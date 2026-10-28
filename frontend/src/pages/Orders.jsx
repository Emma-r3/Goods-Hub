import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useOrders } from '../context/useOrders'
import { formatPrice, formatDateTime, localized } from '../utils/format'

const PAYMENT_LABEL = {
  bank: 'checkout.bankTransfer',
  ewallet: 'checkout.ewallet',
  cod: 'checkout.cod',
}

export default function Orders() {
  const { lang, t } = useLanguage()
  const { orders } = useOrders()

  if (orders.length === 0) {
    return (
      <div className="container section">
        <h1>{t('orders.title')}</h1>
        <div className="card empty-state" style={{ marginTop: '1.5rem' }}>
          <span className="emoji" aria-hidden="true">📦</span>
          <p>{t('orders.empty')}</p>
          <Link to="/products" className="btn btn-primary">
            {t('cart.startShopping')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <h1>
        {t('orders.title')}{' '}
        <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}>
          ({t('orders.count', { count: orders.length })})
        </span>
      </h1>

      <ul className="order-list">
        {orders.map((o) => (
          <li key={o.number} className="card order-card">
            <div className="order-head">
              <div>
                <strong>{o.number}</strong>
                <p className="order-date">
                  {t('orders.orderedOn')} {formatDateTime(o.date, lang)}
                </p>
              </div>
            </div>

            <div className="order-body">
              <ul className="order-items" aria-label={t('orders.items')}>
                {o.items.map((i) => (
                  <li key={i.id} className="order-item">
                    <span
                      className="order-item-emoji"
                      style={{ background: i.bg }}
                      aria-hidden="true"
                    >
                      {i.emoji}
                    </span>
                    <span className="order-item-name">
                      <Link to={`/products/${i.id}`} className="order-item-link">
                        {localized(i.name, lang)}
                      </Link>
                      <small>
                        {formatPrice(i.price)} × {i.qty}
                      </small>
                    </span>
                    <span className="order-item-price">
                      {formatPrice(i.price * i.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="order-meta">
                <div>
                  <dt>{t('orders.payment')}</dt>
                  <dd>{t(PAYMENT_LABEL[o.payment])}</dd>
                </div>
                <div>
                  <dt>{t('orders.shipTo')}</dt>
                  <dd>
                    {o.customer.fullName}, {o.customer.address}, {o.customer.city}{' '}
                    {o.customer.postalCode}
                  </dd>
                </div>
              </dl>

              <div className="summary-row">
                <span>{t('cart.shipping')}</span>
                <span>{o.shipping === 0 ? t('cart.free') : formatPrice(o.shipping)}</span>
              </div>
              <div className="order-total">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(o.total)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}