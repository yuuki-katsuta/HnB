/**
 * ゲームルールとビジネスロジック
 */

import { GAME_CONFIG } from '../constants';
import type { PlayerId } from '../types/common';
import type { GameNumbers } from '../types/game';
import type { RoomInfo } from '../types/room';

/**
 * RoomInfoの初期値を生成
 */
export const createInitialRoomInfo = (): RoomInfo => ({
  roomId: '',
  userUid: '',
  name: '',
  player: '',
  selectNumber: [],
  opponent: '',
  opponentSelectNumber: [],
});

/**
 * プレイヤーが部屋に参加可能かチェック
 */
export const canJoinRoom = (
  playerCount: number,
  existingPlayerUids: string[],
  newPlayerUid: string
): boolean => {
  // 部屋が満室でないかチェック
  if (playerCount >= 2) {
    return false;
  }

  // 同じユーザーが既に参加していないかチェック
  if (existingPlayerUids.includes(newPlayerUid)) {
    return false;
  }

  return true;
};

/**
 * 新しいプレイヤーのIDを決定
 */
export const determinePlayerId = (existingPlayerIds: PlayerId[]): PlayerId => {
  if (!existingPlayerIds.includes('player1')) {
    return 'player1';
  }
  return 'player2';
};

/**
 * ゲームが開始可能かチェック
 */
export const canStartGame = (
  player1Numbers?: GameNumbers,
  player2Numbers?: GameNumbers
): boolean => {
  return !!player1Numbers && !!player2Numbers;
};

/**
 * ターン進行が可能かチェック
 */
export const canAdvanceTurn = (
  player1Added: boolean,
  player2Added: boolean
): boolean => {
  return player1Added && player2Added;
};

/**
 * ゲームリセットが可能かチェック
 */
export const canResetGame = (
  player1Retry: boolean,
  player2Retry: boolean
): boolean => {
  return player1Retry && player2Retry;
};

/**
 * 最大ターン数に達したかチェック
 */
export const isMaxTurnReached = (currentTurn: number): boolean => {
  return currentTurn >= GAME_CONFIG.MAX_TURNS;
};

/**
 * プレイヤーの役割を取得
 */
export const getPlayerRole = (
  playerId: PlayerId | ''
): 'player1' | 'player2' | 'spectator' => {
  if (playerId === 'player1' || playerId === 'player2') {
    return playerId;
  }
  return 'spectator';
};

/**
 * 対戦相手のIDを取得
 */
export const getOpponentId = (playerId: PlayerId): PlayerId => {
  return playerId === 'player1' ? 'player2' : 'player1';
};

/**
 * ゲーム状態の文字列表現を取得
 */
export const getGameStatusText = (
  hasOpponent: boolean,
  isGameSet: boolean,
  winner?: string
): string => {
  if (!hasOpponent) {
    return '対戦相手を探しています...';
  }

  if (isGameSet) {
    if (winner) {
      return `ゲーム終了！勝者: ${winner}`;
    }
    return 'ゲーム終了！';
  }

  return 'ゲーム進行中';
};
