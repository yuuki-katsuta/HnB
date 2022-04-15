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

  if (player === 'player1') {
    await docRef.collection('gameData').doc(`turn: ${turn.toString()}`).set(
      {
        player1: result,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await docRef.update({
      player1Added: true,
    });
  } else if (player === 'player2') {
    await docRef.collection('gameData').doc(`turn: ${turn.toString()}`).set(
      {
        player2: result,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await docRef.update({
      player2Added: true,
    });
  }
  await docRef.get().then(async (doc) => {
    //2人が入力したよ!
    if (doc.data()?.player1Added && doc.data()?.player2Added) {
      await docRef.update({
        turn: turn + 1,
        player1Added: false,
        player2Added: false,
      });
    }
  });
};
