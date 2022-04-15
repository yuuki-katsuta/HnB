import { db } from '../firebase';
import firebase from 'firebase/app';
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
  const docRef = db.collection('rooms').doc(`room: ${id}`);

  //hit blow をチェックする
  let player1Number: number[] = [];
  let player2Number: number[] = [];
  let turn: number = 0;
  await docRef.get().then((doc) => {
    player1Number = doc.data()?.player1Number;
    player2Number = doc.data()?.player2Number;
    turn = doc.data()?.turn;
  });
  const result = check(
    numberArray,
    player === 'player1' ? player2Number : player1Number
  );

  db.runTransaction(async (transaction) => {
    if (player === 'player1') {
      transaction.set(
        docRef.collection('gameData').doc(`turn: ${turn.toString()}`),
        {
          player1: result,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      transaction.update(docRef, {
        player1Added: true,
      });
    } else if (player === 'player2') {
      transaction.set(
        docRef.collection('gameData').doc(`turn: ${turn.toString()}`),
        {
          player2: result,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      transaction.update(docRef, {
        player2Added: true,
      });
    }
  });
};
