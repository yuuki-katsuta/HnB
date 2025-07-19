/**
 * Hit and Blow ゲームのコアロジック
 */

import type { GameResult } from '@/types/game';

/**
 * Hit and Blowの結果を計算
 * @param guessedNumbers 推測した数字配列
 * @param targetNumbers 正解の数字配列
 * @returns Hit/Blow結果
 */
export const calculateHitAndBlow = (
  guessedNumbers: number[],
  targetNumbers: number[]
): GameResult => {
  let hitCount = 0;
  let blowCount = 0;

  guessedNumbers.forEach((num, index) => {
    if (num === targetNumbers[index]) {
      hitCount += 1;
    } else if (targetNumbers.includes(num)) {
      blowCount += 1;
    }
  });

  return {
    hit: hitCount,
    blow: blowCount,
    ownSelect: [...guessedNumbers],
  };
};

/**
 * ゲーム終了判定（3つすべてHitで勝利）
 * @param result ゲーム結果
 * @returns ゲーム終了フラグ
 */
export const isGameFinished = (result: GameResult): boolean => {
  return result.hit === 3;
};

/**
 * 勝者判定
 * @param player1Result プレイヤー1の結果
 * @param player2Result プレイヤー2の結果
 * @returns 勝者または引き分け
 */
export const determineWinner = (
  player1Result?: GameResult,
  player2Result?: GameResult
): 'player1' | 'player2' | 'draw' | null => {
  const player1Won = player1Result && isGameFinished(player1Result);
  const player2Won = player2Result && isGameFinished(player2Result);

  if (player1Won && player2Won) {
    return 'draw';
  }
  if (player1Won) {
    return 'player1';
  }
  if (player2Won) {
    return 'player2';
  }
  return null;
};

/**
 * ゲームログから最終的な勝者を判定
 * @param gameLog ゲームログ
 * @returns ゲーム終了情報
 */
export const checkGameCompletion = (
  gameLog: any[]
): {
  isFinished: boolean;
  winner?: string;
} => {
  if (gameLog.length === 0) {
    return { isFinished: false };
  }

  const lastTurn = gameLog[gameLog.length - 1];
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
};
