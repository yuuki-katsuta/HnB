import { FC, useCallback, useState } from 'react';
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
  const [number, setNumber] = useState<string>('');

  const registerRoom = useCallback(
    async (id: string, name: string, number: string) => {
      const selectNumber = number.split(',');
      const num = selectNumber.map(Number);
      const ref = db
        .collection('rooms')
        .doc(`room: ${id}`)
        .collection('player');
      const member = await ref.get().then((doc) => doc.docs.length);
      if (member >= 2) {
        alert('他のプレイヤーがいるみたい...!');
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
            player1Number: num,
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
            selected: num,
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
              player2Number: num,
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
            selected: num,
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
      <label>3桁の数字を入力してね(例: 3,4,5)</label>
      <input
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);
        }}
      />
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
          registerRoom(roomId, name, number);
        }}
      >
        入室
      </button>
    </div>
  );
};
