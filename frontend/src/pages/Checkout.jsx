import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import { formatPrice, localized } from '../utils/format'
import { useOrders } from '../context/useOrders'
import { useAuth } from '../context/useAuth'
import api from '../utils/api'

const FIELDS = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode']

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
}

const PAYMENTS = [
  { value: 'bank', label: 'checkout.bankTransfer' },
  { value: 'ewallet', label: 'checkout.ewallet' },
  { value: 'cod', label: 'checkout.cod' },
]

// Returns the translation key for the error, or '' if valid
function validate(name, value) {
  const v = value.trim()
  if (!v) return 'checkout.required'
  if (name === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return 'checkout.invalidEmail'
  if (name === 'phone' && !/^\+?[0-9\s-]{8,16}$/.test(v)) return 'checkout.invalidPhone'
  if (name === 'postalCode' && !/^\d{5}$/.test(v)) return 'checkout.invalidPostal'
  return ''
}

function Field({ name, label, value, error, onChange, onBlur, type = 'text', full, textarea, ...rest }) {
  const { t } = useLanguage()
  const id = `field-${name}`
  const Tag = textarea ? 'textarea' : 'input'

  return (
    <div className={`field ${full ? 'full' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <Tag
        id={id}
        name={name}
        type={textarea ? undefined : type}
        className="input"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {t(error)}
        </p>
      )}
    </div>
  )
}

export default function Checkout() {
  const { lang, t } = useLanguage()
  const { items, totalItems, subtotal, shipping, total, clearCart } = useCart()
  const { addOrder } = useOrders()
  const { user } = useAuth()

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [payment, setPayment] = useState('bank')
  const [order, setOrder] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Auto-fill user name & email if logged in
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
      }))
    }
  }, [user])

  // Errors are recalculated on every render, but only shown for touched fields
  const errors = {}
  FIELDS.forEach((f) => {
    errors[f] = validate(f, form[f])
  })
  const shownError = (f) => (touched[f] ? errors[f] : '')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])))

    const firstInvalid = FIELDS.find((f) => errors[f])
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

    setSubmitting(true)

    const newOrder = {
      number: `GH-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: items.map(({ id, name, price, qty, emoji, bg }) => ({
        id, name, price, qty, emoji, bg,
      })),
      subtotal,
      shipping,
      total,
      payment,
      customer: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim(),
      },
    }

    try {
      // Sync to MongoDB Backend API
      const apiPayload = {
        customerInfo: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
        },
        items: items.map((i) => ({
          productId: typeof i.id === 'number' ? i.id : undefined,
          product: typeof i.id === 'string' ? i.id : undefined,
          name: i.name,
          price: i.price,
          quantity: i.qty,
          emoji: i.emoji,
        })),
        paymentMethod: payment,
        totalAmount: total,
      }

      const res = await api.createOrder(apiPayload)
      if (res.success && res.order) {
        newOrder.number = res.order.orderNumber
      }
    } catch (err) {
      console.warn('Backend API order sync error (order saved locally):', err.message)
    } finally {
      setSubmitting(false)
    }

    addOrder(newOrder)
    setOrder(newOrder)
    clearCart()
    window.scrollTo(0, 0)
  }

  // Success view
  if (order) {
    return (
      <div className="container section">
        <div className="card success-card">
          <div className="success-icon" aria-hidden="true">✅</div>
          <h1>{t('checkout.successTitle')}</h1>
          <p className="text-muted">{t('checkout.successText')}</p>
          <p className="order-number">
            {t('checkout.orderNumber')}: {order.number}
          </p>
          <p>
            {t('cart.total')}: <strong>{formatPrice(order.total)}</strong>
          </p>
          <div className="success-actions" style={{ marginTop: '1.5rem' }}>
            <Link to="/products" className="btn btn-outline">
              {t('cart.continueShopping')}
            </Link>
            <Link to="/orders" className="btn btn-primary">
              {t('checkout.checkOrders')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container section">
        <h1>{t('checkout.title')}</h1>
        <div className="card empty-state" style={{ marginTop: '1.5rem' }}>
          <span className="emoji" aria-hidden="true">🛒</span>
          <p>{t('checkout.emptyCart')}</p>
          <Link to="/products" className="btn btn-primary">
            {t('cart.startShopping')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section">
      <h1>{t('checkout.title')}</h1>

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} noValidate className="checkout-form">
          <section className="card form-section">
            <h2>{t('checkout.shippingInfo')}</h2>
            <div className="fields-grid">
              <Field
                name="fullName"
                label={t('checkout.fullName')}
                value={form.fullName}
                error={shownError('fullName')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                full
              />
              <Field
                name="email"
                type="email"
                label={t('checkout.email')}
                value={form.email}
                error={shownError('email')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              <Field
                name="phone"
                type="tel"
                label={t('checkout.phone')}
                value={form.phone}
                error={shownError('phone')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="tel"
              />
              <Field
                name="address"
                label={t('checkout.address')}
                value={form.address}
                error={shownError('address')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="street-address"
                full
                textarea
                rows={2}
              />
              <Field
                name="city"
                label={t('checkout.city')}
                value={form.city}
                error={shownError('city')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="address-level2"
              />
              <Field
                name="postalCode"
                label={t('checkout.postalCode')}
                value={form.postalCode}
                error={shownError('postalCode')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="postal-code"
                maxLength={5}
                inputMode="numeric"
              />
            </div>
          </section>

          <section className="card form-section">
            <h2>{t('checkout.paymentMethod')}</h2>
            <div className="payment-options" role="radiogroup" aria-label={t('checkout.paymentMethod')}>
              {PAYMENTS.map((p) => (
                <label
                  key={p.value}
                  className={`payment-option ${payment === p.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={p.value}
                    checked={payment === p.value}
                    onChange={(e) => setPayment(e.target.value)}
                  />
                  <span>{t(p.label)}</span>
                </label>
              ))}
            </div>
            <p className="payment-note">{t('checkout.paymentNote')}</p>
          </section>

          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={submitting}
          >
            {submitting ? t('checkout.submitting') : `${t('checkout.placeOrder')} • ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout-summary">
          <div className="card">
            <h2>{t('checkout.orderSummary')}</h2>
            <ul className="summary-items" aria-label={t('cart.items', { count: totalItems })}>
              {items.map((i) => (
                <li key={i.id} className="summary-item">
                  <span className="summary-item-emoji" style={{ background: i.bg }} aria-hidden="true">
                    {i.emoji}
                  </span>
                  <div className="summary-item-info">
                    <span className="summary-item-name">{localized(i.name, lang)}</span>
                    <span className="text-muted">× {i.qty}</span>
                  </div>
                  <span className="summary-item-price">{formatPrice(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="summary-calc">
              <div className="calc-row">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="calc-row">
                <span>{t('cart.shipping')}</span>
                <span>{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</span>
              </div>
              <div className="calc-row total">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
