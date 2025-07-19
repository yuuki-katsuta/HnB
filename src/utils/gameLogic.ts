/**
 * ゲームロジック関連のユーティリティ関数
 */

import type { GameResult } from '../types/game';

/**
 * Hit and Blowの結果を計算
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
 * ゲーム終了判定
 */
export const isGameFinished = (result: GameResult): boolean => {
  return result.hit === 3;
};

/**
 * 勝者判定
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
 * ランダムな数字配列を生成（デバッグ用）
 */
export const generateRandomNumbers = (): [number, number, number] => {
  const numbers = new Set<number>();

  while (numbers.size < 3) {
    const randomNum = Math.floor(Math.random() * 10);
    numbers.add(randomNum);
  }

  return Array.from(numbers) as [number, number, number];
};

/**
 * 数字配列をフォーマットして表示用文字列に変換
 */
export const formatNumbers = (numbers: number[]): string => {
  return numbers.join('');
};

/**
 * ゲーム進行状況のパーセンテージを計算
 */
export const calculateGameProgress = (
  currentTurn: number,
  maxTurns: number
): number => {
  return Math.min((currentTurn / maxTurns) * 100, 100);
};
