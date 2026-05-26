import { create } from 'zustand'
import type { InventoriesState, RecipeConfig } from '#/types'
import { db } from '#/db/initDb'
import { useMoney } from './currency'
import { useEmployees } from './employees'
import { RECIPE_CATALOG } from '#/db/recipeList'
import { EMPLOYEES_CATALOG } from '#/db/employeesCatalog'

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
    allowedItems: string[]
  ): Promise<void> => {
    const itemId = RECIPE_CATALOG[recipeItemId].productId

    let checkAllowedItems = false
    for (const item of allowedItems) {
        if (item === itemId) {
            checkAllowedItems = true
        }
    }

    if (!checkAllowedItems) {
        console.log('item not allowed to be crafted for this business')
        return
    }

    // Preparation for Employee crafting
    // const businessEmployees = useEmployees.getState().businessEmployees[businessId]
    // console.log(businessEmployees, EMPLOYEES_CATALOG)
    // for (const employee of businessEmployees) {
    //   if (Object.keys(EMPLOYEES_CATALOG).includes(employee)) {
    //     console.log(EMPLOYEES_CATALOG[employee])
    //   }
    // }

    const ingredients = RECIPE_CATALOG[recipeItemId].ingredients
    const yieldAmount = RECIPE_CATALOG[recipeItemId].yieldAmount

    const currentInventories = get().inventories

    const inventoriesCopy = {
      ...currentInventories,
      [businessId]: { ...currentInventories[businessId] },
    }

    const iterableRecipeIngredients = Object.entries(ingredients)

    // look up if the business has enough ingredients
    let checkIngredients = true
    for (const [ingredientId, amountNeeded] of iterableRecipeIngredients) {
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

    try {
      await updateDbInventories(inventoriesCopy)
    } catch (error) {
      console.error('could not update inventories with crafted item')
      // revert state on failure
      set(() => ({ inventories: currentInventories }))
    }
  },
  buyItemForBusiness: async (
    id: string,
    cost: number,
    businessId: string,
    allowedItems: string[]
  ): Promise<void> => {
    if (useMoney.getState().money < cost) {
      console.log('not enough funds for this purchase')
      return
    }

    let checkAllowedItems = false
    for (const item of allowedItems) {
        if (item === id) {
            checkAllowedItems = true
        }
    }

    if (!checkAllowedItems) {
        console.log('item not allowed to be bought for this business')
        return
    }

    const currentInventories = get().inventories
    const inventoriesCopy = {
      ...currentInventories,
      [businessId]: { ...currentInventories[businessId] },
    }

    const currentAmount = inventoriesCopy[businessId][id] || 0
    inventoriesCopy[businessId][id] = currentAmount + 1

    set(() => ({ inventories: inventoriesCopy }))
    useMoney.getState().decreaseMoney(cost)

    try {
      await updateDbInventories(inventoriesCopy)
    } catch (error) {
      console.error('could not buy item for business', error)
      set(() => ({ inventories: currentInventories }))
      useMoney.getState().increaseMoney(cost)
    }
  },
  sellBusinessItem: async (
    id: string,
    cost: number,
    businessId: string,
  ): Promise<void> => {
    console.log('sell', id, cost, businessId)

    const currentInventories = get().inventories

    if (id in currentInventories[businessId]) {
    } else {
      console.log('item. not in business inventory. cannot sell')
      return
    }

    const inventoriesCopy = {
      ...currentInventories,
      [businessId]: { ...currentInventories[businessId] },
    }

    inventoriesCopy[businessId][id] -= 1

    if (inventoriesCopy[businessId][id] <= 0) {
      delete inventoriesCopy[businessId][id]
    }

    set(() => ({ inventories: inventoriesCopy }))
    useMoney.getState().increaseMoney(cost)

    try {
      await updateDbInventories(inventoriesCopy)
    } catch (error) {
      console.error('could not sell item from business inventory', error)
      set(() => ({ inventories: currentInventories }))
      useMoney.getState().decreaseMoney(cost)
    }
  },
  addBusinessToInventory: async (businessId: string): Promise<void> => {
    const currentInventories = get().inventories
    const inventoriesCopy = {
      ...currentInventories,
      [businessId]: { ...currentInventories[businessId] },
    }

    inventoriesCopy[businessId] = {}
    set(() => ({ inventories: inventoriesCopy }))

    try {
      await updateDbInventories(inventoriesCopy)
    } catch (error) {
      console.error('could not add business to inventory', error)
      set(() => ({ inventories: currentInventories }))
    }
  },
  getAllowedRecipes: (allowedItems: string[], recipe_catalog: Record<string, RecipeConfig>) => {
    const allowedRecipes = []
    const iterableRecipeCatalog = Object.entries(recipe_catalog)

    for (const [recipeName, recipeObject] of iterableRecipeCatalog) {
      for (const allowedItem of allowedItems) {
        if (allowedItem === recipeObject.productId) {
          allowedRecipes.push({...recipeObject, recipeName})
        }
      }
    }
    return allowedRecipes

  },
  hydrateInventories: (
    savedInventories: Record<string, Record<string, number>>,
  ): void => {
    set(() => ({ inventories: savedInventories }))
  },
}))
