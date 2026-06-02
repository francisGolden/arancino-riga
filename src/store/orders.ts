import type { OrdersState } from '#/types'
import { create } from 'zustand'

export const useOrders = create<OrdersState>((set, get) => ({
  businessOrders: {},
  getBusinessOrders: (businessId: string) => {
    return get().businessOrders[businessId]
  },
}))
