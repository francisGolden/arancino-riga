import { create } from 'zustand'
import type { InventoriesState } from '#/types'
import { db } from '#/db/initDb'
import { useMoney } from './currency'

const updateDbInventories = async (
  newInventories: Record<string, Record<string, number>>,
) => {
  try {
    await db.update((data) => (data.inventories = newInventories))
    console.log('inventory updated on db')
  } catch (error) {
    console.error('could not update inventory', error)
  }
}

export const useInventories = create<InventoriesState>((set, get) => ({
  inventories: {},
  buyItemForBusiness: async (
    id: string,
    cost: number,
    businessId: string,
  ): Promise<void> => {
    if (useMoney.getState().money < cost) {
      console.log('not enough funds for this purchase')
      return
    }
    const inventoriesCopy = get().inventories
    const newInventories = { ...inventoriesCopy }

    const currentAmount = newInventories[businessId][id] || 0
    newInventories[businessId][id] = currentAmount + 1

    set(() => ({ inventories: newInventories }))
    const updatedInventories = get().inventories

    try {
      await updateDbInventories(updatedInventories)
      useMoney.getState().decreaseMoney(cost)
    } catch (error) {
      console.error('could not buy item for business', error)
    }
  },
  sellBusinessItem: async (id: string, cost: number, businessId: string): Promise<void> => {
    console.log('sell', id, cost, businessId)

    const inventoriesCopy = get().inventories

    if (id in inventoriesCopy[businessId]) {
    } else {
        console.log('item. not in business inventory. cannot sell')
        return
    }

    const newInventories = { ...inventoriesCopy }
    newInventories[businessId][id] -= 1

    if (newInventories[businessId][id] <= 0) {
        delete newInventories[businessId][id]
    }

    set(() => ({ inventories: newInventories }))

    const updatedInventories = get().inventories

    try {
        await updateDbInventories(updatedInventories)
        useMoney.getState().increaseMoney(cost)
    } catch (error) {
        console.error('could not sell item from business inventory', error)
    }
    
  },
  addBusinessToInventory: async (businessId: string): Promise<void> => {
    const currentInventories = get().inventories
    const inventoriesCopy = { ...currentInventories }

    inventoriesCopy[businessId] = {}
    set(() => ({ inventories: inventoriesCopy }))

    const updatedInventories = get().inventories

    try {
      await updateDbInventories(updatedInventories)
    } catch (error) {
      console.error('could not add business to inventory', error)
    }
  },
  hydrateInventories: (
    savedInventories: Record<string, Record<string, number>>,
  ): void => {
    set(() => ({ inventories: savedInventories }))
  },
}))
