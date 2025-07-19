/**
 * ゲーム状態管理のドメインロジック
 */

import { GAME_CONFIG } from '@/constants';
import type { GameNumbers } from '@/types/game';

/**
 * ゲーム進行状況のパーセンテージを計算
 * @param currentTurn 現在のターン数
 * @param maxTurns 最大ターン数
 * @returns 進行状況パーセンテージ
 */
export const calculateGameProgress = (
  currentTurn: number,
  maxTurns: number = GAME_CONFIG.MAX_TURNS
): number => {
  return Math.min((currentTurn / maxTurns) * 100, 100);
};

/**
 * 最大ターン数に達したかチェック
 * @param currentTurn 現在のターン数
 * @param maxTurns 最大ターン数
 * @returns 最大ターン数到達フラグ
 */
export const isMaxTurnReached = (
  currentTurn: number,
  maxTurns: number = GAME_CONFIG.MAX_TURNS
): boolean => {
  return currentTurn >= maxTurns;
};

/**
 * ターン進行が可能かチェック
 * @param player1Added プレイヤー1が推測を送信済みか
 * @param player2Added プレイヤー2が推測を送信済みか
 * @returns ターン進行可能フラグ
 */
export const canAdvanceTurn = (
  player1Added: boolean,
  player2Added: boolean
): boolean => {
  return player1Added && player2Added;
};

/**
 * ゲームリセットが可能かチェック
 * @param player1Retry プレイヤー1がリセット要求済みか
 * @param player2Retry プレイヤー2がリセット要求済みか
 * @returns リセット可能フラグ
 */
export const canResetGame = (
  player1Retry: boolean,
  player2Retry: boolean
): boolean => {
  return player1Retry && player2Retry;
};

/**
 * ゲームが開始可能かチェック
 * @param player1Numbers プレイヤー1の選択数字
 * @param player2Numbers プレイヤー2の選択数字
 * @returns ゲーム開始可能フラグ
 */
export const canStartGame = (
  player1Numbers?: GameNumbers,
  player2Numbers?: GameNumbers
): boolean => {
  return !!player1Numbers && !!player2Numbers;
};

/**
 * ゲーム状態の文字列表現を取得
 * @param hasOpponent 対戦相手がいるか
 * @param isGameSet ゲームが終了しているか
 * @param winner 勝者
 * @returns ゲーム状態のテキスト
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
