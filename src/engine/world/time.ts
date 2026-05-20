import { db } from "#/db/initDb"

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