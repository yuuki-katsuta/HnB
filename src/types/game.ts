/**
 * ゲーム関連の型定義
 */

export interface GameResult {
  hit: number;
  blow: number;
  ownSelect: number[];
}

export interface GameTurn {
  player1?: GameResult;
  player2?: GameResult;
}

export type GameLog = GameTurn[];

export interface GameState {
  turn: number;
  isGameSet: boolean;
  winner?: 'player1' | 'player2' | 'draw';
  log: GameLog;
}

// ゲーム数字の配列（0-9の3桁の重複なし）
export type GameNumbers = [number, number, number];

export interface GameConfig {
  maxTurns: number;
  numbersLength: number;
  minNumber: number;
  maxNumber: number;
}
