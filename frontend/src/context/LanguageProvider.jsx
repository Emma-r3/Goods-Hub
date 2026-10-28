import { useState, useEffect, useCallback, useMemo } from 'react'
import { LanguageContext } from './languageContext'
import en from '../i18n/en'
import id from '../i18n/id'

const dictionaries = { en, id }
const STORAGE_KEY = 'goodshub-lang'

function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'id' ? 'id' : 'en' // default English
  } catch {
    return 'en'
  }
}

export default function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  // Save the selected language and update <html lang="...">
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
  // ignore if localStorage is not available
    }
    document.documentElement.lang = lang
  }, [lang])

  // t('nav.home') or t('products.results', { count: 12 })
  const t = useCallback(
    (key, params = {}) => {
      const value = key
        .split('.')
        .reduce((obj, part) => (obj ? obj[part] : undefined), dictionaries[lang])

      if (typeof value !== 'string') return key // fallback: return the key if translation is missing

      return value.replace(/\{(\w+)\}/g, (_, name) =>
        params[name] !== undefined ? params[name] : `{${name}}`
      )
    },
    [lang]
  )

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}