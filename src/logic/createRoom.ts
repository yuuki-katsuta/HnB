import { db } from '../firebase';
import { RoomInfo } from '../types';
import { nameValidate } from './nameValidate';
import { numberValidate } from './numberValidate';

export const createRoom = async (
  name: string,
  numberList: number[],
  userUid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) => {
  if (!numberValidate(numberList))
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  if (nameValidate(name)) throw new Error(`無効な名前だよ!`);

  let roomId: string = '';

  const duplicateCheck = (list: string[], id: string): string => {
    if (list.includes(`room: ${id}`))
      return duplicateCheck(list, String(Math.random()).substring(2, 6));
    return id;
  };

  //重複チェック
  await db
    .collection('rooms')
    .get()
    .then((Snapshot) => {
      const docList: string[] = [];
      Snapshot.forEach((doc) =>
        Snapshot.forEach((doc) => docList.push(doc.id))
      );
      roomId = duplicateCheck(docList, String(Math.random()).substring(2, 6));
    });

  const docRef = db.collection('rooms').doc(`room: ${roomId}`);
  const docPlayerRef = db
    .collection('rooms')
    .doc(`room: ${roomId}`)
    .collection('player')
    .doc(userUid);

  return await db
    .runTransaction(async (transaction) => {
      transaction.set(docRef, {
        turn: 1,
        player1: name,
        player2: '',
        player1Number: numberList,
        player2Number: null,
        player1Added: false,
        player2Added: false,
        player1Retry: false,
        player2Retry: false,
      });
      transaction.set(docPlayerRef, {
        name: name,
        uid: userUid,
        player: 'player1',
        selected: numberList,
      });
    })
    .then(() =>
      setRoomInfo({
        roomId: roomId,
        userUid: userUid,
        name: name,
        selectNumber: numberList,
        player: '',
        opponent: '',
        opponentSelectNumber: [],
      })
    );
};
