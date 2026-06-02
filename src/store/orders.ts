import type { OrdersState } from '#/types'
import { create } from 'zustand'
import { db } from '#/db/initDb'
import { PRODUCTS_CATALOG } from '#/db/productsCatalog'
import { useInventories } from './inventories'
import { BUSINESS_CATALOG } from '#/db/businessList'

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
      return
    } else {
      newPendingBusinessOrders[businessId] = []
    }
    set(() => ({ pendingBusinessOrders: newPendingBusinessOrders }))

    try {
      await updateDbOrders(newPendingBusinessOrders)
    } catch (error) {
      set(() => ({ pendingBusinessOrders }))
      console.error('could not add business to pending business orders', error)
    }
  },
  removeBusinessFromOrders: async (businessId: string) => {
    const pendingBusinessOrders = get().pendingBusinessOrders
    const newPendingBusinessOrders = { ...pendingBusinessOrders }
    delete newPendingBusinessOrders[businessId]

    set(() => ({ pendingBusinessOrders: newPendingBusinessOrders }))

    try {
      await updateDbOrders(newPendingBusinessOrders)
    } catch (error) {
      set(() => ({ pendingBusinessOrders }))
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
      set(() => ({ pendingBusinessOrders }))
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
      useInventories
        .getState()
        .sellBusinessItem(
          productId,
          PRODUCTS_CATALOG[productId].baseSellingPrice,
          businessId,
        )
      return true
    } catch (error) {
      set(() => ({ pendingBusinessOrders }))
      console.error('could not fulfill order', error)
      return false
    }
  },
  processPendingOrders: async (): Promise<boolean> => {
    console.log('processing orders')
    const pendingBusinessOrders = get().pendingBusinessOrders

    let pendingOrdersNumber = 0
    Object.entries(pendingBusinessOrders).forEach(
      ([businessId, orders]) => {
        console.log(businessId, orders)
        orders.forEach(() => {
          pendingOrdersNumber += 1
        })
      },
    )

    if (pendingOrdersNumber === 0) {
      console.log('no orders to fulfill')
      return false
    }

    const ordersPromises: Promise<any>[] = []
    Object.entries(pendingBusinessOrders).forEach(
      ([businessId, orders]) => {
        const businessOrderRate =
          BUSINESS_CATALOG.find((business) => business.id === businessId)
            ?.baseOrderRate || 1
        const ordersToProcess = orders.slice(0, businessOrderRate)
        ordersToProcess.forEach((order) => {
          const promise = get()
            .fulfillOrder(businessId, order)
            .then((fulfilledOrder) => {
              return fulfilledOrder
            })
            .catch((error) => {
              console.error(`Errore nell'ordine per ${businessId}:`, error)
              return false
            })
          ordersPromises.push(promise)
        })
      },
    )

    try {
      await Promise.allSettled(ordersPromises)
      console.log('all order promises settled')
      return true
    } catch (error) {
      console.error('could not settle all order promises')
      return false
    }
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({ pendingBusinessOrders: savedPendingBusinessOrders }))
  },
}))
