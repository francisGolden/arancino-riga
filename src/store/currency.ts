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
    set((state) => ({ money: state.money + amount }))

    const currentMoney = get().money
    await updateDbMoney(currentMoney)
  },
  decreaseMoney: async (amount: number) => {
    set((state) => ({ money: state.money - amount }))

    const currentMoney = get().money
    await updateDbMoney(currentMoney)

  },
  setMoney: async(amount: number) => {
    set(() => ({ money: amount}))
    await updateDbMoney(amount)
  },
  hydrateMoney: (savedAmount: number): void => set({ money: savedAmount }),
}))
