export interface GameDb {
  gameStartedAt: number;
  lastSavedAt: number;
  money: number;
  ownedBusinesses: string[];
  businessList: BusinessConfig[];
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