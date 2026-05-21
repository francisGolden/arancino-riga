export interface GameDb {
  gameStartedAt: number;
  lastSavedAt: number;
}

export interface ElapsedTimeResult {
  elapsedTime: number;
  elapsedSeconds: number;
}