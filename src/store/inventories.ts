import { create } from 'zustand'
import type { InventoriesState } from '#/types'
import { db } from '#/db/initDb'
import { useMoney } from './currency'
import { RECIPE_CATALOG } from '#/db/recipeList'

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
  craftBusinessProduct: async (
    recipeItemId: string,
    businessId: string,
  ): Promise<void> => {
    console.log(recipeItemId, businessId)
    console.log(RECIPE_CATALOG[recipeItemId].productId)
    const itemId = RECIPE_CATALOG[recipeItemId].productId
    const ingredients = RECIPE_CATALOG[recipeItemId].ingredients
    const yieldAmount = RECIPE_CATALOG[recipeItemId].yieldAmount
    const currentInventories = get().inventories
    const inventoriesCopy = { ...currentInventories }

    const iterableRecipeIngredients = Object.entries(
      RECIPE_CATALOG[recipeItemId].ingredients,
    )

    console.log(ingredients)

    // look up if the business has enough ingredients
    let checkIngredients = true
    for (const [ingredientId, amountNeeded] of iterableRecipeIngredients) {
      console.log(inventoriesCopy[businessId][ingredientId])
      const amountHad = inventoriesCopy[businessId][ingredientId] || 0
      if (!amountHad || amountHad < amountNeeded) {
        checkIngredients = false
      }
    }

    if (!checkIngredients) {
      console.log('not enough ingredients')
      return
    }

    // remove ingredients from inventory
    for (const [ingredientId, amountNeeded] of iterableRecipeIngredients) {
      inventoriesCopy[businessId][ingredientId] -= amountNeeded
    }

    const currentAmount = inventoriesCopy[businessId][itemId] || 0
    inventoriesCopy[businessId][itemId] = currentAmount + yieldAmount

    set(() => ({ inventories: inventoriesCopy }))
    const updatedInventories = get().inventories

    try {
      await updateDbInventories(updatedInventories)
    } catch (error) {
      console.error('could not update inventories with crafted item')
    }
  },
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
  sellBusinessItem: async (
    id: string,
    cost: number,
    businessId: string,
  ): Promise<void> => {
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
