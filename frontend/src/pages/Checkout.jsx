import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/useLanguage'
import { useCart } from '../context/useCart'
import { formatPrice, localized } from '../utils/format'
import { useOrders } from '../context/useOrders'

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

  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({})
  const [payment, setPayment] = useState('bank')
  const [order, setOrder] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(FIELDS.map((f) => [f, true])))

    const firstInvalid = FIELDS.find((f) => errors[f])
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus()
      return
    }

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

      <div className="cart-layout">
        {/* Form */}
        <form id="checkout-form" onSubmit={handleSubmit} noValidate>
          <section className="card form-card">
            <h2>{t('checkout.shippingInfo')}</h2>
            <div className="form-grid">
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
                inputMode="tel"
                placeholder="08123456789"
              />
              <Field
                name="address"
                label={t('checkout.address')}
                value={form.address}
                error={shownError('address')}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="street-address"
                textarea
                full
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
                inputMode="numeric"
                maxLength={5}
              />
            </div>
          </section>

          <fieldset className="card form-card">
            <legend>{t('checkout.paymentMethod')}</legend>
            <div className="pay-options">
              {PAYMENTS.map((p) => (
                <label key={p.value} className="pay-option">
                  <input
                    type="radio"
                    name="payment"
                    value={p.value}
                    checked={payment === p.value}
                    onChange={() => setPayment(p.value)}
                  />
                  {t(p.label)}
                </label>
              ))}
            </div>
            <p className="pay-note">{t('checkout.paymentNote')}</p>
          </fieldset>
        </form>

        {/* Summary */}
        <aside className="card summary">
          <h2>{t('checkout.orderSummary')}</h2>

          <ul className="summary-items">
            {items.map((item) => (
              <li key={item.id} className="summary-item">
                <span
                  className="summary-item-emoji"
                  style={{ background: item.bg }}
                  aria-hidden="true"
                >
                  {item.emoji}
                </span>
                <span className="summary-item-name">
                  {localized(item.name, lang)} × {item.qty}
                </span>
                <span className="summary-item-price">
                  {formatPrice(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="summary-row">
            <span>{t('cart.subtotal')} ({t('cart.items', { count: totalItems })})</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>{t('cart.shipping')}</span>
            <span>{shipping === 0 ? t('cart.free') : formatPrice(shipping)}</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.total')}</span>
            <span>{formatPrice(total)}</span>
          </div>

          <button type="submit" form="checkout-form" className="btn btn-primary btn-block">
            {t('checkout.placeOrder')}
          </button>
          <Link to="/cart" className="btn btn-outline btn-block">
            {t('checkout.backToCart')}
          </Link>
        </aside>
      </div>
    </div>
  )
}