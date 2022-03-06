import { FC, useState } from 'react';
import { CheckboxField } from './CheckboxField';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from './store/authState';
import firebase from 'firebase';
import { registerRoom } from './logic/registerRoom';

export const Home: FC = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState) as firebase.User;
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<number[]>([]);

  return (
    <div>
      <p>hit and blow !!</p>
      <label>3桁の数字を入力してね</label>
      <br />
      <CheckboxField
        checkedValues={checkedValues}
        setCheckedValues={setCheckedValues}
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
        onClick={async () => {
          registerRoom(roomId, name, checkedValues, currentUser.uid)
            .then(() => {
              navigate(`room/${roomId}`, {
                state: { id: roomId, name: name, uid: currentUser.uid },
              });
            })
            .catch((e) => {});
        }}
      >
        入室
      </button>
    </div>
  );
};
