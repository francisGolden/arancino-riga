export interface GameDb {
  gameStartedAt: number;
  lastSavedAt: number;
  money: number;
}

export interface ElapsedTimeResult {
  elapsedTime: number;
  elapsedSeconds: number;
}

export interface MoneyState {
  money: number;
  increaseMoney: (amount: number) => void;
  decreaseMoney: (amount: number) => void;
  hydrateMoney: (savedAmount: number) => void;
}