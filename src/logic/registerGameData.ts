import {
  collection,
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '../firebase';
import { numberValidate } from './numberValidate';

const check = (numArray: number[], playerNumber: number[]) => {
  let hitCount = 0;
  let blowCount = 0;

  numArray.forEach((val, index) => {
    if (val === playerNumber[index]) hitCount += 1;
    else if (playerNumber.includes(val)) blowCount += 1;
  });
  return {
    ownSelect: numArray,
    hit: hitCount,
    blow: blowCount,
  };
};

export const registerGameData = async (
  numberArray: number[],
  id: string,
  player: string,
  setDisabled: (state: boolean) => void
) => {
  if (!numberValidate(numberArray))
    throw new Error(`無効な数字だよ! 数字は3つ選んでね!`);
  setDisabled(true);
  const docRef = doc(collection(db, 'rooms'), `room: ${id}`);

  //hit blow をチェックする
  let player1Number: number[] = [];
  let player2Number: number[] = [];
  let turn: number = 0;
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    player1Number = data?.player1Number;
    player2Number = data?.player2Number;
    turn = data?.turn;
  }
  const result = check(
    numberArray,
    player === 'player1' ? player2Number : player1Number
  );

  await runTransaction(db, async (transaction) => {
    const gameDataRef = doc(
      collection(docRef, 'gameData'),
      `turn: ${turn.toString()}`
    );
    if (player === 'player1') {
      transaction.set(
        gameDataRef,
        {
          player1: result,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      transaction.update(docRef, {
        player1Added: true,
      });
    } else if (player === 'player2') {
      transaction.set(
        gameDataRef,
        {
          player2: result,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
      transaction.update(docRef, {
        player2Added: true,
      });
    }
  });
};
