import { FC, useCallback, useMemo, useState } from 'react';
import { db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from './store/authState';
import firebase from 'firebase';

export const Home: FC = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState) as firebase.User;
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const numberList: number[] = useMemo(() => [], []);

  const registerRoom = useCallback(
    async (id: string, name: string, numberList: number[]) => {
      const ref = db
        .collection('rooms')
        .doc(`room: ${id}`)
        .collection('player');
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
      if (currentUser.uid === latestUid) {
        alert('同じユーザーは入れないよ!');
        return;
      }

      //0人だったら...
      if (member === 0) {
        db.collection('rooms')
          .doc(`room: ${id}`)
          .set({
            turn: 1,
            player1Trycount: 0,
            player2Trycount: 0,
            player1: name,
            player2: '',
            player1Number: numberList,
            player2Number: null,
            player1Added: false,
            player2Added: false,
          })
          .catch(function (error) {
            console.error('Error writing document: ', error);
          });
        await ref
          .doc(currentUser.uid)
          .set({
            name: name,
            uid: currentUser.uid,
            player: 'player1',
            selected: numberList,
          })
          .catch((error) => {
            console.error(error.message);
          });
      }

      //1人だったら...
      if (member === 1) {
        db.collection('rooms')
          .doc(`room: ${id}`)
          .set(
            {
              player2: name,
              player2Number: numberList,
            },
            { merge: true }
          )
          .catch(function (error) {
            console.error('Error writing document: ', error);
          });

        await ref
          .doc(currentUser.uid)
          .set({
            name: name,
            uid: currentUser.uid,
            player: 'player2',
            selected: numberList,
          })
          .catch((error) => {
            console.error(error.message);
          });
      }

      navigate(`room/${id}`, {
        state: { id: id, name: name, uid: currentUser.uid },
      });
    },
    [navigate, currentUser]
  );

  return (
    <div>
      <p>hit and blow !!</p>
      <label>3桁の数字を入力してね</label>
      <br />

      {new Array(10).fill(0).map((_, i) => {
        return (
          <span key={i}>
            <input
              type='checkbox'
              value={i}
              onChange={(e) => {
                numberList.push(Number(e.target.value));
                console.log(numberList);
              }}
            />
            <label>{i}</label>
          </span>
        );
      })}
      <br />
      <label>name</label>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <br />
      <label>roomID</label>
      <input
        value={roomId}
        onChange={(e) => {
          setRoomId(e.target.value);
        }}
      />
      <br />
      <button
        onClick={() => {
          registerRoom(roomId, name, numberList);
        }}
      >
        入室
      </button>
    </div>
  );
};
