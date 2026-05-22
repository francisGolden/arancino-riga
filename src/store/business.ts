import { create } from 'zustand'
import type { BusinessListState } from '#/types'
import { db } from '#/db/initDb'

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
  buyBusiness: async (id: string) => {
    const currentOwnedBusinesses = get().ownedBusinesses
    if (currentOwnedBusinesses.find((currentOwnedBusinessId: string) => currentOwnedBusinessId === id)) {
        console.log('business already owned')
        return
    }
    set((state) => ({ ownedBusinesses: [...state.ownedBusinesses, id] }))
    
    const updatedBusinesses = get().ownedBusinesses
    await updateDbBusiness(updatedBusinesses)
  },
  sellBusiness: async (id: string) => {
    const currentOwnedBusinesses = get().ownedBusinesses
    const match = currentOwnedBusinesses.find((currentOwnedBusinessId: string) => currentOwnedBusinessId === id)
    if (!match) {
        console.log('cannot sell because I do not own this business')
        return
    }
    
    const newOwnedBusinesses = currentOwnedBusinesses.filter((currentOwnedBusinessId: string) => currentOwnedBusinessId !== id)
    set((state) => ({ ownedBusinesses: newOwnedBusinesses }))

    const updatesBusinesses = get().ownedBusinesses
    await updateDbBusiness(updatesBusinesses)
  },
  setBusinessList: async(list: string[]) => {
    set(() => ({ ownedBusinesses: list}))
    await updateDbBusiness(list)
  },
  hydrateBusinessList: (savedBusinesses: string[]): void => set({ ownedBusinesses: savedBusinesses }),
}))