import { useEffect } from 'react'
import type { ElapsedTimeResult } from '#/types'
import { getElapsedGameTime } from '#/engine/world/time'
import { useTime } from '#/store/time'
import { useLoop } from '#/store/offlineProgress'
import { db } from '#/db/initDb'

export const GameClock = () => {
  // this is an isolated component because otherwise the entire components tree would be re-rendered every 3 seconds
  // aka re-render hell.
  const setTime = useTime((state) => state.setTime)
  const setLastSavedAt = useTime((state) => state.setLastSavedAt)
  const time = useTime((state) => state.time)
  const lastSavedAt = useTime((state) => state.time.lastSavedAt)


  // const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    // This useEffect gathers the elapsedGameTime
    // every 3 seconds and updates the elapsed state.

    const UPDATE_ELAPSED_TIME_MS = 3000

    const getElapsedGameTimeWrapper: () => ElapsedTimeResult =
      getElapsedGameTime()

    console.log('useEffect setTime')

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
    const offlineDelta = useLoop
      .getState()
      .setOfflineDelta(
        useTime.getState().time['lastSavedAt'] || db.data.lastSavedAt,
        Date.now(),
      )
    console.log('reading lastSavedAt from db', new Date(db.data.lastSavedAt).toLocaleString())
    console.log('reading lastSavedAt from store: ', new Date(Number(lastSavedAt).toLocaleString()))

    useLoop.getState().processOfflineProgress(offlineDelta)

  }, [])

  return (
    <span>
      elapsed minutes {Math.floor(time['elapsedTime'] / 1000 / 60)}. Last saved
      at: {lastSavedAt}
    </span>
  )
}
