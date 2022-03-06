import { db } from '../firebase';

export const registerRoom = async (
  id: string,
  name: string,
  numberList: number[],
  userUid: string
) => {
  const ref = db.collection('rooms').doc(`room: ${id}`).collection('player');
  const member = await ref.get().then((doc) => doc.docs.length);
  if (member >= 2) {
    alert('他のプレイヤーがいるみたい...!');
    return;
  }

  let latestUid: string = '';
  await ref.get().then((Snapshot) => {
    Snapshot.forEach((doc) => {
      if (doc.exists) latestUid = doc.data().uid;
    });
  });
  if (userUid === latestUid) {
    alert('同じユーザーは入れないよ!');
    return;
  }

  const docRef = db.collection('rooms').doc(`room: ${id}`);
  const docPlayerRef = ref.doc(userUid);

  //0人だったら...
  if (member === 0) {
    await db
      .runTransaction(async (transaction) => {
        transaction.set(docRef, {
          turn: 1,
          player1Trycount: 0,
          player2Trycount: 0,
          player1: name,
          player2: '',
          player1Number: numberList,
          player2Number: null,
          player1Added: false,
          player2Added: false,
        });
        const docPlayerRef = ref.doc(userUid);
        transaction.set(docPlayerRef, {
          name: name,
          uid: userUid,
          player: 'player1',
          selected: numberList,
        });
      })
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }

  if (member === 1) {
    await db
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
      .catch(function (error) {
        console.error('Error writing document: ', error);
      });
  }
};
