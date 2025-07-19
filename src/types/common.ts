/**
 * 共通で使用される基本的な型定義
 */

export type PlayerId = 'player1' | 'player2';

export type PlayerNumber = 'player1' | 'player2' | '';

export interface BaseEntity {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Location state for react-router
export interface LocationState {
  id: string;
  uid: string;
}
