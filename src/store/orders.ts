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

    // 2. CALCOLO DELLA TRANSAZIONE
    for (const [businessId, arr] of Object.entries(pendingOrders)) {
      // Usiamo un ciclo for standard invece del forEach
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]

        // Aggiungiamo un fallback a || 0 nel caso l'item non esista affatto nel dizionario
        const itemAvailableAmount = inventoriesCopy[businessId][item] || 0

        if (itemAvailableAmount > 0) {
          // A. Scaliamo l'inventario locale
          inventoriesCopy[businessId][item] -= 1

          // B. Rimuoviamo ESATTAMENTE UN ordine dalla coda locale
          const orderIndex = pendingOrdersCopy[businessId].indexOf(item)
          if (orderIndex > -1) {
            pendingOrdersCopy[businessId].splice(orderIndex, 1)
          }

          // C. Accumuliamo i ricavi
          totalMoneyEarned += PRODUCTS_CATALOG[item].baseSellingPrice
        } else {
          // Il collo di bottiglia! Non ho risorse per questo specifico ordine.
          console.log(`Risorse esaurite per ${item}. Ordine saltato.`)
          // Usiamo 'continue' per passare al prossimo ordine nella coda,
          // perché magari non ho vaniglia, ma ho risorse per l'ordine successivo di cioccolato!
          continue
        }
      }
    }

    if (totalMoneyEarned === 0) {
      console.log('Nessun ordine evaso in questo ciclo.')
      return false
    }

    console.log('Nuovo inventario pronto:', inventoriesCopy)
    console.log('Nuova coda ordini pronta:', pendingOrdersCopy)
    console.log('Totale da incassare:', totalMoneyEarned)

    // TODO: Manca la Fase 3! (Il set() di Zustand)
    set(() => ({pendingBusinessOrders: pendingOrdersCopy}))
    useInventories.getState().hydrateInventories(inventoriesCopy)
    useMoney.getState().increaseMoneyMemory(totalMoneyEarned)
    // TODO: Manca la Fase 4! (Il salvataggio su DB e il try...catch per il rollback)

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
  fulfillOrder: async (
    businessId: string,
    productId: string,
  ): Promise<boolean> => {
    // TODO: find out why there is an issue when dealing with several business orders added both automatically and manually
    // Not sure if the bug originates from this function or not.

    // TODO: the orders should not be fulfilled if there are no workers to sell them
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
    const pendingBusinessOrders = get().pendingBusinessOrders

    let pendingOrdersNumber = 0
    Object.entries(pendingBusinessOrders).forEach(([businessId, orders]) => {
      orders.forEach(() => {
        pendingOrdersNumber += 1
      })
    })

    if (pendingOrdersNumber === 0) {
      return false
    }

    const pendingOrdersList: { businessId: string; order: string }[] = []
    Object.entries(pendingBusinessOrders).forEach(([businessId, orders]) => {
      const businessOrderRate =
        BUSINESS_CATALOG.find((business) => business.id === businessId)
          ?.baseOrderRate || 1
      const ordersToProcess = orders.slice(0, businessOrderRate)
      ordersToProcess.forEach((order) => {
        pendingOrdersList.push({ businessId, order })
      })
    })

    const myPromisesArray = pendingOrdersList.map(
      async ({ businessId, order }) => {
        return get()
          .fulfillOrder(businessId, order)
          .then((fulfilledOrder) => {
            return fulfilledOrder
          })
          .catch((error) => {
            console.error(`Errore nell'ordine per ${businessId}:`, error)
            return false
          })
      },
    )

    try {
      await Promise.allSettled(myPromisesArray)
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
