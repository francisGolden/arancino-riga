import { create } from 'zustand'

interface LoopState {
  tick: number
  offlineDelta: number
  updateTick: (currentTime: number) => void
  processTick: (tick: number) => void
  setOfflineDelta: (lastSavedAt: number,
    currentTime: number,) => void
}

export const useLoop = create<LoopState>((set, get) => ({
  tick: 0,
  offlineDelta: 0,
  updateTick: (currentTime: number): void => {},
  processTick: (tick: number) => {},
  setOfflineDelta: (lastSavedAt: number,
    currentTime: number,) => {
    set(() => ({offlineDelta: currentTime - lastSavedAt}))
  }
}))
