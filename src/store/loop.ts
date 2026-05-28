import { create } from 'zustand'

interface LoopState {
  offlineDelta: number
  offlineProgressProcessed: boolean
  processOfflineProgress: (offlineDelta: number) => Promise<boolean>
  setOfflineDelta: (lastSavedAt: number, currentTime: number) => number
}

export const useLoop = create<LoopState>((set, get) => ({
  offlineDelta: 0,
  offlineProgressProcessed: false,
  processOfflineProgress: async (offlineDelta: number): Promise<boolean> => {
    if (!get().offlineProgressProcessed) {
      set(() => ({ offlineProgressProcessed: true }))

      // processing simulation with promises
      const promises = [
        new Promise((resolve) => {
          setTimeout(() => resolve('action 1 completed'), 2000)
        }),
        new Promise((resolve) => {
          setTimeout(() => resolve('action 2 completed'), 3000)
        }),
        new Promise((resolve) => {
          setTimeout(() => resolve('action 3 completed'), 4000)
        }),
      ]

      const processStuff = async () => {
        try {
          console.log('start processing')
          const results = await Promise.all(promises)
          console.log('All completed!', results)
          return true
        } catch (error) {
          console.error('Something went wrong :(', error)
          return false
        }
      }
      if (await processStuff()) {
        return true
      }
      set(() => ({ offlineProgressProcessed: false }))
      return false
    }
    return false
  },
  setOfflineDelta: (lastSavedAt: number, currentTime: number) => {
    set(() => ({ offlineDelta: currentTime - lastSavedAt }))
    return currentTime - lastSavedAt
  },
}))
