import { db } from '../firebase';
import { numberValidate } from './numberValidate';

export const resetGame = async (
  numberList: number[],
  id: string,
  uid: string,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const room = `room: ${id}`;
  const docRef = db.collection('rooms').doc(room);
  const playerRef = docRef.collection('player').doc(uid);
  const player = await playerRef.get().then((doc) => doc.data()?.player);

  if (!numberValidate(numberList)) {
    setDisabled(false);
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  }

  if (player === 'player1') {
    await db.runTransaction(async (transaction) => {
      transaction.update(playerRef, {
        selected: numberList,
      });
    });
    await db.runTransaction(async (transaction) => {
      transaction.update(docRef, {
        player1Trycount: 0,
        player1Added: false,
        player1Retry: true,
        player1Number: numberList,
      });
    });
  } else if (player === 'player2') {
    await db.runTransaction(async (transaction) => {
      transaction.update(playerRef, {
        selected: numberList,
      });
    });
    await db.runTransaction(async (transaction) => {
      transaction.update(docRef, {
        player2Trycount: 0,
        player2Added: false,
        player2Retry: true,
        player2Number: numberList,
      });
    });
  }
};
