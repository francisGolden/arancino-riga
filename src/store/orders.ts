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
    // TODO: FIX ORDERS REMAINING IN THE PENDING ORDER LIST BUT NOT BEING FULFILLED 
    return true
    
    
    // // 1. Deep clonation
    // // structuredClone cuts all the ties with the zustand original state
    // const pendingOrders = get().pendingBusinessOrders
    // const pendingOrdersCopy = structuredClone(pendingOrders)

    // const inventories = useInventories.getState().inventories
    // const inventoriesCopy = structuredClone(inventories)

    // console.log('pending orders copy', pendingOrdersCopy)
    

    // let totalMoneyEarned = 0

    // // 2. Transaction processing
    // for (const [businessId, arr] of Object.entries(pendingOrders)) {
    //   console.log('current inventory of the busines', inventories[businessId])
    //   const businessEmployees = useEmployees
    //     .getState()
    //     .getBusinessEmployees(businessId)

    //   let combinedSellingWorkRate = 0
    //   for (const employee of businessEmployees) {
    //     combinedSellingWorkRate += EMPLOYEES_CATALOG[employee].workRate.selling
    //   }
    //   console.log(combinedSellingWorkRate)

    //   if (combinedSellingWorkRate <= 0) {
    //     continue
    //   }

    //   let ordersProcessedThisTick = 0

    //   // eslint-disable-next-line @typescript-eslint/prefer-for-of
    //   for (let i = 0; i < arr.length; i++) {
    //     // Employee workrate lock
    //     // interrupt the loop when the combined workrate of employees has been reached
    //     if (ordersProcessedThisTick >= combinedSellingWorkRate) {
    //       break
    //     }

    //     const item = arr[i]

    //     // Fallback if the item does not exist in the dictionary
    //     const itemAvailableAmount = inventoriesCopy[businessId][item] || 0

    //     if (itemAvailableAmount > 0) {
    //       // A. Reduce local inventory item
    //       inventoriesCopy[businessId][item] -= 1

    //       // B. Remove an order from the local queue
    //       const orderIndex = pendingOrdersCopy[businessId].indexOf(item)
    //       if (orderIndex > -1) {
    //         pendingOrdersCopy[businessId].splice(orderIndex, 1)
    //       }

    //       // C. Accumulate the profits
    //       totalMoneyEarned += PRODUCTS_CATALOG[item].baseSellingPrice

    //       ordersProcessedThisTick++
    //     } else {
    //       // Bottleneck: no resources
    //       console.log(`Finished the resources for ${item}. Order skipped.`)
    //       // continue: go to the next order in the queue
    //       continue
    //     }
    //   }
    // }

    // if (totalMoneyEarned === 0) {
    //   console.log('No order fulfilled in this cycle')
    //   return false
    // }

    // set(() => ({ pendingBusinessOrders: pendingOrdersCopy }))
    // useInventories.getState().hydrateInventories(inventoriesCopy)
    // useMoney.getState().increaseMoneyMemory(totalMoneyEarned)

    // try {
    //   await Promise.all([
    //     updateDbOrders(pendingOrdersCopy),
    //     updateDbMoney(useMoney.getState().money),
    //     updateDbInventories(inventoriesCopy),
    //   ])
    //   return true
    // } catch (error) {
    //   set(() => ({ pendingBusinessOrders: pendingOrders }))
    //   useInventories.getState().hydrateInventories(inventories)
    //   useMoney.getState().decreaseMoney(totalMoneyEarned)
    //   return false
    // }
  },
  processAddOrders: async (): Promise<boolean> => {
    // 1. FOTOGRAFIA INIZIALE
    const pendingOrders = get().pendingBusinessOrders
    const pendingOrdersCopy = structuredClone(pendingOrders)
    const MARKET_DEMAND = 7
    const MAX_QUEUE_SIZE = 20
    const inventories = useInventories.getState().inventories

    // 2. CALCOLO IN MEMORIA (Nessun set() qui dentro!)
    for (const [businessId, businessInventoryObject] of Object.entries(
      inventories,
    )) {
      // Safety: garantiamo che la coda esista per questo locale
      pendingOrdersCopy[businessId] ??= []

      const availableSlots =
        MAX_QUEUE_SIZE - pendingOrdersCopy[businessId].length
      if (availableSlots <= 0) {
        console.log('La coda è troppo lunga, i clienti se ne vanno!')
        continue
      }

      // Filtriamo per trovare SOLO i prodotti finiti che abbiamo fisicamente in vetrina
      const availableProductsInDisplay = Object.keys(
        businessInventoryObject,
      ).filter(
        (key) => key in PRODUCTS_CATALOG && businessInventoryObject[key] > 0,
      )

      // Se non abbiamo niente da vendere in questo locale, passiamo al prossimo
      if (availableProductsInDisplay.length === 0) continue

      // RNG: Generiamo clienti casuali fino alla domanda di mercato o agli slot disponibili
      const ordersToGenerate = Math.min(MARKET_DEMAND, availableSlots)
      let businessOrdersProcessed = 0

      while (businessOrdersProcessed < ordersToGenerate) {
        const randomProductIndex = Math.floor(
          Math.random() * availableProductsInDisplay.length,
        )
        const randomProduct = availableProductsInDisplay[randomProductIndex]
        pendingOrdersCopy[businessId].push(randomProduct)
        businessOrdersProcessed++
      }

      console.log(
        `Nuovi ordini misti per ${businessId}:`,
        pendingOrdersCopy[businessId],
      )
    }

    // 3. SINGOLO AGGIORNAMENTO DI STATO (Fuori dal loop!)
    set(() => ({ pendingBusinessOrders: pendingOrdersCopy }))

    // 4. SALVATAGGIO SU DB E ROLLBACK
    try {
      await updateDbOrders(pendingOrdersCopy)
      console.log('Generazione domanda completata e salvata con successo.')
      return true
    } catch (error) {
      console.error('Errore di rete durante il salvataggio della coda:', error)
      set(() => ({ pendingBusinessOrders: pendingOrders })) // Rollback istantaneo
      return false
    }
  },
  hydrateOrders: (savedPendingBusinessOrders: Record<string, string[]>) => {
    set(() => ({ pendingBusinessOrders: savedPendingBusinessOrders }))
  },
}))
