import { createFileRoute } from '@tanstack/react-router'
import { getElapsedGameTime } from '#/engine/world/time'
import { useState, useEffect } from 'react'
import { db } from '#/db/initDb'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { elapsedTime } = getElapsedGameTime()
      setElapsed(elapsedTime)
      db.read()
      console.log(db.data)
    }, 3000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const AUTOSAVE_INTERVAL_MS = 10000 // Save every 10 seconds

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

    // Cleanup the interval when the component unmounts
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
