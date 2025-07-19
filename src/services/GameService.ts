/**
 * ゲーム進行管理サービス
 */

import {
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  type Unsubscribe,
  updateDoc,
} from 'firebase/firestore';

import { validateGameNumbers } from '../domain';
import { db } from '../firebase';
import { GameError } from '../types/errors';
import type { GameLog } from '../types/game';
import type { PlayerList } from '../types/player';
import {
  calculateHitAndBlow,
  convertSnapshotToPlayerList,
  createGameDataCollectionRef,
  createGameDataRef,
  createPlayersCollectionRef,
  createRoomRef,
} from '../utils';

export class GameService {
  /**
   * ゲームデータ（推測結果）を登録
   */
  async registerGameData(
    roomId: string,
    userUid: string,
    guessedNumbers: number[]
  ): Promise<void> {
    validateGameNumbers(guessedNumbers);

    const roomRef = createRoomRef(roomId);
    const roomDoc = await getDoc(roomRef);

    if (!roomDoc.exists()) {
      throw new GameError('ルームが存在しません');
    }

    const roomData = roomDoc.data();
    const { player1Number, player2Number, turn } = roomData;

    // プレイヤー情報を取得
    const players = await this.getPlayersForRoom(roomId);
    const currentPlayer = players.find((p) => p.id === userUid);

    if (!currentPlayer) {
      throw new GameError('プレイヤー情報が見つかりません');
    }

    // 対戦相手の数字を取得
    const opponentNumbers =
      currentPlayer.player === 'player1' ? player2Number : player1Number;

    if (!opponentNumbers) {
      throw new GameError('対戦相手の数字が設定されていません');
    }

    // Hit & Blow を計算
    const result = calculateHitAndBlow(guessedNumbers, opponentNumbers);

    // ゲームデータを保存
    await runTransaction(db, async (transaction) => {
      const gameDataRef = createGameDataRef(roomId, turn);

      const updateData: any = {
        [currentPlayer.player]: result,
        createdAt: serverTimestamp(),
      };

      transaction.set(gameDataRef, updateData, { merge: true });

      // プレイヤーが推測を完了したことを記録
      transaction.update(roomRef, {
        [`${currentPlayer.player}Added`]: true,
      });
    });
  }

  /**
   * ゲーム状態の変更を監視
   */
  subscribeToGameState(
    roomId: string,
    callbacks: {
      onTurnComplete?: (log: GameLog) => void;
      onGameReset?: () => void;
      onPlayersUpdate?: (players: PlayerList) => void;
    }
  ): Unsubscribe {
    const roomRef = createRoomRef(roomId);

    return onSnapshot(roomRef, async (doc) => {
      if (!doc.exists()) return;

      const data = doc.data();

      // ターン完了チェック
      if (data.player1Added && data.player2Added) {
        await this.advanceTurn(roomId, data.turn);

        if (callbacks.onTurnComplete) {
          const log = await this.getGameLog(roomId);
          callbacks.onTurnComplete(log);
        }
      }

      // ゲームリセットチェック
      if (data.player1Retry && data.player2Retry) {
        await this.resetGameData(roomId);

        if (callbacks.onGameReset) {
          callbacks.onGameReset();
        }

        if (callbacks.onPlayersUpdate) {
          const players = await this.getPlayersForRoom(roomId);
          callbacks.onPlayersUpdate(players);
        }
      }
    });
  }

  /**
   * ゲームログを取得
   */
  async getGameLog(roomId: string): Promise<GameLog> {
    const gameDataCollection = createGameDataCollectionRef(roomId);
    const gameDataQuery = query(
      gameDataCollection,
      orderBy('createdAt', 'asc')
    );
    const snapshot = await getDocs(gameDataQuery);

    const log: GameLog = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      log.push({
        player1: data.player1,
        player2: data.player2,
      });
    });

    return log;
  }

  /**
   * ターンを進行
   */
  private async advanceTurn(
    roomId: string,
    currentTurn: number
  ): Promise<void> {
    const roomRef = createRoomRef(roomId);

    await updateDoc(roomRef, {
      turn: currentTurn + 1,
      player1Added: false,
      player2Added: false,
    });
  }

  /**
   * ゲームデータをリセット
   */
  private async resetGameData(roomId: string): Promise<void> {
    const roomRef = createRoomRef(roomId);
    const gameDataCollection = createGameDataCollectionRef(roomId);

    // ゲームデータを全削除
    const gameDataSnapshot = await getDocs(gameDataCollection);
    const deletePromises = gameDataSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);

    // ルーム状態をリセット
    await updateDoc(roomRef, {
      turn: 1,
      player1Added: false,
      player2Added: false,
      player1Retry: false,
      player2Retry: false,
    });
  }

  /**
   * ルームのプレイヤー情報を取得
   */
  private async getPlayersForRoom(roomId: string): Promise<PlayerList> {
    const playersCollection = createPlayersCollectionRef(roomId);
    const snapshot = await getDocs(playersCollection);
    return convertSnapshotToPlayerList(snapshot);
  }

  /**
   * ゲーム終了判定
   */
  isGameFinished(log: GameLog): { isFinished: boolean; winner?: string } {
    if (log.length === 0) {
      return { isFinished: false };
    }

    const lastTurn = log[log.length - 1];
    const player1Won = lastTurn.player1?.hit === 3;
    const player2Won = lastTurn.player2?.hit === 3;

    if (player1Won && player2Won) {
      return { isFinished: true, winner: 'draw' };
    }
    if (player1Won) {
      return { isFinished: true, winner: 'player1' };
    }
    if (player2Won) {
      return { isFinished: true, winner: 'player2' };
    }

    return { isFinished: false };
  }
}
