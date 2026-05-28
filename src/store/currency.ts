import { create } from 'zustand'
import type { MoneyState } from '#/types'
import { db } from '#/db/initDb'

const updateDbMoney = async (currentMoney: number) => {
  try {
    await db.update((data) => (data.money = currentMoney))
    console.log('money updated')
  } catch (error) {
    console.error('could not update money', error)
  }
}

export const useMoney = create<MoneyState>((set, get) => ({
  money: 0,
  increaseMoney: async (amount: number) => {
    const currentMoney = get().money
    const newMoney = currentMoney + amount

    set(() => ({ money: newMoney }))

    try {
      await updateDbMoney(currentMoney)
      return true
    } catch (error) {
      console.error('could not increase money')
      set(() => ({ money: currentMoney }))
      return false
    }
    
  },
  decreaseMoney: async (amount: number) => {
    const currentMoney = get().money
    const newMoney = currentMoney + amount
    set(() => ({ money: newMoney }))

    try {
      await updateDbMoney(currentMoney)
      return true
    } catch (error) {
      console.error('could not decrease money', error)
      return false
    }
  
  },
  setMoney: async(amount: number) => {
    set(() => ({ money: amount}))
    await updateDbMoney(amount)
  },
  hydrateMoney: (savedAmount: number): void => set({ money: savedAmount }),
}))
