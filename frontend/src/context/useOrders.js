import { useContext } from 'react'
import { OrderContext } from './orderContext'

export function useOrders() {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used inside OrderProvider')
  return ctx
}