import './css/App.css';
import { Home } from './page/Home';
import { auth, db } from './firebase';
import { FC, useEffect, useState } from 'react';
import { Room } from './page/Room';
import { useSetRecoilState } from 'recoil';
import { currentUserState } from './store/authState';
import firebase from 'firebase/app';
import { RoomInfo } from './types';

const App: FC = () => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomId: '',
    userUid: '',
  });

  const setCurrentUser = useSetRecoilState<firebase.User | null>(
    currentUserState
  );
  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      // 未ログイン時
      if (!user) {
        // 匿名ログインする
        await auth.signInAnonymously();
      }
      // ログイン時
      else {
        // ログイン済みのユーザー情報があるかをチェック
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
          // Firestore にユーザー用のドキュメントが作られていなければ作る
          await userDoc.ref.set({
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
    <Room roomInfo={roomInfo} />
  );
};

export default App;
