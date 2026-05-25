import { create } from 'zustand'
import type { BusinessListState } from '#/types'
import { db } from '#/db/initDb'
import { useMoney } from './currency'
import { useInventories } from './inventories'

const updateDbBusiness = async (newCurrentBusinesses: string[]) => {
  try {
    await db.update((data) => (data.ownedBusinesses = newCurrentBusinesses))
    console.log('businesses updated on db')
  } catch (error) {
    console.error('could not update businesses', error)
  }
}

export const useBusiness = create<BusinessListState>((set, get) => ({
  ownedBusinesses: [],
  buyBusiness: async (id: string, cost: number): Promise<boolean> => {
    const currentOwnedBusinesses = get().ownedBusinesses
    if (currentOwnedBusinesses.includes(id)) {
      console.log('business already owned')
      return false
    }

    if (useMoney.getState().money < cost) {
      console.log('not enough funds for this purchase')
      return false
    }
    const ownedBusinessesCopy = [...currentOwnedBusinesses]

    ownedBusinessesCopy.push(id)

    set(() => ({ ownedBusinesses: ownedBusinessesCopy }))

    useInventories.getState().addBusinessToInventory(id)
    useMoney.getState().decreaseMoney(cost)

    try {
      await updateDbBusiness(ownedBusinessesCopy)
      return true
    } catch (error) {
      console.error('cannot buy business', error)
      set(() => ({ ownedBusinesses: currentOwnedBusinesses }))
      useMoney.getState().increaseMoney(cost)

      // TO-DO: add also removeBusinessFromInventory(id)
      return false
    }
  },
  sellBusiness: async (id: string, cost: number): Promise<boolean> => {
    const currentOwnedBusinesses = get().ownedBusinesses
    const match = currentOwnedBusinesses.includes(id)
    if (!match) {
      console.log('cannot sell because I do not own this business')
      return false
    }

    const newOwnedBusinesses = currentOwnedBusinesses.filter(
      (currentOwnedBusinessId: string) => currentOwnedBusinessId !== id,
    )

    set(() => ({ ownedBusinesses: newOwnedBusinesses }))
    useMoney.getState().increaseMoney(cost)

    try {
      await updateDbBusiness(newOwnedBusinesses)
      return true
    } catch (error) {
      set(() => ({ ownedBusinesses: currentOwnedBusinesses }))
      useMoney.getState().decreaseMoney(cost)
      console.error('cannot sell business')
      return false
    }
  },
  setBusinessList: async (list: string[]) => {
    set(() => ({ ownedBusinesses: list }))
    await updateDbBusiness(list)
  },
  hydrateBusinessList: (savedBusinesses: string[]): void =>
    set({ ownedBusinesses: savedBusinesses }),
}))
