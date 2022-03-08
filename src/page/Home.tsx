import { FC, useState } from 'react';
import { CheckboxField } from '../components/CheckboxField';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../store/authState';
import firebase from 'firebase/app';
import { registerRoom } from '../logic/registerRoom';

export const Home: FC = () => {
  const navigate = useNavigate();
  const currentUser = useRecoilValue(currentUserState) as firebase.User;
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<number[]>([]);

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
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className='input-field'>
          <label>Room</label>
          <input
            maxLength={10}
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
        </div>
      </div>
      <div>
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
    </div>
  );
};
