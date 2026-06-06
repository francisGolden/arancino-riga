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

    // What are the orders that are present in the pending orders list of each business?
    const oldPendingBusinessOrders = structuredClone(
      get().pendingBusinessOrders,
    )
    const pendingBusinessOrdersCopy = structuredClone(
      get().pendingBusinessOrders,
    )

    const oldInventories = structuredClone(
      useInventories.getState().inventories,
    )

    const inventoriesCopy = structuredClone(
      useInventories.getState().inventories,
    )

    const businessIDs = Object.keys(pendingBusinessOrdersCopy)

    let totalMoneyEarned = 0

    // Let's loop over the businessIDs of owned businesses
    for (const businessID of businessIDs) {
      // What is the combined selling workrate of the people working for this business?
      let combinedSellingWorkrate = 0
      const businessEmployees =
        useEmployees.getState().businessEmployees[businessID]

      for (const businessEmployee of businessEmployees) {
        combinedSellingWorkrate +=
          EMPLOYEES_CATALOG[businessEmployee].workRate.selling
      }

      let productsSoldCounter = 0

      // We can only process as many products as the selling capacity of business' workers
      while (productsSoldCounter < combinedSellingWorkrate) {
        productsSoldCounter++
      }

      // Let's gather the products that are going to be sold from the pending orders list of this business
      const productsSold = pendingBusinessOrdersCopy[businessID].splice(
        0,
        productsSoldCounter,
      )

      // Here we are calculating the amount of money earned by selling these products
      for (const productSold of productsSold) {
        totalMoneyEarned += PRODUCTS_CATALOG[productSold].baseSellingPrice

        // and decreasing the amount of this product in the inventory
        if (inventoriesCopy[businessID][productSold]) {
          inventoriesCopy[businessID][productSold]--
        }
      }
    }

    // Let's set the global state with the new object,
    set(() => ({ pendingBusinessOrders: pendingBusinessOrdersCopy }))

    // increase the money state
    useMoney.getState().increaseMoney(totalMoneyEarned)

    // and update the inventories with the new object
    useInventories.getState().hydrateInventories(inventoriesCopy)

    // Here we are trying to update the DBs with the new data and
    // reverting to the old state in case of error
    try {
      await Promise.all([
        updateDbOrders(pendingBusinessOrdersCopy),
        updateDbMoney(useMoney.getState().money),
        updateDbInventories(inventoriesCopy),
      ])
      return true
    } catch (error) {
      set(() => ({ pendingBusinessOrders: oldPendingBusinessOrders }))
      useMoney.getState().decreaseMoney(totalMoneyEarned)
      useInventories.getState().hydrateInventories(oldInventories)
      return false
    }
  },
  processAddOrders: async (): Promise<boolean> => {
    // This function pushes a certain amount of products present in all businesses inventories to the pendingBusinessOrders list,
    // where they'll be processes.
    // The amount of products that can be pushed in the list of business pending orders is set by the MARKET_DEMAND variable.
    const inventories = structuredClone(useInventories.getState().inventories)

    const oldPendingBusinessOrders = structuredClone(
      get().pendingBusinessOrders,
    )
    const pendingBusinessOrdersCopy = structuredClone(
      get().pendingBusinessOrders,
    )

    const businessIDs = Object.keys(oldPendingBusinessOrders)

    const ordersToAdd: Record<string, string[]> = {}

    const MARKET_DEMAND = 10
    const ORDERS_LIMIT = 7

    // Loop over the business inventories
    for (const businessID of businessIDs) {
      const products = Object.keys(inventories[businessID])
        .filter((item) => item in PRODUCTS_CATALOG)
        .map((item) => {
          return { productID: item, amount: inventories[businessID][item] }
        })

      let productsPushedCounter = 0
      const productsToPush: string[] = []

      const oldPendingBusinessOrdersLength =
        pendingBusinessOrdersCopy[businessID].length


      // Loop over the products available in the inventory of this business
      for (const product of products) {
        // Push as many available as possible to the productsToPush array.
        // The limit that should not be overtaken 
        // taking into account the sum of products already present in the pendingBusinessOrders array and the productsToPush array
        // is set by the ORDERS_LIMIT
        while (productsPushedCounter < MARKET_DEMAND && product.amount > 0) {
          if (
            oldPendingBusinessOrdersLength + productsToPush.length >=
            ORDERS_LIMIT
          ) {
            break
          }
          productsPushedCounter++
          product.amount -= 1
          productsToPush.push(product['productID'])
        }
      }

      // The ordersToAdd's property of each business is populated with products that will be pushed into its pending orders list
      ordersToAdd[businessID] = productsToPush

      // Here we are setting each business' pending business orders array
      // as the sum of the current pending orders and the orders to add
      // using the spread operator
      pendingBusinessOrdersCopy[businessID] = [
        ...pendingBusinessOrdersCopy[businessID],
        ...ordersToAdd[businessID],
      ]
    }

    // Update the global pendingBusinessOrders state with the new values
    set(() => ({ pendingBusinessOrders: pendingBusinessOrdersCopy }))

    try {
      await updateDbOrders(pendingBusinessOrdersCopy)
      return true
    } catch (error) {
      console.error(error)
      set(() => ({ pendingBusinessOrders: oldPendingBusinessOrders }))
      return false
    }
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({ pendingBusinessOrders: savedPendingBusinessOrders }))
  },
}))
