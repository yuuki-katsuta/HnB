import { collection, doc, runTransaction } from 'firebase/firestore';

import { db } from '../firebase';

export const removePlayerData = async (id: string, uid: string) => {
  const docRef = doc(collection(db, 'rooms'), `room: ${id}`);
  const playerRef = doc(collection(docRef, 'player'), uid);

  await runTransaction(db, async (transaction) => {
    transaction.delete(playerRef);
    transaction.delete(docRef);
  });
};
