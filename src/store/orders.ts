import type { OrdersState } from '#/types'
import { create } from 'zustand'
import { db } from '#/db/initDb'
import { PRODUCTS_CATALOG } from '#/db/productsCatalog'
import { useInventories, updateDbInventories } from './inventories'
import { useMoney, updateDbMoney } from './currency'
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
    // 1. FOTOGRAFIA (Clonazione Profonda)
    // structuredClone taglia tutti i ponti con lo stato originale di Zustand
    const pendingOrders = get().pendingBusinessOrders
    const pendingOrdersCopy = structuredClone(pendingOrders)
    const currentMoney = useMoney.getState().money

    const inventories = useInventories.getState().inventories
    const inventoriesCopy = structuredClone(inventories)

    let totalMoneyEarned = 0

    // 2. Transaction processing
    for (const [businessId, arr] of Object.entries(pendingOrders)) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]

        // Fallback if the item does not exist in the dictionary
        const itemAvailableAmount = inventoriesCopy[businessId][item] || 0

        if (itemAvailableAmount > 0) {
          // A. Reduce local inventory item
          inventoriesCopy[businessId][item] -= 1

          // B. Remove an order from the local queue
          const orderIndex = pendingOrdersCopy[businessId].indexOf(item)
          if (orderIndex > -1) {
            pendingOrdersCopy[businessId].splice(orderIndex, 1)
          }

          // C. Accumulate the profits
          totalMoneyEarned += PRODUCTS_CATALOG[item].baseSellingPrice
        } else {
          // Bottleneck: no resources
          console.log(`Finishes the resources for ${item}. Order skipped.`)
          // continue: go to the next order in the queue
          continue
        }
      }
    }

    if (totalMoneyEarned === 0) {
      console.log('No order fulfilled in this cycle')
      return false
    }

    set(() => ({pendingBusinessOrders: pendingOrdersCopy}))
    useInventories.getState().hydrateInventories(inventoriesCopy)
    useMoney.getState().increaseMoneyMemory(totalMoneyEarned)

    try {
      await Promise.all([
        updateDbOrders(pendingOrdersCopy),
        updateDbMoney(useMoney.getState().money),
        updateDbInventories(inventoriesCopy)
      ])
      return true
    } catch (error) {
      set(() => ({pendingBusinessOrders: pendingOrders}))
      useInventories.getState().hydrateInventories(inventories)
      useMoney.getState().decreaseMoney(totalMoneyEarned)
      return false
    }
  },
  processAddOrders: async (): Promise<boolean> => {
    const inventories = useInventories.getState().inventories
    const PRODUCT_DEMAND = 1

    if (Object.keys(inventories).length === 0) {
      return false
    }

    // 1. Collect data of orders to process
    const ordersToProcess: { inventoryKey: string; productId: string }[] = []

    for (const [key, obj] of Object.entries(inventories)) {
      for (const productId of Object.keys(obj)) {
        if (productId in PRODUCTS_CATALOG && obj[productId] > 0) {
          ordersToProcess.push({ inventoryKey: key, productId })
        }
      }
    }

    if (ordersToProcess.length === 0) {
      return false
    }

    // 2. Apply the PRODUCT_DEMAND limit
    const limitedOrders = ordersToProcess.slice(0, PRODUCT_DEMAND)

    // 3. Execute the promises
    const promises = limitedOrders.map(async (order) => {
      return get()
        .addOrder(order.inventoryKey, order.productId)
        .catch((error) =>
          console.error(`Error in the order ${order.productId}:`, error),
        )
    })

    try {
      await Promise.allSettled(promises)
      console.log('All the valid orders have been processed')
      return true
    } catch (error) {
      console.error('Error during processAddOrders:', error)
      return false
    }
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({ pendingBusinessOrders: savedPendingBusinessOrders }))
  },
}))
