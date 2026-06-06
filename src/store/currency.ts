import { create } from 'zustand'
import type { MoneyState } from '#/types'
import { db } from '#/db/initDb'

export const updateDbMoney = async (newMoney: number) => {
  try {
    await db.update((data) => (data.money = newMoney))
  } catch (error) {
    console.error('could not update money', error)
  }
}

export const useMoney = create<MoneyState>((set, get) => ({
  money: 0,
  
  // -------------------------------------------------------------
  // Silent actions (SOLO RAM) - Use in the Game Loop / Bulk
  // -------------------------------------------------------------
  increaseMoneyMemory: (amount: number) => {
    set((state) => ({ money: state.money + amount }))
  },
  
  decreaseMoneyMemory: (amount: number) => {
    set((state) => ({ money: state.money - amount }))
  },

  // -------------------------------------------------------------
  // Actions with auto-save to DB - Use for user clicks
  // -------------------------------------------------------------
  increaseMoney: async (amount: number) => {
    const currentMoney = get().money
    const newMoney = currentMoney + amount // Calcoliamo il nuovo totale

    set(() => ({ money: newMoney })) // Aggiornamento ottimistico

    try {
      await updateDbMoney(newMoney) // SALVIAMO IL NUOVO TOTALE!
      return true
    } catch (error) {
      console.error('could not increase money', error)
      set(() => ({ money: currentMoney })) // Rollback al totale precedente
      return false
    }
  },

  decreaseMoney: async (amount: number) => {
    const currentMoney = get().money
    const newMoney = currentMoney - amount

    set(() => ({ money: newMoney }))

    try {
      await updateDbMoney(newMoney) // SALVIAMO IL NUOVO TOTALE!
      return true
    } catch (error) {
      console.error('could not decrease money', error)
      set(() => ({ money: currentMoney }))
      return false
    }
  },

  setMoney: async (amount: number) => {
    set(() => ({ money: amount }))
    await updateDbMoney(amount)
  },

  hydrateMoney: (savedAmount: number): void => set({ money: savedAmount }),
}))