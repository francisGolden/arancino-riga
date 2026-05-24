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
  buyBusiness: async (id: string, cost: number) => {
    const currentOwnedBusinesses = get().ownedBusinesses
    if (currentOwnedBusinesses.includes(id)) {
        console.log('business already owned')
        return
    }

    if (useMoney.getState().money < cost) {
        console.log('not enough funds for this purchase')
        return
    }

    set((state) => ({ ownedBusinesses: [...state.ownedBusinesses, id] }))
    useMoney.getState().decreaseMoney(cost)

    useInventories.getState().addBusinessToInventory(id)
    
    const updatedBusinesses = get().ownedBusinesses
    await updateDbBusiness(updatedBusinesses)
  },
  sellBusiness: async (id: string, cost: number) => {
    const currentOwnedBusinesses = get().ownedBusinesses
    const match = currentOwnedBusinesses.includes(id)
    if (!match) {
        console.log('cannot sell because I do not own this business')
        return
    }
    
    useMoney.getState().increaseMoney(cost)
    const newOwnedBusinesses = currentOwnedBusinesses.filter((currentOwnedBusinessId: string) => currentOwnedBusinessId !== id)
    set(() => ({ ownedBusinesses: newOwnedBusinesses }))

    const updatesBusinesses = get().ownedBusinesses
    await updateDbBusiness(updatesBusinesses)
  },
  setBusinessList: async(list: string[]) => {
    set(() => ({ ownedBusinesses: list}))
    await updateDbBusiness(list)
  },
  hydrateBusinessList: (savedBusinesses: string[]): void => set({ ownedBusinesses: savedBusinesses }),
}))