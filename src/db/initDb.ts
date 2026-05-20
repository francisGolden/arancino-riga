import { LocalStorage } from "lowdb/browser"
import { LowSync } from "lowdb"
import type { GameDb } from "#/types"

const defaultData: GameDb = {
    gameStartedAt: 0,
    lastSavedAt: 0
}

const adapter = new LocalStorage<GameDb>("game-db")
export const db = new LowSync<GameDb>(adapter, defaultData)