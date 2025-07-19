/**
 * ルーム関連のビジネスロジック
 */

import { ROOM_ID_PREFIX } from '@/constants';
import type { RoomInfo } from '@/types/room';

/**
 * ルームIDにプレフィックスを追加
 * @param roomId ルームID
 * @returns プレフィックス付きルームID
 */
export const addRoomIdPrefix = (roomId: string): string => {
  return `${ROOM_ID_PREFIX}${roomId}`;
};

/**
 * ルームIDからプレフィックスを削除
 * @param roomIdWithPrefix プレフィックス付きルームID
 * @returns ルームID
 */
export const removeRoomIdPrefix = (roomIdWithPrefix: string): string => {
  return roomIdWithPrefix.replace(ROOM_ID_PREFIX, '');
};

/**
 * ランダムなルームIDを生成
 * @returns 4桁のランダムルームID
 */
export const generateRoomId = (): string => {
  return String(Math.random()).substring(2, 6);
};

/**
 * ルームIDの重複チェック用関数
 * @param existingIds 既存のルームID配列
 * @param maxAttempts 最大試行回数
 * @returns 重複しないルームID
 */
export const findUniqueRoomId = (
  existingIds: string[],
  maxAttempts: number = 10
): string => {
  for (let i = 0; i < maxAttempts; i++) {
    const newId = generateRoomId();
    const roomIdWithPrefix = addRoomIdPrefix(newId);

    if (!existingIds.includes(roomIdWithPrefix)) {
      return newId;
    }
  }

  // フォールバック: タイムスタンプを使用
  return Date.now().toString().slice(-4);
};

/**
 * ルームIDの形式が正しいかバリデーション
 * @param roomId ルームID
 * @returns 形式が正しいかのフラグ
 */
export const isValidRoomIdFormat = (roomId: string): boolean => {
  // 4桁の数字のみ許可
  return /^\d{4}$/.test(roomId);
};

/**
 * RoomInfoの初期値を生成
 * @returns 初期化されたRoomInfo
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
