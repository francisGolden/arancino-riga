import { create } from 'zustand'
import type { ElapsedTimeResult } from '#/types'
import { db } from '#/db/initDb'

interface TimeState {
  time: Record<string, number>
  accumulator: number
  isLoopRunning: boolean
  setTime: (timeObj: ElapsedTimeResult) => void
  setLastSavedAt: (lastSavedAt: number) => Promise<boolean>
  startLoop: () => void,
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
      console.log('process stuff...')
      set(() => ({accumulator: 0}))
      return true
    } catch (error) {
      console.error('Auto-save failed', error)
      set(() => ({ time: currentTime }))
      return false
    }
  },
  startLoop: () => {
    // console.log('starting loop...')
    // if (get().isLoopRunning) return

    // const intervalId = window.setInterval(() => {
    //     set(() => ({isLoopRunning: true}))
    //     set((state) => ({accumulator: ++state.accumulator}))
    //     console.log(get().accumulator)
    // }, 1000)
    // window.clearInterval(intervalId)
  },
  stopLoop: () => {
    set(() => ({isLoopRunning: false}))
  }
}))
