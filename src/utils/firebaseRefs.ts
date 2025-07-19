/**
 * Firebase参照作成のユーティリティ関数
 */

import { collection, doc } from 'firebase/firestore';

import { COLLECTION_NAMES, ROOM_ID_PREFIX } from '../constants';
import { db } from '../firebase';

/**
 * ルームのドキュメント参照を作成
 */
export const createRoomRef = (roomId: string) => {
  return doc(
    collection(db, COLLECTION_NAMES.ROOMS),
    `${ROOM_ID_PREFIX}${roomId}`
  );
};

/**
 * プレイヤーコレクションの参照を作成
 */
export const createPlayersCollectionRef = (roomId: string) => {
  const roomRef = createRoomRef(roomId);
  return collection(roomRef, COLLECTION_NAMES.PLAYER);
};

/**
 * 特定プレイヤーのドキュメント参照を作成
 */
export const createPlayerRef = (roomId: string, playerUid: string) => {
  const playersCollection = createPlayersCollectionRef(roomId);
  return doc(playersCollection, playerUid);
};

/**
 * ゲームデータコレクションの参照を作成
 */
export const createGameDataCollectionRef = (roomId: string) => {
  const roomRef = createRoomRef(roomId);
  return collection(roomRef, COLLECTION_NAMES.GAME_DATA);
};

/**
 * 特定ターンのゲームデータ参照を作成
 */
export const createGameDataRef = (roomId: string, turn: number) => {
  const gameDataCollection = createGameDataCollectionRef(roomId);
  return doc(gameDataCollection, `turn: ${turn}`);
};

/**
 * ユーザーコレクションの参照を作成
 */
export const createUsersCollectionRef = () => {
  return collection(db, COLLECTION_NAMES.USERS);
};

/**
 * 特定ユーザーの参照を作成
 */
export const createUserRef = (userUid: string) => {
  const usersCollection = createUsersCollectionRef();
  return doc(usersCollection, userUid);
};

/**
 * ルームコレクションの参照を作成
 */
export const createRoomsCollectionRef = () => {
  return collection(db, COLLECTION_NAMES.ROOMS);
};
