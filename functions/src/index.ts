import functions = require('firebase-functions');
import admin = require('firebase-admin');

admin.initializeApp();

const deleteDocumentRecursively = async (
  docRef: admin.firestore.DocumentReference<admin.firestore.DocumentData>
) => {
  const collections = await docRef.listCollections();
  if (collections.length > 0) {
    for (const collection of collections) {
      const snapshot = await collection.get();
      for (const doc of snapshot.docs) {
        //単独のドキュメントに対して実行
        await deleteDocumentRecursively(doc.ref);
      }
    }
  }
  await docRef.delete(); //サブコレクションを削除してから実行
};

exports.clearRoomData = functions
  .region('asia-northeast1')
  .runWith({
    timeoutSeconds: 300,
    memory: '2GB',
  })
  .pubsub.schedule('0 0 * * *') //毎日0:00に実行
  .timeZone('Asia/Tokyo')
  .onRun(async () => {
    const db = admin.firestore();
    const ref = db.collection('rooms');
    const snapshot = await ref.get();

    await Promise.all(
      snapshot.docs.map(async (doc) => {
        await deleteDocumentRecursively(db.collection('rooms').doc(doc.id));
      })
    ).catch((error) => error.message);
  });
