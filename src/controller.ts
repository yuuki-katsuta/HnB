import { db } from './firebase';
import firebase from 'firebase';

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
  number: string,
  id: string,
  player: string,
  setDisabled: (state: boolean) => void
) => {
  setDisabled(true);
  const docRef = db.collection('rooms').doc(`room: ${id}`);
  const selectNumber = number.split(',');
  const numArray = selectNumber.map(Number);

  //hit blow をチェックする
  let player1Number: number[] = [];
  let player2Number: number[] = [];
  let player1Trycount: number = 0;
  let player2Trycount: number = 0;
  let turn: number = 0;
  await docRef.get().then((doc) => {
    player1Number = doc.data()?.player1Number;
    player2Number = doc.data()?.player2Number;
    player1Trycount = doc.data()?.player1Trycount;
    player2Trycount = doc.data()?.player2Trycount;
    turn = doc.data()?.turn;
  });
  const result = check(
    numArray,
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
      player1Trycount: player1Trycount++,
      player1Added: true,
    });
  } else {
    await docRef.collection('gameData').doc(`turn: ${turn.toString()}`).set(
      {
        player2: result,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    await docRef.update({
      player2Trycount: player2Trycount++,
      player2Added: true,
    });
  }

  docRef
    .collection('gameData')
    .doc(`turn: ${turn.toString()}`)
    .onSnapshot((doc) => {
      if (doc.data()?.player2 && doc?.data()?.player1) {
        setDisabled(false);
      }
    });

  await docRef.get().then(async (doc) => {
    //2人が入力したよ!
    if (doc.data()?.player1Added && doc.data()?.player2Added) {
      await docRef.update({
        turn: turn + 1,
      });
      await docRef.update({
        player1Added: false,
        player2Added: false,
      });
    }
  });
};
