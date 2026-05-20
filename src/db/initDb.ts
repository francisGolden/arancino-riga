import { LocalStorage } from "lowdb/browser"
import { LowSync } from "lowdb"
import type { GameDb } from "#/types"

const defaultData: GameDb = {
    gameStartedAt: "",
    lastSavedAt: ""
}

const adapter = new LocalStorage<GameDb>("game-db")
export const db = new LowSync<GameDb>(adapter, defaultData)