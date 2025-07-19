/**
 * ゲーム関連の定数
 */

export const GAME_CONFIG = {
  NUMBERS_LENGTH: 3,
  MIN_NUMBER: 0,
  MAX_NUMBER: 9,
  MAX_TURNS: 10,
  MAX_NAME_LENGTH: 10,
  MIN_NAME_LENGTH: 1,
} as const;

export const GAME_MESSAGES = {
  INVALID_NUMBERS: '無効な数字だよ! 数字は3つ選んでね!',
  INVALID_NAME: '無効な名前だよ!',
  INVALID_ROOM_ID: 'roomIDを入力してね!',
  ROOM_NOT_FOUND: 'roomが見つからないよ...',
  ROOM_FULL: '他のプレイヤーがいるみたい...!',
  DUPLICATE_USER: '同じユーザーは入れないよ!',
  SELECT_NUMBERS: '数字は3つ選んでね!',
  WAITING_OPPONENT: '対戦相手を探しています...',
  OPPONENT_FOUND: '対戦相手が見つかったよ!!',
  RESTART_SELECT_NUMBERS: 'もう一度遊ぶ場合は、数字を選んでね',
  WAITING_INPUT: '相手の入力をまってます...',
  CONFIRM_LEAVE: '退出しますか??',
} as const;

export const COLLECTION_NAMES = {
  ROOMS: 'rooms',
  USERS: 'users',
  PLAYER: 'player',
  GAME_DATA: 'gameData',
} as const;

export const ROOM_ID_PREFIX = 'room: ';
