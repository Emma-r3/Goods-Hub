import { useReducer, useEffect, useMemo, useCallback } from 'react'
import { CartContext } from './cartContext'

const STORAGE_KEY = 'goodshub-cart'
export const FREE_SHIPPING_THRESHOLD = 500000
export const SHIPPING_FEE = 25000

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { product, qty } = action
      const existing = state.find((i) => i.id === product.id)
      if (existing) {
        return state.map((i) =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + qty, i.stock) }
            : i
        )
      }
      return [
        ...state,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          bg: product.bg,
          stock: product.stock,
          qty: Math.min(qty, product.stock),
        },
      ]
    }
    case 'SET_QTY':
      return state.map((i) =>
        i.id === action.id
          ? { ...i, qty: Math.max(1, Math.min(action.qty, i.stock)) }
          : i
      )
    case 'REMOVE':
      return state.filter((i) => i.id !== action.id)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], loadCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
  // ignore if localStorage is not available
    }
  }, [items])

  const addItem = useCallback(
    (product, qty = 1) => dispatch({ type: 'ADD', product, qty }),
    []
  )
  const updateQty = useCallback(
    (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    []
  )
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const shipping =
      items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
    return {
      items,
      totalItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      updateQty,
      removeItem,
      clearCart,
    }
  }, [items, addItem, updateQty, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}