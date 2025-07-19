import { collection, doc, getDoc, runTransaction } from 'firebase/firestore';

import { db } from '../firebase';
import { numberValidate } from './numberValidate';

export const resetGame = async (
  numberList: number[],
  id: string,
  uid: string,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const room = `room: ${id}`;
  const docRef = doc(collection(db, 'rooms'), room);
  const playerRef = doc(collection(docRef, 'player'), uid);
  const playerDoc = await getDoc(playerRef);
  const player = playerDoc.data()?.player;

  if (!numberValidate(numberList)) {
    setDisabled(false);
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  }

  await runTransaction(db, async (transaction) => {
    if (player === 'player1') {
      transaction.update(playerRef, {
        selected: numberList,
      });
      transaction.update(docRef, {
        player1Trycount: 0,
        player1Added: false,
        player1Retry: true,
        player1Number: numberList,
      });
    } else if (player === 'player2') {
      transaction.update(playerRef, {
        selected: numberList,
      });
      transaction.update(docRef, {
        player2Trycount: 0,
        player2Added: false,
        player2Retry: true,
        player2Number: numberList,
      });
    }
  });
};
