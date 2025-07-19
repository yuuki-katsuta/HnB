/**
 * プレイヤー関連のビジネスロジック
 */

import type { PlayerId } from '@/types/common';
import type { PlayerInfo, PlayerList } from '@/types/player';

/**
 * プレイヤーリストから対戦相手を取得
 * @param playerList プレイヤーリスト
 * @param currentUserUid 現在のユーザーUID
 * @returns 対戦相手の情報またはnull
 */
export const findOpponent = (
  playerList: PlayerList,
  currentUserUid: string
): PlayerInfo | null => {
  return playerList.find((player) => player.id !== currentUserUid) || null;
};

/**
 * プレイヤーリストから現在のユーザーを取得
 * @param playerList プレイヤーリスト
 * @param currentUserUid 現在のユーザーUID
 * @returns 現在のユーザー情報またはnull
 */
export const findCurrentPlayer = (
  playerList: PlayerList,
  currentUserUid: string
): PlayerInfo | null => {
  return playerList.find((player) => player.id === currentUserUid) || null;
};

/**
 * プレイヤーがルームに参加済みかチェック
 * @param playerList プレイヤーリスト
 * @param userUid ユーザーUID
 * @returns 参加済みフラグ
 */
export const isPlayerInRoom = (
  playerList: PlayerList,
  userUid: string
): boolean => {
  return playerList.some((player) => player.id === userUid);
};

/**
 * ルームが満室かチェック
 * @param playerList プレイヤーリスト
 * @returns 満室フラグ
 */
export const isRoomFull = (playerList: PlayerList): boolean => {
  return playerList.length >= 2;
};

/**
 * プレイヤーが部屋に参加可能かチェック
 * @param playerCount 現在のプレイヤー数
 * @param existingPlayerUids 既存プレイヤーのUID配列
 * @param newPlayerUid 新しいプレイヤーのUID
 * @returns 参加可能フラグ
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
 * @param existingPlayerIds 既存のプレイヤーID配列
 * @returns 新しいプレイヤーID
 */
export const determinePlayerId = (existingPlayerIds: PlayerId[]): PlayerId => {
  if (!existingPlayerIds.includes('player1')) {
    return 'player1';
  }
  return 'player2';
};

/**
 * プレイヤーの役割を取得
 * @param playerId プレイヤーID
 * @returns プレイヤーの役割
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
 * @param playerId 現在のプレイヤーID
 * @returns 対戦相手のプレイヤーID
 */
export const getOpponentId = (playerId: PlayerId): PlayerId => {
  return playerId === 'player1' ? 'player2' : 'player1';
};
