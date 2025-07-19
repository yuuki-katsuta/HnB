import './css/App.css';

import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { FC, useEffect, useState } from 'react';

import { createInitialRoomInfo } from '@/domain';
import { auth, db } from '@/firebase';
import { Home } from '@/page/Home';
import { Room } from '@/page/Room';
import { useAuthStore } from '@/store/authState';
import { RoomInfo } from '@/types';

const App: FC = () => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(createInitialRoomInfo());
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // 未ログイン時
      if (!user) {
        // 匿名ログインする
        await signInAnonymously(auth);
      }
      // ログイン時
      else {
        // ログイン済みのユーザー情報があるかをチェック
        const userDocRef = doc(collection(db, 'users'), user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          // Firestore にユーザー用のドキュメントが作られていなければ作る
          await setDoc(userDocRef, {
            uid: user.uid,
          });
        }
      }
      setCurrentUser(user);
    });
  }, [setCurrentUser]);

  return !roomInfo.roomId && !roomInfo.userUid ? (
    <Home setRoomInfo={setRoomInfo} />
  ) : (
    <Room roomInfo={roomInfo} setRoomInfo={setRoomInfo} />
  );
};

export default App;
