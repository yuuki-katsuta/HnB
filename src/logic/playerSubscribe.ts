import { db } from '../firebase';
import { RoomInfo, RoomPlayerInfo } from '../types';

export const playerSubscribe = (
  roomId: string,
  uid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) =>
  db
    .collection('rooms')
    .doc(`room: ${roomId}`)
    .collection('player')
    .onSnapshot((Snapshot) => {
      Snapshot.docChanges().forEach((change) => {
        //退出時、プレイヤーデータ削除
        if (change.type === 'added') {
          const docRef = db.collection('rooms').doc(`room: ${roomId}`);
          const player1Number = docRef
            .get()
            .then((doc) => doc.data()?.player1Number);
          const player2Number = docRef
            .get()
            .then((doc) => doc.data()?.player2Number);
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
