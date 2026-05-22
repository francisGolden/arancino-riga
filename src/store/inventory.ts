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
  createProduct: async (id: string) => {
    const catalogIngredients = RECIPE_CATALOG[id].ingredients
    console.log(get().inventory)
    const iterableInventory = Object.entries(get().inventory)

    // work in progress.
    for (const [ingredientId, availableQuantity] of iterableInventory) {
        console.log(ingredientId)
        const quantityNeeded = catalogIngredients[ingredientId]
        console.log(quantityNeeded, availableQuantity)
    }
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
