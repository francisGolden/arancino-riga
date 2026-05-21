import { createFileRoute } from '@tanstack/react-router'
import { getElapsedGameTime } from '#/engine/world/time'
import { useState, useEffect } from 'react'
import { db } from '#/db/initDb'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    // This useEffect gathers the elapsedGameTime
    // every 3 seconds and updates the elapsed state.

    const UPDATE_ELAPSED_TIME_MS = 3000

    const getElapsedGameTimeWrapper = getElapsedGameTime()

    const intervalId = setInterval(() => {
      const { elapsedTime } = getElapsedGameTimeWrapper()
      setElapsed(elapsedTime)
    }, UPDATE_ELAPSED_TIME_MS)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // This useEffect auto-saves the lastSavedAt property of the db
    // every 10 seconds.

    const AUTOSAVE_INTERVAL_MS = 10000

    const intervalId = setInterval(async () => {
      try {
        await db.update((data) => {
          data.lastSavedAt = Date.now()
        })
        console.log('Game auto-saved.')
      } catch (error) {
        console.error('Auto-save failed', error)
      }
    }, AUTOSAVE_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [])

  const elapsedMinutes = Math.floor(elapsed / 1000) / 60

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <span>elapsed minutes: {elapsedMinutes}</span>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
