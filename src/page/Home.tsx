import { VFC, useState, useCallback } from 'react';
import { CheckboxField } from '../components/CheckboxField';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../store/authState';
import firebase from 'firebase/app';
import { registerRoom } from '../logic/registerRoom';
import { RoomInfo } from '../types';
import { initRoomData } from '../logic/initRoomInfo';
import { db } from '../firebase';

type Props = {
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
};

export const Home: VFC<Props> = ({ setRoomInfo }) => {
  const currentUser = useRecoilValue(currentUserState) as firebase.User;
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<number[]>([]);

  const enter = useCallback(() => {
    registerRoom(roomId, name, checkedValues, currentUser.uid)
      .then(() => {
        setRoomInfo({
          ...initRoomData(),
          roomId: roomId,
          userUid: currentUser.uid,
        });
        const docRef = db.collection('rooms').doc(`room: ${roomId}`);
        const unsubscribe = docRef
          .collection('player')
          .onSnapshot((Snapshot) => {
            const member: {
              id: string;
              name: string;
              selected: number[];
            }[] = [];
            Snapshot.forEach((doc) => {
              if (doc.data()) {
                member.push({
                  id: doc.data().uid,
                  name: doc.data().name,
                  selected: doc.data().selected,
                });
              }
            });
            if (member.length === 2) {
              const opponentData = member.find(
                (user) => user.id !== currentUser.uid
              );
              docRef
                .collection('player')
                .doc(currentUser.uid)
                .get()
                .then((doc) => {
                  if (doc.exists && opponentData) {
                    setRoomInfo({
                      roomId: roomId,
                      userUid: currentUser.uid,
                      name: doc.data()?.name,
                      player: doc.data()?.player,
                      selectNumber: doc.data()?.selected,
                      opponent: opponentData.name,
                      opponentSelectNumber: opponentData.selected,
                    });
                    unsubscribe();
                  }
                });
            }
          });
      })
      .catch((e) => alert(e.message));
  }, [checkedValues, currentUser, name, roomId, setRoomInfo]);

  return (
    <div className='container'>
      <h2>Hit and Blow !!</h2>
      <p>
        0から9の数字で3ケタの数字を作り、正解の数字を予測していくゲームです。
        <br />
        正解の3桁の数値に対して、予測した数字が位置も数字も合っている場合は「hit」位置は間違っているが数字は合っているという場合は「blow」と表示されます。
      </p>
      <span>3つの数字を選びましょう!</span>
      <br />
      <br />
      <CheckboxField
        checkedValues={checkedValues}
        setCheckedValues={setCheckedValues}
      />
      <br />
      <div className='form-wrapper'>
        <div className='input-field'>
          <label>Name</label>
          <input
            placeholder='あなたのニックネーム'
            maxLength={10}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='input-field'>
          <label>Room</label>
          <input
            maxLength={10}
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
      </div>
      <div>
        <button onClick={async () => enter()}>入室</button>
      </div>
    </div>
  );
};
