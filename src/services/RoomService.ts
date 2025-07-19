/**
 * ルーム管理サービス
 */

import {
  getDoc,
  getDocs,
  onSnapshot,
  runTransaction,
  type Unsubscribe,
} from 'firebase/firestore';

import { GAME_MESSAGES } from '../constants';
import { canJoinRoom, validateGameInput, validateGameNumbers } from '../domain';
import { db } from '../firebase';
import { GameError, RoomError } from '../types/errors';
import type { GameNumbers } from '../types/game';
import type { PlayerList } from '../types/player';
import type { CreateRoomParams, JoinRoomParams } from '../types/room';
import {
  convertSnapshotToPlayerList,
  createPlayerRef,
  createPlayersCollectionRef,
  createRoomRef,
  createRoomsCollectionRef,
  findUniqueRoomId,
} from '../utils';

export class RoomService {
  /**
   * 新しいルームを作成
   */
  async createRoom(params: CreateRoomParams): Promise<string> {
    validateGameInput(params.name, params.numbers);

    // 既存ルームIDを取得して重複回避
    const roomsSnapshot = await getDocs(createRoomsCollectionRef());
    const existingIds = roomsSnapshot.docs.map((doc) => doc.id);
    const roomId = findUniqueRoomId(existingIds);

    const roomRef = createRoomRef(roomId);
    const playerRef = createPlayerRef(roomId, params.userUid);

    await runTransaction(db, async (transaction) => {
      // ルームドキュメントを作成
      transaction.set(roomRef, {
        turn: 1,
        player1: params.name,
        player2: '',
        player1Number: params.numbers,
        player2Number: null,
        player1Added: false,
        player2Added: false,
        player1Retry: false,
        player2Retry: false,
      });

      // プレイヤードキュメントを作成
      transaction.set(playerRef, {
        name: params.name,
        uid: params.userUid,
        player: 'player1',
        selected: params.numbers,
      });
    });

    return roomId;
  }

  /**
   * 既存ルームに参加
   */
  async joinRoom(params: JoinRoomParams): Promise<void> {
    validateGameInput(params.name, params.numbers, params.roomId);

    // ルーム存在確認
    const roomExists = await this.checkRoomExists(params.roomId);
    if (!roomExists) {
      throw new RoomError(GAME_MESSAGES.ROOM_NOT_FOUND);
    }

    // プレイヤー情報取得
    const players = await this.getPlayers(params.roomId);
    const playerUids = players.map((p) => p.id);

    // 参加可能性チェック
    if (!canJoinRoom(players.length, playerUids, params.userUid)) {
      if (players.length >= 2) {
        throw new RoomError(GAME_MESSAGES.ROOM_FULL);
      }
      throw new RoomError(GAME_MESSAGES.DUPLICATE_USER);
    }

    const roomRef = createRoomRef(params.roomId);
    const playerRef = createPlayerRef(params.roomId, params.userUid);

    await runTransaction(db, async (transaction) => {
      // ルーム情報を更新
      transaction.set(
        roomRef,
        {
          player2: params.name,
          player2Number: params.numbers,
        },
        { merge: true }
      );

      // プレイヤー情報を追加
      transaction.set(playerRef, {
        name: params.name,
        uid: params.userUid,
        player: 'player2',
        selected: params.numbers,
      });
    });
  }

  /**
   * ルームの存在確認
   */
  async checkRoomExists(roomId: string): Promise<boolean> {
    const roomRef = createRoomRef(roomId);
    const roomDoc = await getDoc(roomRef);
    return roomDoc.exists();
  }

  /**
   * プレイヤー一覧を取得
   */
  async getPlayers(roomId: string): Promise<PlayerList> {
    const playersCollection = createPlayersCollectionRef(roomId);
    const snapshot = await getDocs(playersCollection);
    return convertSnapshotToPlayerList(snapshot);
  }

  /**
   * プレイヤーの変更を監視
   */
  subscribeToPlayers(
    roomId: string,
    callback: (players: PlayerList) => void
  ): Unsubscribe {
    const playersCollection = createPlayersCollectionRef(roomId);

    return onSnapshot(playersCollection, (snapshot) => {
      const players = convertSnapshotToPlayerList(snapshot);
      callback(players);
    });
  }

  /**
   * ルーム情報の変更を監視
   */
  subscribeToRoomData(
    roomId: string,
    callback: (data: any) => void
  ): Unsubscribe {
    const roomRef = createRoomRef(roomId);

    return onSnapshot(roomRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  }

  /**
   * プレイヤーデータを削除してルームを退出
   */
  async leaveRoom(roomId: string, userUid: string): Promise<void> {
    const roomRef = createRoomRef(roomId);
    const playerRef = createPlayerRef(roomId, userUid);

    await runTransaction(db, async (transaction) => {
      transaction.delete(playerRef);
      transaction.delete(roomRef);
    });
  }

  /**
   * ゲームをリセット
   */
  async resetGame(
    roomId: string,
    userUid: string,
    newNumbers: GameNumbers
  ): Promise<void> {
    validateGameNumbers(newNumbers); // リセット時は数字のみをバリデーション

    const playerRef = createPlayerRef(roomId, userUid);
    const playerDoc = await getDoc(playerRef);

    if (!playerDoc.exists()) {
      throw new GameError('プレイヤー情報が見つかりません');
    }

    const playerData = playerDoc.data();
    const playerId = playerData?.player;

    if (!playerId || (playerId !== 'player1' && playerId !== 'player2')) {
      throw new GameError('無効なプレイヤーIDです');
    }

    const roomRef = createRoomRef(roomId);

    await runTransaction(db, async (transaction) => {
      // プレイヤーの選択数字を更新
      transaction.update(playerRef, {
        selected: newNumbers,
      });

      // ルームの状態を更新
      const updateData: any = {
        [`${playerId}Number`]: newNumbers,
        [`${playerId}Added`]: false,
        [`${playerId}Retry`]: true,
      };

      transaction.update(roomRef, updateData);
    });
  }
}
