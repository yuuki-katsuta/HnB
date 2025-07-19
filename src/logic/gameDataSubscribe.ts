import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { db } from '../firebase';
import { LogData, RoomInfo, RoomPlayerInfo } from '../types';

export const gameDataSubscribe = (
  roomId: string,
  setIsGameSet: React.Dispatch<React.SetStateAction<boolean>>,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  setLog: React.Dispatch<React.SetStateAction<LogData>>,
  isMounted: boolean,
  userUid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) =>
  onSnapshot(
    doc(collection(db, 'rooms'), `room: ${roomId}`),
    async (docSnap) => {
      const data = docSnap.data();
      if (data?.player1Added && data?.player2Added) {
        const docRef = doc(collection(db, 'rooms'), `room: ${roomId}`);

        isMounted && setDisabled(false);
        await updateDoc(docRef, {
          turn: data?.turn + 1,
          player1Added: false,
          player2Added: false,
        });

        const gameDataCollection = collection(docRef, 'gameData');
        const gameDataQuery = query(
          gameDataCollection,
          orderBy('createdAt', 'asc')
        );
        const snapshot = await getDocs(gameDataQuery);
        let log: LogData = [];
        let player1HitCount = 0;
        let player2HitCount = 0;

        snapshot.forEach((doc) => {
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
      }

      if (data?.player1Retry && data?.player2Retry) {
        const docRef = doc(collection(db, 'rooms'), `room: ${roomId}`);
        const gameDataCollection = collection(docRef, 'gameData');
        const gameDataSnapshot = await getDocs(gameDataCollection);

        await Promise.all(
          gameDataSnapshot.docs.map(async (doc) => await deleteDoc(doc.ref))
        ).catch((error) => alert(error.message));

        await updateDoc(docRef, {
          turn: 1,
          player1Added: false,
          player2Added: false,
          player1Retry: false,
          player2Retry: false,
        });

        const member: RoomPlayerInfo = [];
        const playersCollection = collection(docRef, 'player');
        const playersSnapshot = await getDocs(playersCollection);

        playersSnapshot.forEach((doc) => {
          if (doc.data()) {
            member.push({
              id: doc.data().uid,
              name: doc.data().name,
              player: doc.data().player,
              selected: doc.data().selected,
            });
          }
        });

        if (isMounted) {
          setIsGameSet(false);
          setDisabled(false);
        }
      }

      if (
        data?.player1Number &&
        data?.player2Number &&
        data?.player1Retry &&
        data?.player2Retry
      ) {
        const member: RoomPlayerInfo = [];
        const docRef = doc(collection(db, 'rooms'), `room: ${roomId}`);
        const playersCollection = collection(docRef, 'player');
        const playersSnapshot = await getDocs(playersCollection);

        playersSnapshot.forEach((doc) => {
          if (doc.data()) {
            member.push({
              id: doc.data().uid,
              name: doc.data().name,
              player: doc.data().player,
              selected: doc.data().selected,
            });
          }
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
    }
  );
