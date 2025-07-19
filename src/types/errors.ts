/**
 * エラー関連の型定義
 */

export abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
}

export class GameError extends AppError {
  readonly code = 'GAME_ERROR';
  readonly statusCode = 422;
}

export class RoomError extends AppError {
  readonly code = 'ROOM_ERROR';
  readonly statusCode = 404;
}

export class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 503;
}

export class AuthError extends AppError {
  readonly code = 'AUTH_ERROR';
  readonly statusCode = 401;
}

// エラーコード定数
export const ERROR_CODES = {
  INVALID_NAME: 'INVALID_NAME',
  INVALID_NUMBERS: 'INVALID_NUMBERS',
  INVALID_ROOM_ID: 'INVALID_ROOM_ID',
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  DUPLICATE_USER: 'DUPLICATE_USER',
  GAME_NOT_READY: 'GAME_NOT_READY',
  NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  field?: string;
  details?: Record<string, unknown>;
}
