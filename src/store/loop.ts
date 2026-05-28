import { create } from 'zustand'

interface LoopState {
  tick: number
  offlineDelta: number
  offlineProgressProcessed: boolean
  updateTick: (currentTime: number) => void
  processOfflineProgress: (offlineDelta: number) => boolean
  setOfflineDelta: (lastSavedAt: number, currentTime: number) => number
}

export const useLoop = create<LoopState>((set, get) => ({
  tick: 0,
  offlineDelta: 0,
  offlineProgressProcessed: false,
  updateTick: (currentTime: number): void => {},
  processOfflineProgress: (offlineDelta: number): boolean => {
    if (!get().offlineProgressProcessed) {
      set(() => ({ offlineProgressProcessed: true }))
      console.log(
        'processing stuff considering that offline delta is ',
        offlineDelta,
      )
      return true
    }
    console.log('offline progress already processed')
    return false
  },
  setOfflineDelta: (lastSavedAt: number, currentTime: number) => {
    set(() => ({ offlineDelta: currentTime - lastSavedAt }))
    return currentTime - lastSavedAt
  },
}))
