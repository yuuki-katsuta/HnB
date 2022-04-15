import { db } from '../firebase';

export const removePlayerData = async (id: string, uid: string) => {
  const docRef = db.collection('rooms').doc(`room: ${id}`);

  db.runTransaction(async (transaction) => {
    return await transaction
      .get(db.collection('rooms').doc(`room: ${id}`))
      .then(() => {
        transaction.delete(docRef.collection('player').doc(uid));
        transaction.delete(docRef);
      });
  });
};
