import firebase from 'firebase/app';
import { RoomInfo, RoomPlayerInfo } from '../types';

export const setPlayerData = (
  Snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>,
  roomId: string,
  uid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) => {
  const member: RoomPlayerInfo = [];

  Snapshot.forEach((doc) => {
    if (doc.data()) {
      member.push({
        id: doc.data().uid,
        name: doc.data().name,
        player: doc.data().player,
        selected: doc.data().selected,
      });
    }
  });
  const opponentData = member.find((user) => user.id !== uid);
  const playerData = member.find((user) => user.id === uid);

  if (playerData && opponentData) {
    setRoomInfo({
      roomId: roomId,
      userUid: uid,
      name: playerData.name,
      player: playerData.player,
      selectNumber: playerData.selected,
      opponent: opponentData.name,
      opponentSelectNumber: opponentData.selected,
    });
  }
};
