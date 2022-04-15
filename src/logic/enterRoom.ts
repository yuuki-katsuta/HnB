import { db } from '../firebase';
import { numberValidate } from './numberValidate';
import { nameValidate } from './nameValidate';
import { roomIdValidate } from './roomIdValidate';
import { RoomInfo } from '../types';

export const enterRoom = async (
  roomId: string,
  name: string,
  numberList: number[],
  userUid: string,
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>
) => {
  if (!numberValidate(numberList))
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  if (nameValidate(name)) throw new Error(`無効な名前だよ!`);
  if (roomIdValidate(roomId)) throw new Error('roomIDを入力してね!');

  await db
    .collection('rooms')
    .get()
    .then((Snapshot) => {
      const docList: string[] = [];
      Snapshot.forEach((doc) => docList.push(doc.id));
      if (!docList.includes(`room: ${roomId}`))
        throw new Error(`roomが見つからないよ...`);
    });

  const ref = db
    .collection('rooms')
    .doc(`room: ${roomId}`)
    .collection('player');
  const member = await ref.get().then((doc) => doc.docs.length);
  if (member >= 2) throw new Error('他のプレイヤーがいるみたい...!');

  await ref.get().then((Snapshot) => {
    Snapshot.forEach((doc) => {
      if (doc.data().uid === userUid)
        throw new Error('同じユーザーは入れないよ!');
    });
  });
  const docRef = db.collection('rooms').doc(`room: ${roomId}`);
  const docPlayerRef = ref.doc(userUid);

  return await db
    .runTransaction(async (transaction) => {
      transaction.set(
        docRef,
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
