import { create } from 'zustand'

interface LoopState {
  offlineDelta: number
  offlineProgressStatus: 'idle' | 'processing' | 'done'
  processOfflineProgress: (offlineDelta: number) => Promise<boolean>
  setOfflineDelta: (lastSavedAt: number, currentTime: number) => number
}

export const useLoop = create<LoopState>((set, get) => ({
  offlineDelta: 0,
  offlineProgressStatus: 'idle',
  processOfflineProgress: async (offlineDelta: number): Promise<boolean> => {
    const offlineProgressStatus = get().offlineProgressStatus
    if (offlineProgressStatus === 'processing') {
      console.log('still processing...')
      return false
    }
    if (offlineProgressStatus === 'done') {
      console.log('already processed offline progress')
      return false
    }

    set(() => ({ offlineProgressStatus: 'processing' }))
    console.log('start processing')

    // offline processing simulation with promises
    const promises = [
      new Promise((resolve) => {
        setTimeout(
          () =>
            resolve('action 1 completed with offline delta ' + offlineDelta),
          2000,
        )
      }),
      new Promise((resolve) => {
        setTimeout(
          () =>
            resolve('action 2 completed with offline delta ' + offlineDelta),
          3000,
        )
      }),
      new Promise((resolve) => {
        setTimeout(
          () => resolve('action 3 completedwith offline delta ' + offlineDelta),
          4000,
        )
      }),
    ]

    try {
      const results = await Promise.allSettled(promises)
      set(() => ({ offlineProgressStatus: 'done' }))
      console.log('All completed!', results)
      return true
    } catch (error) {
      console.error('Something went wrong :(', error)
      set(() => ({
        offlineProgressStatus: 'idle',
      }))
      return false
    }
  },
  setOfflineDelta: (lastSavedAt: number, currentTime: number) => {
    set(() => ({ offlineDelta: currentTime - lastSavedAt }))
    return currentTime - lastSavedAt
  },
}))
