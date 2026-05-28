import { create } from 'zustand'
import type { ElapsedTimeResult } from '#/types'
import { db } from '#/db/initDb'

interface TimeState {
  time: Record<string, number>
  setTime: (timeObj: ElapsedTimeResult) => void
  setLastSavedAt: (lastSavedAt: number) => Promise<boolean>
}

export const useTime = create<TimeState>((set, get) => ({
  time: {},
  accumulator: 0,
  isLoopRunning: false,
  setTime: async (timeObj: ElapsedTimeResult) => {
    const currentTime = get().time
    const currentTimeCopy = { ...currentTime }
    currentTimeCopy['elapsedTime'] = timeObj.elapsedTime
    currentTimeCopy['elapsedSeconds'] = timeObj.elapsedSeconds
    set(() => ({ time: currentTimeCopy }))
  },
  setLastSavedAt: async (lastSavedAt: number) => {
    const currentTime = get().time
    const currentTimeCopy = { ...currentTime }
    currentTimeCopy['lastSavedAt'] = lastSavedAt
    set(() => ({ time: currentTimeCopy }))

    try {
      await db.update((data) => {
        data.lastSavedAt = Date.now()
      })
      console.log('Game auto-saved.')
      return true
    } catch (error) {
      console.error('Auto-save failed', error)
      set(() => ({ time: currentTime }))
      return false
    }
  }
}))
