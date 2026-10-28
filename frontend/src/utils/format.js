// Price is always in Rupiah
export function formatPrice(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

// Get text according to the active language from an object { en, id }
export function localized(obj, lang) {
  return obj?.[lang] ?? obj?.en ?? ''
}

// Date + time according to language, e.g. 29 October 2026 at 17.45
export function formatDateTime(iso, lang) {
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(iso))
}