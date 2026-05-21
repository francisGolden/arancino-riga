import { createFileRoute } from '@tanstack/react-router'
import { getElapsedGameTime } from '#/engine/world/time'
import { useState, useEffect } from 'react'
import { db } from '#/db/initDb'
import type { ElapsedTimeResult } from '#/types'
import { useMoney } from '#/store/currency'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [elapsed, setElapsed] = useState(0)
  const increaseMoney = useMoney((state) => state.increaseMoney)
  const money = useMoney((state) => state.money)
  const hydrateMoney = useMoney((state) => state.hydrateMoney)

  useEffect(() => {
    (async () => {
      try {
        await db.read()
        hydrateMoney(db.data.money)
      } catch (error) {
        console.error('error in hydrating money', error)
      }
    })()
  }, [])

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

  useEffect(() => {
    // This useEffect auto-saves the lastSavedAt property of the db
    // every 10 seconds.

    const AUTOSAVE_INTERVAL_MS = 10000

    const intervalId: number = window.setInterval(async (): Promise<void> => {
      try {
        await db.update((data) => {
          data.lastSavedAt = Date.now()
        })
        console.log('Game auto-saved.')
      } catch (error) {
        console.error('Auto-save failed', error)
      }
    }, AUTOSAVE_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [])

  const elapsedMinutes = Math.floor(elapsed / 1000) / 60

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <span>elapsed minutes: {elapsedMinutes}</span>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <button onClick={() => increaseMoney(1)}>Click me</button>
      <span>Money: {money}</span>
    </div>
  )
}
