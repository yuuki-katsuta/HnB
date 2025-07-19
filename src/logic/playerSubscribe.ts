import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

import { db } from '../firebase';
import { RoomInfo, RoomPlayerInfo } from '../types';

export const playerSubscribe = (
  roomId: string,
  uid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) => {
  const roomRef = doc(collection(db, 'rooms'), `room: ${roomId}`);
  const playersCollection = collection(roomRef, 'player');

  return onSnapshot(playersCollection, async (snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      //退出時、プレイヤーデータ削除
      if (change.type === 'added') {
        const roomDoc = await getDoc(roomRef);
        const roomData = roomDoc.data();
        const player1Number = roomData?.player1Number;
        const player2Number = roomData?.player2Number;

        const member: RoomPlayerInfo = [];
        snapshot.forEach((doc) => {
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
        if (
          playerData &&
          opponentData &&
          player1Number &&
          player2Number &&
          opponentData.player !== playerData.player
        ) {
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
      }
    });
  });
};
