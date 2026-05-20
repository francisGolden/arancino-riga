import { db } from "#/db/initDb"

db.read()

export const currentTime = Date.now()

export const initializeGameTime = async () => {
  db.read()

  if (!db.data.gameStartedAt) {
    console.log('game not initialized yet')
    db.update(data => {
      data.gameStartedAt = JSON.stringify(Date.now())
    })
  } else {
    console.log('game already initialized. ', 'gameStartedAt: ', db.data.gameStartedAt)
  }
}

const gameStartedAt = JSON.parse(db.data.gameStartedAt)
export const elapsedTime = Date.now() - gameStartedAt
export const elapsedSeconds = Math.floor(elapsedTime/1000)
export const elapsedMinutes = elapsedSeconds / 60