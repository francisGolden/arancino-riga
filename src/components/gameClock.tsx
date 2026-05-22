import { useState, useEffect } from "react"
import type { ElapsedTimeResult } from "#/types"
import { getElapsedGameTime } from "#/engine/world/time"

export const GameClock = () => {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    // This useEffect gathers the elapsedGameTime
    // every 3 seconds and updates the elapsed state.

    const UPDATE_ELAPSED_TIME_MS = 3000

    const getElapsedGameTimeWrapper: () => ElapsedTimeResult =
      getElapsedGameTime()

    // using window.setInterval to avoid the type ambiguity
    // between browser's setInterval and NodeJS.Timeout
    const intervalId: number = window.setInterval((): void => {
      const { elapsedTime } = getElapsedGameTimeWrapper()
      setElapsed(elapsedTime)
    }, UPDATE_ELAPSED_TIME_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  return <span>elapsed minutes {Math.floor(elapsed / 1000 / 60)}</span>
}