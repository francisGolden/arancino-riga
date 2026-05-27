import { create } from 'zustand'
import type { ElapsedTimeResult } from '#/types'
import { db } from '#/db/initDb'

interface TimeState {
  time: Record<string, number>
  processSomething: (timeSinceLastSaved: number) => () => Promise<boolean>
  setTime: (timeObj: ElapsedTimeResult) => void
  setLastSavedAt: (lastSavedAt: number) => Promise<boolean>
  gameLoop: () => void
}

export const useTime = create<TimeState>((set, get) => ({
  time: {},
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
    const lastSavedAt = get().time.lastSavedAt || db.data.lastSavedAt
    const now = Date.now()
    const timeDifference = now - lastSavedAt
    const processSomethingWrapper = get().processSomething(timeDifference)
    processSomethingWrapper()
  },
  processSomething: (timeSinceLastSave) => {
    // function to explore the logic needed to process actions like orders, etc
    // through a catch-up mechanic that looks at the time difference between lastSavedAt and Date.now()

    // for example, if I know that an order is requested every x ticks and is completed every y ticks,
    // I can process z amount of orders depending on the time lasted since the last save.

    let ordersToProcess = 0
    return async function () {
      ordersToProcess = ordersToProcess + (timeSinceLastSave/1000)
      console.log('orders to process: ', ordersToProcess, 'timeSinceLastSave: ', timeSinceLastSave)
      return true
    }
  },
}))
