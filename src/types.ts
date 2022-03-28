export type RoomInfo = {
  roomId: string;
  userUid: string;
};

export type RoomData = {
  name: string;
  player: 'player1' | 'player2' | '';
  selectNumber: number[];
  opponent: string;
  opponentSelectNumber: number[];
};

export type LogData = {
  player2: { blow: number; hit: number; ownSelect: number[] };
  player1: { blow: number; hit: number; ownSelect: number[] };
}[];

export type LocationState = {
  id: string;
  uid: string;
} | null;
