import { collection, doc, getDocs, runTransaction } from 'firebase/firestore';

import { db } from '../firebase';
import { RoomInfo } from '../types';
import { nameValidate } from './nameValidate';
import { numberValidate } from './numberValidate';
import { roomIdValidate } from './roomIdValidate';

export const enterRoom = async (
  roomId: string,
  name: string,
  numberList: number[],
  userUid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) => {
  if (!numberValidate(numberList))
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  if (!nameValidate(name)) throw new Error(`無効な名前だよ!`);
  if (roomIdValidate(roomId)) throw new Error('roomIDを入力してね!');

  const roomsCollection = collection(db, 'rooms');
  const snapshot = await getDocs(roomsCollection);
  const docList: string[] = [];
  snapshot.forEach((doc) => docList.push(doc.id));
  if (!docList.includes(`room: ${roomId}`))
    throw new Error(`roomが見つからないよ...`);

  const roomRef = doc(roomsCollection, `room: ${roomId}`);
  const playersCollection = collection(roomRef, 'player');
  const playersSnapshot = await getDocs(playersCollection);

  if (playersSnapshot.docs.length >= 2)
    throw new Error('他のプレイヤーがいるみたい...!');

  playersSnapshot.forEach((doc) => {
    if (doc.data().uid === userUid)
      throw new Error('同じユーザーは入れないよ!');
  });

  const docPlayerRef = doc(playersCollection, userUid);

  await runTransaction(db, async (transaction) => {
    transaction.set(
      roomRef,
      {
        player2: name,
        player2Number: numberList,
      },
      { merge: true }
    );
    transaction.set(docPlayerRef, {
      name: name,
      uid: userUid,
      player: 'player2',
      selected: numberList,
    });
  });

  setRoomInfo({
    roomId: roomId,
    userUid: userUid,
    name: name,
    selectNumber: numberList,
    player: '',
    opponent: '',
    opponentSelectNumber: [],
  });
};
