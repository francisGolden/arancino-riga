import type { OrdersState } from '#/types'
import { create } from 'zustand'
import { db } from '#/db/initDb'
import { PRODUCTS_CATALOG } from '#/db/productsCatalog'
import { useInventories } from './inventories'

const updateDbOrders = async (
  newPendingBusinessOrders: Record<string, string[]>,
): Promise<boolean> => {
  try {
    await db.update(
      (data) => (data.pendingBusinessOrders = newPendingBusinessOrders),
    )
    return true
  } catch (error) {
    console.error('could not update orders in db', error)
    return false
  }
}

export const useOrders = create<OrdersState>((set, get) => ({
  pendingBusinessOrders: {},
  getPendingBusinessOrders: (businessId: string) => {
    return get().pendingBusinessOrders[businessId]
  },
  addBusinessToPendingBusinessOrders: async (businessId: string) => {
    const pendingBusinessOrders = get().pendingBusinessOrders
    const newPendingBusinessOrders = { ...pendingBusinessOrders }
    if (businessId in newPendingBusinessOrders) {
      console.log('business already in orders object')
    } else {
      newPendingBusinessOrders[businessId] = []
    }
    set(() => ({ pendingBusinessOrders: newPendingBusinessOrders }))

    try {
      await updateDbOrders(newPendingBusinessOrders)
    } catch (error) {
      set(() => ({ pendingBusinessOrders: pendingBusinessOrders }))
      console.error('could not add business to pending business orders', error)
    }
  },
  removeBusinessFromOrders: async (businessId: string) => {
    const pendingBusinessOrders = get().pendingBusinessOrders
    const newPendingBusinessOrders = { ...pendingBusinessOrders }
    delete newPendingBusinessOrders[businessId]
    
    set(() => ({pendingBusinessOrders: newPendingBusinessOrders}))

    try {
        await updateDbOrders(newPendingBusinessOrders)
    } catch (error) {
        set(() => ({pendingBusinessOrders}))
        console.error('could not remove business from orders', error)
    }
  },
  addOrder: async (businessId: string, productId: string): Promise<boolean> => {
    const businessOrders = get().getPendingBusinessOrders(businessId)
    const newBusinessOrders = [...businessOrders, productId]

    const pendingBusinessOrders = get().pendingBusinessOrders
    const newPendingBusinessOrders = {
      ...pendingBusinessOrders,
      [businessId]: newBusinessOrders,
    }
    set(() => ({ pendingBusinessOrders: newPendingBusinessOrders }))

    try {
      await updateDbOrders(newPendingBusinessOrders)
      return true
    } catch (error) {
      set(() => ({ pendingBusinessOrders: pendingBusinessOrders }))
      console.error('could not add order to pending business orders', error)
      return false
    }
  },
  fulfillOrder: async (
    businessId: string,
    productId: string,
  ): Promise<boolean> => {
    const businessOrders = get().getPendingBusinessOrders(businessId)
    const newBusinessOrders = [...businessOrders]
    let toRemoveIndex = 0

    for (let i = 0; i < newBusinessOrders.length; i++) {
      if (newBusinessOrders[i] === productId) {
        toRemoveIndex = i
        break
      }
    }

    newBusinessOrders.splice(toRemoveIndex, 1)

    const pendingBusinessOrders = get().pendingBusinessOrders
    const newPendingBusinessOrders = {
      ...pendingBusinessOrders,
      [businessId]: newBusinessOrders,
    }
    set(() => ({ pendingBusinessOrders: newPendingBusinessOrders }))
    console.log(
      'adding product selling price to money... ',
      PRODUCTS_CATALOG[productId].baseSellingPrice,
    )

    try {
      await updateDbOrders(newPendingBusinessOrders)
      useInventories.getState().sellBusinessItem(productId, PRODUCTS_CATALOG[productId].baseSellingPrice, businessId)
      return true
    } catch (error) {
      set(() => ({ pendingBusinessOrders: pendingBusinessOrders }))
      console.error('could not fulfill order', error)
      return false
    }
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({pendingBusinessOrders: savedPendingBusinessOrders}))
  }
}))
