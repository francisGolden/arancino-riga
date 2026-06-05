import { useEffect } from 'react'
import type { ElapsedTimeResult } from '#/types'
import { getElapsedGameTime } from '#/engine/world/time'
import { useTime } from '#/store/time'
import { useLoop } from '#/store/offlineProgress'
import { useOrders } from '#/store/orders'
import { db } from '#/db/initDb'
import { useInventories } from '#/store/inventories'

export const GameClock = () => {
  // this is an isolated component because otherwise the entire components tree would be re-rendered every 3 seconds
  // aka re-render hell.
  const setTime = useTime((state) => state.setTime)
  const setLastSavedAt = useTime((state) => state.setLastSavedAt)
  const lastSavedAt = useTime((state) => state.time.lastSavedAt)
  const offlineProgressStatus = useLoop((state) => state.offlineProgressStatus)

  useEffect(() => {
    // This useEffect gathers the elapsedGameTime
    // every 3 seconds and updates the elapsed state.

    const UPDATE_ELAPSED_TIME_MS = 3000

    const getElapsedGameTimeWrapper: () => ElapsedTimeResult =
      getElapsedGameTime()

    // using window.setInterval to avoid the type ambiguity
    // between browser's setInterval and NodeJS.Timeout
    const intervalId: number = window.setInterval((): void => {
      const { elapsedTime, elapsedSeconds } = getElapsedGameTimeWrapper()
      // setElapsed(elapsedTime)
      setTime({ elapsedTime, elapsedSeconds })
    }, UPDATE_ELAPSED_TIME_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // This useEffect auto-saves the lastSavedAt property of the db
    // every 10 seconds.

    const AUTOSAVE_INTERVAL_MS = 10000

    const intervalId: number = window.setInterval(async (): Promise<void> => {
      await setLastSavedAt(Date.now())
    }, AUTOSAVE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  // offline progress useEffect
  useEffect(() => {
    const savedAt = lastSavedAt || db.data.lastSavedAt
    if (!savedAt || offlineProgressStatus === 'done') return // not hydrated yet
    const offlineDelta = useLoop.getState().setOfflineDelta(savedAt, Date.now())
    useLoop.getState().processOfflineProgress(offlineDelta)
  }, [lastSavedAt, db.data.lastSavedAt])

  useEffect(() => {
    let timeoutId: number

    const run = async (): Promise<void> => {
      await useInventories.getState().processProductCrafting()
      await useOrders.getState().processAddOrders()
      await useOrders.getState().processAllOrdersBulk()
      timeoutId = window.setTimeout(run, 5000)
    }

    timeoutId = window.setTimeout(run, 5000)
    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <span>
      {' '}
      Last saved at:{' '}
      {lastSavedAt
        ? new Date(lastSavedAt).toLocaleString()
        : new Date(db.data.lastSavedAt).toLocaleString()}
    </span>
  )
}
