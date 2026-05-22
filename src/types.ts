export interface GameDb {
  gameStartedAt: number;
  lastSavedAt: number;
  money: number;
  ownedBusinesses: string[];
  inventory: Record<string, number>;
}

export interface ElapsedTimeResult {
  elapsedTime: number;
  elapsedSeconds: number;
}

export interface MoneyState {
  money: number;
  increaseMoney: (amount: number) => void;
  decreaseMoney: (amount: number) => void;
  setMoney: (amount: number) => void;
  hydrateMoney: (savedAmount: number) => void;
}

export interface BusinessConfig {
  id: string;
  baseCost: number;
  baseIncome: number;
  name: string;
  description: string;
  location: string;
}

export interface BusinessListState {
  ownedBusinesses: string[];
  buyBusiness: (id: string, cost: number) => void;
  sellBusiness: (id: string, cost: number) => void;
  setBusinessList: (list: string[]) => void;
  hydrateBusinessList: (savedBusinesses: string[]) => void;
}

export interface InventoryState {
  inventory: Record<string, number>;
  buyItem: (id: string, cost: number) => void;
  sellItem: (id: string, cost: number) => void;
  setInventory: (inventory: Record<string, number>) => void;
  hydrateInventory: (savedInventory: Record<string, number>) => void;
}

export type ItemType = 'ingredient' | 'product';

export interface ItemConfig {
  id: string;
  name: string;
  type: ItemType;
  baseCost: number;
  description?: string;
}