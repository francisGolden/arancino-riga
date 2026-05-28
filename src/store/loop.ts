import { create } from 'zustand'

interface LoopState {
  tick: number
  offlineDelta: number
  updateTick: (currentTime: number) => void
  processOfflineProgress: (tick: number) => void
  setOfflineDelta: (lastSavedAt: number,
    currentTime: number,) => number
}

export const useLoop = create<LoopState>((set, get) => ({
  tick: 0,
  offlineDelta: 0,
  updateTick: (currentTime: number): void => {},
  processOfflineProgress: (offlineDelta: number) => {
    console.log('processing stuff considering that offline delta is ', offlineDelta)
  },
  setOfflineDelta: (lastSavedAt: number,
    currentTime: number,) => {
    set(() => ({offlineDelta: currentTime - lastSavedAt}))
    return currentTime - lastSavedAt
  }
}))
