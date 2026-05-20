import { createFileRoute } from '@tanstack/react-router'
import { initializeGameTime } from '#/engine/world/time'
import { db } from '#/db/initDb'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  initializeGameTime()
  db.read()
  const gameStartedAt = JSON.parse(db.data.gameStartedAt)
  const elapsedTime = Date.now() - gameStartedAt
  const elapsedSeconds = Math.floor(elapsedTime/1000)
  const elapsedMinutes = elapsedSeconds / 60

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <span>gameStartedAt: {elapsedMinutes}</span>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
