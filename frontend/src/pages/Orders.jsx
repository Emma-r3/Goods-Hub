import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useOrders } from '../context/useOrders'
import { useAuth } from '../context/useAuth'
import { formatPrice, formatDateTime, localized } from '../utils/format'
import api from '../utils/api'

const PAYMENT_LABEL = {
  bank: 'checkout.bankTransfer',
  ewallet: 'checkout.ewallet',
  cod: 'checkout.cod',
}

export default function Orders() {
  const { lang, t } = useLanguage()
  const { orders: localOrders } = useOrders()
  const { isAuthenticated } = useAuth()
  const [apiOrders, setApiOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch orders from MongoDB Backend API
  useEffect(() => {
    let isMounted = true
    if (isAuthenticated) {
      const fetchOrders = async () => {
        try {
          setLoading(true)
          const res = await api.getMyOrders()
          if (isMounted && res.success && res.orders) {
            setApiOrders(res.orders)
          }
        } catch (err) {
          console.warn('Could not fetch server orders:', err.message)
        } finally {
          if (isMounted) setLoading(false)
        }
      }
      fetchOrders()
    }
    return () => { isMounted = false }
  }, [isAuthenticated])

  // Combine and de-duplicate orders by orderNumber/number
  const orderMap = new Map()

  localOrders.forEach((o) => {
    orderMap.set(o.number, o)
  })

  apiOrders.forEach((o) => {
    const formatted = {
      number: o.orderNumber,
      date: o.createdAt,
      total: o.totalAmount,
      payment: o.paymentMethod,
      customer: o.customerInfo,
      status: o.status,
      items: o.items.map((i) => ({
        id: i.productId || i._id,
        name: i.name,
        price: i.price,
        qty: i.quantity,
        emoji: i.emoji || '📦',
      })),
    }
    orderMap.set(o.orderNumber, formatted)
  })

  const mergedOrders = Array.from(orderMap.values())

  if (mergedOrders.length === 0) {
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
          ({t('orders.count', { count: mergedOrders.length })})
        </span>
      </h1>

      {loading && <p className="text-muted">Syncing orders with database...</p>}

      <ul className="order-list">
        {mergedOrders.map((o) => (
          <li key={o.number} className="card order-card">
            <div className="order-head">
              <div>
                <strong>{o.number}</strong>
                <p className="order-date">
                  {t('orders.orderedOn')} {formatDateTime(o.date, lang)}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="order-total">{formatPrice(o.total)}</span>
                {o.status && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: o.status === 'completed' ? '#059669' : '#d97706',
                    }}
                  >
                    ● {o.status}
                  </span>
                )}
              </div>
            </div>

            <div className="order-body">
              <ul className="order-items" aria-label={t('orders.items')}>
                {o.items.map((i, idx) => (
                  <li key={i.id || idx} className="order-item">
                    <span
                      className="order-item-emoji"
                      style={{ background: i.bg || '#f3f4f6' }}
                      aria-hidden="true"
                    >
                      {i.emoji || '📦'}
                    </span>
                    <span className="order-item-name">{localized(i.name, lang)}</span>
                    <span className="order-item-qty">× {i.qty}</span>
                    <span className="order-item-price">
                      {formatPrice(i.price * i.qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="order-meta">
                <div>
                  <span className="text-muted">{t('orders.payment')}:</span>{' '}
                  {t(PAYMENT_LABEL[o.payment] || o.payment)}
                </div>
                <div>
                  <span className="text-muted">{t('orders.shipTo')}:</span>{' '}
                  {o.customer.fullName}, {o.customer.city}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
