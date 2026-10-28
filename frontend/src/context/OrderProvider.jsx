import { useState, useEffect, useMemo, useCallback } from 'react'
import { OrderContext } from './orderContext'

const STORAGE_KEY = 'goodshub-orders'

function loadOrders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch {
  // ignore if localStorage is not available
    }
  }, [orders])

  // New order is added to the beginning of the list
  const addOrder = useCallback(
    (order) => setOrders((prev) => [order, ...prev]),
    []
  )

  const value = useMemo(() => ({ orders, addOrder }), 
    [orders, addOrder]
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}