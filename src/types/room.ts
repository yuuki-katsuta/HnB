/**
 * ルーム関連の型定義
 */

import type { BaseEntity, PlayerId } from './common';
import type { GameNumbers, GameState } from './game';
import type { Player } from './player';

export interface Room extends BaseEntity {
  roomId: string;
  status: RoomStatus;
  players: Player[];
  game: GameState;
  player1Numbers?: GameNumbers;
  player2Numbers?: GameNumbers;
  player1Added: boolean;
  player2Added: boolean;
  player1Retry: boolean;
  player2Retry: boolean;
}

export type RoomStatus = 'waiting' | 'playing' | 'finished' | 'abandoned';

// 現在のユーザーの視点でのルーム情報
export interface RoomInfo {
  roomId: string;
  userUid: string;
  name: string;
  player: PlayerId | '';
  selectNumber: number[];
  opponent: string;
  opponentSelectNumber: number[];
}

// ルーム作成・参加時のパラメータ
export interface CreateRoomParams {
  name: string;
  numbers: GameNumbers;
  userUid: string;
}

export interface JoinRoomParams {
  roomId: string;
  name: string;
  numbers: GameNumbers;
  userUid: string;
}

// レガシー型（後で削除予定）
export interface RoomData {
  name: string;
  player: PlayerId | '';
  selectNumber: number[];
  opponent: string;
  opponentSelectNumber: number[];
}
