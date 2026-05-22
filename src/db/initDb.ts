import {get, set} from "idb-keyval"
import { Low } from "lowdb"
import type { Adapter } from "lowdb"
import type { GameDb } from "#/types"

class IndexedDBAdapter<T> implements Adapter<T> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // Lettura realmente asincrona (non blocca la UI)
  async read(): Promise<T | null> {
    const data = await get<T>(this.key);
    return data || null;
  }

  // Scrittura realmente asincrona (non blocca la UI)
  async write(obj: T): Promise<void> {
    await set(this.key, obj);
  }
}

const defaultData: GameDb = {
    gameStartedAt: 0,
    lastSavedAt: 0,
    money: 0,
    ownedBusinesses: [],
    businessList: []
}

const adapter = new IndexedDBAdapter<GameDb>("game-db")
export const db = new Low<GameDb>(adapter, defaultData)