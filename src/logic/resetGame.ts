import { db } from '../firebase';
import { numberValidate } from './numberValidate';

export const resetGame = async (
  numberList: number[],
  room: string,
  uid: string,
  setIsGameSet: (state: boolean) => void,
  setDisabled: (state: boolean) => void
) => {
  const ref = db.collection('rooms').doc(room).collection('gameData');
  const docRef = db.collection('rooms').doc(room);
  const playerRef = docRef.collection('player').doc(uid);
  const player = await playerRef.get().then((doc) => doc.data()?.player);

  if (!numberValidate(numberList)) {
    setDisabled(false);
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  }

  if (player === 'player1') {
    await db.runTransaction(async (transaction) => {
      transaction.update(docRef, {
        player1Trycount: 0,
        player1Added: false,
        player1Retry: true,
        player1Number: numberList,
      });
    });
    await db.runTransaction(async (transaction) => {
      transaction.update(playerRef, {
        selected: numberList,
      });
    });
  } else if (player === 'player2') {
    await db.runTransaction(async (transaction) => {
      transaction.update(docRef, {
        player2Trycount: 0,
        player2Added: false,
        player2Retry: true,
        player2Number: numberList,
      });
    });
    await db.runTransaction(async (transaction) => {
      transaction.update(playerRef, {
        selected: numberList,
      });
    });
  }

  docRef.onSnapshot(async (doc) => {
    if (doc.data()?.player1Retry && doc.data()?.player2Retry) {
      const snapshot = await ref.get();
      await Promise.all(
        snapshot.docs.map(async (doc) => await ref.doc(doc.id).delete())
      ).catch((error) => alert(error.message));
      await docRef.update({
        turn: 0,
        player1Added: false,
        player2Added: false,
        player1Retry: false,
        player2Retry: false,
      });
      setIsGameSet(false);
      setDisabled(false);
    }
  });
};
