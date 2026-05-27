import { create } from 'zustand'
import type { ElapsedTimeResult } from '#/types'
import { db } from '#/db/initDb'

interface TimeState {
  time: Record<string, number>
  processSomething: (something: any) => Promise<boolean>
  setTime: (timeObj: ElapsedTimeResult) => void
  setLastSavedAt: (lastSavedAt: number) => Promise<boolean>
  gameLoop: () => void
}

export const useTime = create<TimeState>((set, get) => ({
  time: {},
  processSomething: async (something) => {
    console.log(something)
    return true
  },
  setTime: async (timeObj: ElapsedTimeResult) => {
    const currentTime = get().time
    const currentTimeCopy = { ...currentTime }
    currentTimeCopy['elapsedTime'] = timeObj.elapsedTime
    currentTimeCopy['elapsedSeconds'] = timeObj.elapsedSeconds
    set(() => ({ time: currentTimeCopy }))
    get().gameLoop()
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
  },
  gameLoop: () => {
    console.log('game loop')
    const elapsedTime = get().time.elapsedTime
    const lastSavedAt = get().time.lastSavedAt || db.data.lastSavedAt
    const now = Date.now()
    const timeDifference = now - lastSavedAt 
    console.log('elapsedTime: ', elapsedTime, 'lastSavedAt: ', lastSavedAt, 'now: ', now, 'timeDifference: ', timeDifference)
  },
}))
