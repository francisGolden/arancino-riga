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
    // 1. Deep clonation
    // structuredClone cuts all the ties with the zustand original state
    const pendingOrders = get().pendingBusinessOrders
    const pendingOrdersCopy = structuredClone(pendingOrders)

    const inventories = useInventories.getState().inventories
    const inventoriesCopy = structuredClone(inventories)

    let totalMoneyEarned = 0

    // 2. Transaction processing
    for (const [businessId, arr] of Object.entries(pendingOrders)) {
      const businessEmployees = useEmployees
        .getState()
        .getBusinessEmployees(businessId)

      // TO-DO: logic to limiti order processing to combined selling workrate of business employees
      let combinedSellingWorkRate = 0
      for (const employee of businessEmployees) {
        combinedSellingWorkRate += EMPLOYEES_CATALOG[employee].workRate.selling
      }
      console.log(combinedSellingWorkRate)

      if (combinedSellingWorkRate <= 0) {
        continue
      }

      let ordersProcessedThisTick = 0

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        // Employee workrate lock
        // interrupt the loop when the combined workrate of employees has been reached
        if (ordersProcessedThisTick >= combinedSellingWorkRate) {
          break
        }

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

          ordersProcessedThisTick++
        } else {
          // Bottleneck: no resources
          console.log(`Finished the resources for ${item}. Order skipped.`)
          // continue: go to the next order in the queue
          continue
        }
      }
    }

    if (totalMoneyEarned === 0) {
      console.log('No order fulfilled in this cycle')
      return false
    }

    set(() => ({ pendingBusinessOrders: pendingOrdersCopy }))
    useInventories.getState().hydrateInventories(inventoriesCopy)
    useMoney.getState().increaseMoneyMemory(totalMoneyEarned)

    try {
      await Promise.all([
        updateDbOrders(pendingOrdersCopy),
        updateDbMoney(useMoney.getState().money),
        updateDbInventories(inventoriesCopy),
      ])
      return true
    } catch (error) {
      set(() => ({ pendingBusinessOrders: pendingOrders }))
      useInventories.getState().hydrateInventories(inventories)
      useMoney.getState().decreaseMoney(totalMoneyEarned)
      return false
    }
  },
  processAddOrders: async (): Promise<boolean> => {
    const pendingOrders = get().pendingBusinessOrders
    const pendingOrdersCopy = structuredClone(pendingOrders)
    const MARKET_DEMAND = 10

    // TO-DO FIX THIS FUNCTION to push products to pending orders in bulk

    const inventories = useInventories.getState().inventories
    const ordersToPush = []
    console.log(inventories)
    // for (let i = 0; i < MARKET_DEMAND; i++) {
    //   for (const [businessId, businessInventoryObject] of Object.entries(
    //   inventories,
    // )) {
    //   console.log('obj', businessInventoryObject)
    //   Object.entries(businessInventoryObject).forEach(([key, obj]) => {
    //     if (key in PRODUCTS_CATALOG) {
    //       ordersToPush.push(key)
    //     }
    //   })
    // }
    // }
    

    console.log('ordersToPush: ', ordersToPush)

    return true
    // const inventories = useInventories.getState().inventories
    // const PRODUCT_DEMAND = 10

    // if (Object.keys(inventories).length === 0) {
    //   return false
    // }

    // // 1. Collect data of orders to process
    // const ordersToProcess: { inventoryKey: string; productId: string }[] = []

    // for (const [key, obj] of Object.entries(inventories)) {
    //   for (const productId of Object.keys(obj)) {
    //     if (productId in PRODUCTS_CATALOG && obj[productId] > 0) {
    //       ordersToProcess.push({ inventoryKey: key, productId })
    //     }
    //   }
    // }

    // if (ordersToProcess.length === 0) {
    //   return false
    // }

    // console.log(ordersToProcess)

    // // 2. Apply the PRODUCT_DEMAND limit
    // const limitedOrders = ordersToProcess.slice(0, PRODUCT_DEMAND)

    // // 3. Execute the promises
    // const promises = limitedOrders.map(async (order) => {
    //   return get()
    //     .addOrder(order.inventoryKey, order.productId)
    //     .catch((error) =>
    //       console.error(`Error in the order ${order.productId}:`, error),
    //     )
    // })

    // try {
    //   await Promise.allSettled(promises)
    //   console.log('All the valid orders have been put in the pending orders list')
    //   return true
    // } catch (error) {
    //   console.error('Error during processAddOrders:', error)
    //   return false
    // }
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({ pendingBusinessOrders: savedPendingBusinessOrders }))
  },
}))
