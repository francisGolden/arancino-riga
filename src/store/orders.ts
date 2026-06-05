import type { OrdersState } from '#/types'
import { create } from 'zustand'
import { db } from '#/db/initDb'
import { PRODUCTS_CATALOG } from '#/db/productsCatalog'
import { useInventories, updateDbInventories } from './inventories'
import { useMoney, updateDbMoney } from './currency'
import { useEmployees } from './employees'
import { EMPLOYEES_CATALOG } from '#/db/employeesCatalog'

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

    console.log(
      'newPendingBusinessOrders:',
      newPendingBusinessOrders,
      newPendingBusinessOrders[businessId].length,
    )

    try {
      await updateDbOrders(newPendingBusinessOrders)
      return true
    } catch (error) {
      set(() => ({ pendingBusinessOrders }))
      console.error('could not add order to pending business orders', error)
      return false
    }
  },
  processAllOrdersBulk: async (): Promise<boolean> => {
    // This function processes a certain amount of orders present in the pendingBusinessOrders list
    // The amount of orders is defined by the capacity of the workforce, namely the combined selling workrate
    // of employees working for the business

    return true
  },
  processAddOrders: async (): Promise<boolean> => {
    // This function pushes a certain amount of products present in all businesses inventories to the pendingBusinessOrders list,
    // where they'll be processes.
    // The amount of products that can be pushed in the list of business pending orders is set by the MARKET_DEMAND variable.

    console.log('business inventories')
    const inventories = structuredClone(useInventories.getState().inventories)
    const businessIDs = Object.keys(inventories)
    const pendingBusinessOrdersCopy = structuredClone(get().pendingBusinessOrders)
    const ordersToAdd: Record<string, string[]> = {}

    const MARKET_DEMAND = 10
    const ORDERS_LIMIT = 30
    

    for (const businessID of businessIDs) {
      
      const products = Object.keys(inventories[businessID])
        .filter((item) => item in PRODUCTS_CATALOG)
        .map((item) => {
          return { productID: item, amount: inventories[businessID][item] }
        })
      console.log(products)
      let productsPushedCounter = 0
      const productsToPush: string[] = []
      for (const product of products) {
        while (productsPushedCounter < MARKET_DEMAND && product.amount > 0) {
          if (pendingBusinessOrdersCopy[businessID].length + productsToPush.length > ORDERS_LIMIT) {
            console.log('cannot add more orders to the pending orders list because we hit the ORDERS_LIMIT this business can handle')
            break
          }
          productsPushedCounter++
          product.amount -= 1
          productsToPush.push(product['productID'])
        }
      }
      ordersToAdd[businessID] = productsToPush
    }

    for (const businessID of businessIDs) {
      pendingBusinessOrdersCopy[businessID] = [...pendingBusinessOrdersCopy[businessID], ...ordersToAdd[businessID]]
    }

    set(() => ({pendingBusinessOrders: pendingBusinessOrdersCopy}))

    try {
      await updateDbOrders(pendingBusinessOrdersCopy)
    } catch (error) {
      console.error(error)
    }

    return true
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({ pendingBusinessOrders: savedPendingBusinessOrders }))
  },
}))
