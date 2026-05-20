import { createFileRoute } from '@tanstack/react-router'
import { getElapsedGameTime } from '#/engine/world/time'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  

  const {elapsedSeconds} = getElapsedGameTime()

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <span>gameStartedAt: {elapsedSeconds/60}</span>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
    </div>
  )
}
