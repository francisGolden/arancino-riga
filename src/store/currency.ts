import { create } from "zustand"
import type { MoneyState } from "#/types"

const useMoney = create<MoneyState>((set) => ({
    money: 0,
    increaseMoney: (amount: number) => set((state) => ({ money: state.money + amount })),
    decreaseMoney: (amount: number) => set((state) => ({ money: state.money - amount }))
}))