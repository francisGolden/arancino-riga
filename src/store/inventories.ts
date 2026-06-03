import { create } from 'zustand'
import type { EmployeeRole, InventoriesState, RecipeConfig } from '#/types'
import { db } from '#/db/initDb'
import { useMoney } from './currency'
import { useEmployees } from './employees'
import { RECIPE_CATALOG } from '#/db/recipeList'
import { EMPLOYEES_CATALOG } from '#/db/employeesCatalog'
import { INGREDIENTS_CATALOG } from '#/db/ingredientsCatalog'
import { useBusiness } from './business'
import { BUSINESS_CATALOG } from '#/db/businessList'
import { PRODUCTS_CATALOG } from '#/db/productsCatalog'

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
    allowedItems: string[],
    requiredRole: EmployeeRole,
  ): Promise<boolean> => {
    const itemId = RECIPE_CATALOG[recipeItemId].productId

    let checkAllowedItems = false
    for (const item of allowedItems) {
      if (item === itemId) {
        checkAllowedItems = true
      }
    }

    if (!checkAllowedItems) {
      console.log('item not allowed to be crafted for this business')
      return false
    }

    let checkRequiredEmployeeRoles = false
    // Preparation for Employee crafting
    const businessEmployees =
      useEmployees.getState().businessEmployees[businessId]
    for (const employee of businessEmployees) {
      if (Object.keys(EMPLOYEES_CATALOG).includes(employee)) {
        if (EMPLOYEES_CATALOG[employee].roles.includes(requiredRole)) {
          checkRequiredEmployeeRoles = true
        }
      }
    }

    if (!checkRequiredEmployeeRoles) {
      console.log('we cannot make this recipe with the current workforce')
      return false
    }

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
      return false
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
      return true
    } catch (error) {
      console.error('could not update inventories with crafted item')
      // revert state on failure
      set(() => ({ inventories: currentInventories }))
      return false
    }
  },
  processProductCrafting: async (): Promise<boolean> => {
    console.log('processing crafting...')
    console.log(get().inventories)
    const inventories = get().inventories
    const craftingPromises: Promise<any>[] = []
    for (const [value, obj] of Object.entries(inventories)) {
      console.log(value, obj)
      const businessAllowedItems = BUSINESS_CATALOG.find((business) => business.id === value)?.allowedItems
      const businessId = value
      businessAllowedItems?.forEach((allowedItem) => {
        if (allowedItem in PRODUCTS_CATALOG) {
          const recipeObj = Object.entries(RECIPE_CATALOG).find(([key, obj]) => obj.productId === allowedItem) || []
          const requiredRole: any = recipeObj[1]?.requiredRole
          const recipeName: any = recipeObj[0]
          console.log('promise arguments', recipeName, businessId, businessAllowedItems, requiredRole)
          const promise = get().craftBusinessProduct(recipeName, businessId, businessAllowedItems, requiredRole).then((result) => 
            result
          ).catch((error) => {
            console.error('error in running the promise', error)
            return false
          })
          craftingPromises.push(promise)
        }
      })
    }

    if (craftingPromises.length === 0) {
      return false
    }

    try {
      await Promise.allSettled(craftingPromises)
      return true
    } catch (error) {
      console.error(error)
      return false
    }

  },
  buyRecipeIngredients: async (
    recipeName: string,
    allowedItems: string[],
    businessId: string,
  ): Promise<boolean> => {
    const requiredIngredients = RECIPE_CATALOG[recipeName].ingredients

    let totalCost = 0

    for (const requiredIngredient of Object.keys(requiredIngredients)) {
      totalCost += INGREDIENTS_CATALOG[requiredIngredient].baseCost * RECIPE_CATALOG[recipeName].ingredients[requiredIngredient]
    }

    if (useMoney.getState().money < totalCost) {
      return false
    }

    const buyIngredientsPromises = []
    for (const requiredIngredient of Object.keys(requiredIngredients)) {
      console.log('buying ...', INGREDIENTS_CATALOG[requiredIngredient].id)
      const obj = {
        id: INGREDIENTS_CATALOG[requiredIngredient].id,
        cost: INGREDIENTS_CATALOG[requiredIngredient].baseCost,
        businessId,
        allowedItems,
        amount: RECIPE_CATALOG[recipeName].ingredients[requiredIngredient]
      }
      const myPromise = new Promise((resolve) => {
        setTimeout(async () => {
          try {
            const success = await get().buyItemForBusiness(obj.id, obj.cost, businessId, allowedItems, obj.amount)
            if (success) {
              resolve(true)
            } else {
              resolve(false)
            }
          } catch (error) {
            console.error(error)
            resolve(false)
          }
        }, 1000)
      })
      buyIngredientsPromises.push(myPromise)
    }

    try {
      const results = await Promise.all(buyIngredientsPromises)
      const checkPromises = results.every((item) => item === true)
      return checkPromises
    } catch (error) {
      console.error(error)
      return false
    }
  },
  buyItemForBusiness: async (
    id: string,
    cost: number,
    businessId: string,
    allowedItems: string[],
    amount?: number
  ): Promise<boolean> => {
    if (useMoney.getState().money < cost) {
      console.log('not enough funds for this purchase')
      return false
    }

    let checkAllowedItems = false
    for (const item of allowedItems) {
      if (item === id) {
        checkAllowedItems = true
      }
    }

    if (!checkAllowedItems) {
      console.log('item not allowed to be bought for this business')
      return false
    }

    const currentInventories = get().inventories
    const inventoriesCopy = {
      ...currentInventories,
      [businessId]: { ...currentInventories[businessId] },
    }

    const currentAmount = inventoriesCopy[businessId][id] || 0
    inventoriesCopy[businessId][id] = currentAmount + (amount || 1) 

    set(() => ({ inventories: inventoriesCopy }))
    useMoney.getState().decreaseMoney(cost)

    try {
      await updateDbInventories(inventoriesCopy)
      return true
    } catch (error) {
      console.error('could not buy item for business', error)
      set(() => ({ inventories: currentInventories }))
      useMoney.getState().increaseMoney(cost)
      return false
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
  getAllowedRecipes: (
    allowedItems: string[],
    recipe_catalog: Record<string, RecipeConfig>,
  ) => {
    const allowedRecipes: RecipeConfig[] = []
    const iterableRecipeCatalog = Object.entries(recipe_catalog)

    for (const [recipeName, recipeObject] of iterableRecipeCatalog) {
      for (const allowedItem of allowedItems) {
        if (allowedItem === recipeObject.productId) {
          // avoid duplicate recipes to craft
          if (
            !allowedRecipes.some(
              (allowedRecipe) =>
                allowedRecipe.productId === recipeObject.productId,
            )
          ) {
            allowedRecipes.push({ ...recipeObject, recipeName })
          }
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
