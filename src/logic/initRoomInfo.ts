import { RoomInfo } from '../types';

export const initRoomData = (): RoomInfo => {
  return {
    roomId: '',
    userUid: '',
    player: '',
    name: '',
    selectNumber: [],
    opponent: '',
    opponentSelectNumber: [],
  };
};
