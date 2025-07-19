/**
 * バリデーションロジック
 */

import { GAME_CONFIG, GAME_MESSAGES } from '@/constants';
import { ValidationError } from '@/types/errors';

/**
 * プレイヤー名のバリデーション
 */
export const validatePlayerName = (name: string): void => {
  if (!name || name.trim() === '') {
    throw new ValidationError(GAME_MESSAGES.INVALID_NAME);
  }

  if (name.length > GAME_CONFIG.MAX_NAME_LENGTH) {
    throw new ValidationError(
      `名前は${GAME_CONFIG.MAX_NAME_LENGTH}文字以内で入力してください`
    );
  }
};

/**
 * ゲーム数字のバリデーション
 */
export const validateGameNumbers = (numbers: number[]): void => {
  // 数字の個数チェック
  if (numbers.length !== GAME_CONFIG.NUMBERS_LENGTH) {
    throw new ValidationError(GAME_MESSAGES.INVALID_NUMBERS);
  }

  // 重複チェック
  const uniqueNumbers = new Set(numbers);
  if (uniqueNumbers.size !== numbers.length) {
    throw new ValidationError('数字に重複があります');
  }

  // 範囲チェック
  for (const num of numbers) {
    if (num < GAME_CONFIG.MIN_NUMBER || num > GAME_CONFIG.MAX_NUMBER) {
      throw new ValidationError(
        `数字は${GAME_CONFIG.MIN_NUMBER}から${GAME_CONFIG.MAX_NUMBER}の間で選択してください`
      );
    }
  }
};

/**
 * ルームIDのバリデーション
 */
export const validateRoomId = (roomId: string): void => {
  if (!roomId || roomId.trim() === '') {
    throw new ValidationError(GAME_MESSAGES.INVALID_ROOM_ID);
  }
};

/**
 * ゲーム参加時の包括的バリデーション
 */
export const validateGameInput = (
  name: string,
  numbers: number[],
  roomId?: string
): void => {
  validatePlayerName(name);
  validateGameNumbers(numbers);

  if (roomId !== undefined) {
    validateRoomId(roomId);
  }
};

/**
 * バリデーション結果の型
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 非同期バリデーション（複数項目を一度にチェック）
 */
export const validateGameInputSafe = (
  name: string,
  numbers: number[],
  roomId?: string
): ValidationResult => {
  const errors: string[] = [];

  try {
    validatePlayerName(name);
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push(error.message);
    }
  }

  try {
    validateGameNumbers(numbers);
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push(error.message);
    }
  }

  if (roomId !== undefined) {
    try {
      validateRoomId(roomId);
    } catch (error) {
      if (error instanceof ValidationError) {
        errors.push(error.message);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
