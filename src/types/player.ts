/**
 * プレイヤー関連の型定義
 */

import type { BaseEntity, PlayerId } from './common';
import type { GameNumbers } from './game';

export interface Player extends BaseEntity {
  uid: string;
  name: string;
  playerId: PlayerId;
  selectedNumbers: GameNumbers;
  isReady: boolean;
  isConnected: boolean;
}

export interface PlayerInfo {
  id: string;
  name: string;
  player: PlayerId | '';
  selected: number[];
}

export type PlayerList = PlayerInfo[];

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winRate: number;
}
