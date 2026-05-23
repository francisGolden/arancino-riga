import { create } from 'zustand'
import type { InventoriesState } from '#/types'
import { db } from '#/db/initDb'

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
    console.log('buying', id, cost, 'for', businessId)
    const currentInventories = get().inventories
    const newInventories = { ...currentInventories }
    
    const currentAmount = newInventories[businessId][id] || 0
    newInventories[businessId][id] = currentAmount + 1

    set(() => ({ inventories: newInventories }))
    const updatedInventories = get().inventories

    try {
        await updateDbInventories(updatedInventories)
    } catch (error) {
        console.error('could not buy item for business', error)
    }
    
  },
  addBusinessToInventory: async (businessId: string): Promise<void> => {
    const currentInventories = get().inventories
    const inventoriesCopy = { ...currentInventories }

    inventoriesCopy[businessId] = {}
    set(() => ({inventories: inventoriesCopy}))
    
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
