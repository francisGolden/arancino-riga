import { db } from '#/db/initDb'

export const currentTime = Date.now()

export const initializeGameTime = async () => {
  try {
    await db.read()
  } catch (error) {
    console.error(error)
  }

  if (!db.data.gameStartedAt) {
    console.log('game not initialized yet')
    try {
      await db.update((data) => {
        data.gameStartedAt = Date.now()
      })
    } catch (error) {
      console.error(error)
    }
  } else {
    console.log(
      'game already initialized. ',
      'gameStartedAt: ',
      db.data.gameStartedAt,
    )
  }
}

export const getElapsedGameTime = () => {
  if (!db.data.gameStartedAt) {
    console.warn('Attempted to get elapsed time before DB was initialized.')
    return { elapsedTime: 0, elapsedSeconds: 0 }
  }

  const gameStartedAt = db.data.gameStartedAt
  const elapsedTime = Date.now() - gameStartedAt
  const elapsedSeconds = Math.floor(elapsedTime / 1000)

  return { elapsedTime, elapsedSeconds }
}
