import { useState, useEffect } from "react"
import type { ElapsedTimeResult } from "#/types"
import { getElapsedGameTime } from "#/engine/world/time"
import { useTime } from "#/store/time"

export const GameClock = () => {
  // this is an isolated component because otherwise the entire components tree would be re-rendered every 3 seconds
  // aka re-render hell.
  const setTime = useTime((state) => state.setTime)
  const time = useTime((state) => state.time)


  // const [elapsed, setElapsed] = useState(0)
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
      setTime({elapsedTime, elapsedSeconds})
    }, UPDATE_ELAPSED_TIME_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  return <span>elapsed minutes {Math.floor(time['elapsedTime'] / 1000 / 60)}</span>
}