import { db } from '#/db/initDb'
import type { ElapsedTimeResult } from '#/types'
import { useMoney } from '#/store/currency'

export const currentTime = Date.now()

export const initializeGameTime = async (): Promise<void> => {
  // this async function is ran every time the game starts and checks if the
  // game has been initialized yet or not.
  // Importantly, it also hydrates global state properties like money,
  // so that at start-up this value in the state is gathered from the db.
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
        useMoney.getState().setMoney(1000)
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
    
    useMoney.getState().hydrateMoney(db.data.money)
  }
}

export const getElapsedGameTime = (): (() => ElapsedTimeResult) => {
  if (!db.data.gameStartedAt) {
    console.warn('Attempted to get elapsed time before DB was initialized.')
    return function (): ElapsedTimeResult {
      return { elapsedTime: 0, elapsedSeconds: 0 }
    }
  }

  // this function uses the Closure feature of JS to avoid unnecessary db reads,
  // using its private memory whenever the value is not 0
  let gameStartedAtCached = 0

  return function (): ElapsedTimeResult {
    let gameStartedAt = 0
    if (gameStartedAtCached !== 0) {
      gameStartedAt = gameStartedAtCached
      console.log('reading value from function private memory')
    } else {
      gameStartedAt = db.data.gameStartedAt
      gameStartedAtCached = gameStartedAt
      console.log('reading value from db')
    }
    const elapsedTime = Date.now() - gameStartedAt
    const elapsedSeconds = Math.floor(elapsedTime / 1000)

    return { elapsedTime, elapsedSeconds }
  }
}
