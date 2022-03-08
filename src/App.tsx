import './css/App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Home } from './page/Home';
import { auth, db } from './firebase';
import { useEffect } from 'react';
import { Room } from './page/Room';
import { useSetRecoilState } from 'recoil';
import { currentUserState } from './store/authState';
import firebase from 'firebase/app';

function App() {
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
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/room/:id' element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
