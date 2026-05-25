import { create } from 'zustand'
import type { InventoryState } from '#/types'
import { db } from '#/db/initDb'
import { useMoney } from './currency'
import { RECIPE_CATALOG } from '#/db/recipeList'

const updateDbInventory = async (newInventory: Record<string, number>) => {
  try {
    await db.update((data) => (data.inventory = newInventory))
    console.log('inventory updated on db')
  } catch (error) {
    console.error('could not update inventory', error)
  }
}

export const useInventory = create<InventoryState>((set, get) => ({
  inventory: {},
  craftProduct: async (id: string) => {
    const recipeIngredients = RECIPE_CATALOG[id].ingredients
    const currentInventory = get().inventory
    const iterableRecipe = Object.entries(recipeIngredients)

    let canCraft = true

    for (const [ingredientId, amount] of iterableRecipe) {
      const isInInventory = currentInventory[ingredientId]
      const isEnough = currentInventory[ingredientId] >= amount
      if (!isInInventory || !isEnough) {
        canCraft = false
      }
    }

    if (!canCraft) {
      console.log('cannot craft because I do not have enough ingredients')
      return
    }

    // remove ingredients from the inventory
    const newInventory = { ...currentInventory }
    for (const [ingredientId, amount] of iterableRecipe) {
      console.log(ingredientId, currentInventory[ingredientId])
      newInventory[ingredientId] -= amount
      if (newInventory[ingredientId] <= 0) {
        delete newInventory[ingredientId]
      }
    }

    const productId = RECIPE_CATALOG[id].productId
    const yieldAmount = RECIPE_CATALOG[id].yieldAmount
    const amountAlreadyPresent = newInventory[RECIPE_CATALOG[id].productId] || 0

    newInventory[productId] = amountAlreadyPresent + yieldAmount

    set(() => ({ inventory: newInventory }))

    const updatedInventory = get().inventory
    await updateDbInventory(updatedInventory)
  },
  buyItem: async (id: string, cost: number) => {
    const currentInventory = get().inventory

    if (useMoney.getState().money < cost) {
      console.log('not enough funds for this purchase')
      return
    }

    if (currentInventory[id]) {
      console.log('item already owned. Increasing its number')
      set((state) => ({
        inventory: { ...state.inventory, [id]: state.inventory[id] + 1 },
      }))
    } else {
      set((state) => ({ inventory: { ...state.inventory, [id]: 1 } }))
    }

    useMoney.getState().decreaseMoney(cost)

    const updatedInventory = get().inventory
    await updateDbInventory(updatedInventory)
  },
  sellItem: async (id: string, cost: number) => {
    const currentInventory = get().inventory
    const match = currentInventory[id]
    if (!match) {
      console.log('cannot sell because I do not own this item')
      return
    }

    useMoney.getState().increaseMoney(cost)

    if (match === 1) {
      set((state) => {
        const { [id]: itemRemoved, ...restOfInventory } = state.inventory
        return { inventory: restOfInventory }
      })
    } else {
      set((state) => ({
        inventory: { ...state.inventory, [id]: state.inventory[id] - 1 },
      }))
    }

    const updatedInventory = get().inventory
    await updateDbInventory(updatedInventory)
  },
  setInventory: async (inventory: Record<string, number>) => {
    set(() => ({ inventory }))
    await updateDbInventory(inventory)
  },
  hydrateInventory: (savedInventory: Record<string, number>): void =>
    set({ inventory: savedInventory }),
}))
