import { LogData, RoomInfo, RoomPlayerInfo } from '../types';
import { db } from '../firebase';

export const gameDataSubscribe = (
  roomId: string,
  setIsGameSet: React.Dispatch<React.SetStateAction<boolean>>,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setLog: React.Dispatch<React.SetStateAction<LogData>>,
  isMounted: boolean,
  userUid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) =>
  db
    .collection('rooms')
    .doc(`room: ${roomId}`)
    .onSnapshot(async (doc) => {
      if (doc.data()?.player1Added && doc.data()?.player2Added) {
        const docRef = db.collection('rooms').doc(`room: ${roomId}`);

        isMounted && setDisabled(false);
        await docRef.update({
          turn: doc.data()?.turn + 1,
          player1Added: false,
          player2Added: false,
        });
        await docRef
          .collection('gameData')
          .orderBy('createdAt', 'asc')
          .get()
          .then((Snapshot) => {
            let log: LogData = [];
            let player1HitCount = 0;
            let player2HitCount = 0;

            Snapshot.forEach((doc) => {
              log.push({
                player2: doc.data().player2,
                player1: doc.data().player1,
              });
            });
            if (log.length > 0) {
              const lastLogData = log[log.length - 1];
              player1HitCount = lastLogData.player1.hit;
              player2HitCount = lastLogData.player2.hit;
              if (player1HitCount === 3 || player2HitCount === 3) {
                isMounted && setIsGameSet(true);
              }
            }
            isMounted && setLog(log);
          });
      }

      if (doc.data()?.player1Retry && doc.data()?.player2Retry) {
        const docRef = db.collection('rooms').doc(`room: ${roomId}`);
        const snapshot = await docRef.collection('gameData').get();
        await Promise.all(
          snapshot.docs.map(
            async (doc) =>
              await docRef.collection('gameData').doc(doc.id).delete()
          )
        ).catch((error) => alert(error.message));
        await docRef.update({
          turn: 1,
          player1Added: false,
          player2Added: false,
          player1Retry: false,
          player2Retry: false,
        });

        const member: RoomPlayerInfo = [];
        await db
          .collection('rooms')
          .doc(`room: ${roomId}`)
          .collection('player')
          .get()
          .then((snapshot) => {
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
          });
        if (isMounted) {
          setIsGameSet(false);
          setDisabled(false);
        }
      }

      if (
        doc.data()?.player1Number &&
        doc.data()?.player2Number &&
        doc.data()?.player1Retry &&
        doc.data()?.player2Retry
      ) {
        const member: RoomPlayerInfo = [];
        await db
          .collection('rooms')
          .doc(`room: ${roomId}`)
          .collection('player')
          .get()
          .then((snapshot) => {
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
          });
        const opponentData = member.find((user) => user.id !== userUid);
        const playerData = member.find((user) => user.id === userUid);
        if (playerData && opponentData && isMounted) {
          setRoomInfo({
            roomId: roomId,
            userUid: userUid,
            name: playerData.name,
            player: playerData.player,
            selectNumber: playerData.selected,
            opponent: opponentData.name,
            opponentSelectNumber: opponentData.selected,
          });
        }
      }
    });
