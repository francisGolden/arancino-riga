import { createFileRoute } from '@tanstack/react-router'
import { getElapsedGameTime } from '#/engine/world/time'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [elapsed, setElapsed] = useState(0)

  setInterval(() => {
    const { elapsedTime } = getElapsedGameTime()
    setElapsed(elapsedTime)
  }, 2000)

  const elapsedMinutes = (Math.floor(elapsed / 1000))/60

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
