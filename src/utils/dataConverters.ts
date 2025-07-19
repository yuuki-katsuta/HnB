/**
 * データ変換ユーティリティ関数
 */

import type { DocumentData, QuerySnapshot } from 'firebase/firestore';

import type { PlayerInfo, PlayerList } from '../types/player';

/**
 * QuerySnapshotをPlayerListに変換
 */
export const convertSnapshotToPlayerList = (
  snapshot: QuerySnapshot<DocumentData>
): PlayerList => {
  const playerList: PlayerList = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data) {
      playerList.push({
        id: data.uid,
        name: data.name,
        player: data.player,
        selected: data.selected,
      });
    }
  });

  return playerList;
};

/**
 * プレイヤーリストから対戦相手を取得
 */
export const findOpponent = (
  playerList: PlayerList,
  currentUserUid: string
): PlayerInfo | null => {
  return playerList.find((player) => player.id !== currentUserUid) || null;
};

/**
 * プレイヤーリストから現在のユーザーを取得
 */
export const findCurrentPlayer = (
  playerList: PlayerList,
  currentUserUid: string
): PlayerInfo | null => {
  return playerList.find((player) => player.id === currentUserUid) || null;
};

/**
 * ルームIDにプレフィックスを追加
 */
export const addRoomIdPrefix = (roomId: string): string => {
  return `room: ${roomId}`;
};

/**
 * ルームIDからプレフィックスを削除
 */
export const removeRoomIdPrefix = (roomIdWithPrefix: string): string => {
  return roomIdWithPrefix.replace('room: ', '');
};

/**
 * 数字配列を3桁のタプルに変換（型安全性向上）
 */
export const convertToGameNumbers = (
  numbers: number[]
): [number, number, number] => {
  if (numbers.length !== 3) {
    throw new Error('Numbers array must have exactly 3 elements');
  }
  return [numbers[0], numbers[1], numbers[2]];
};

/**
 * ランダムなルームIDを生成
 */
export const generateRoomId = (): string => {
  return String(Math.random()).substring(2, 6);
};

/**
 * ルームIDの重複チェック用関数
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
