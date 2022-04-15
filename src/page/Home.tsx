import { VFC, useState } from 'react';
import { CheckboxField } from '../components/CheckboxField';
import { useRecoilValue } from 'recoil';
import { currentUserState } from '../store/authState';
import firebase from 'firebase/app';
import { enterRoom } from '../logic/enterRoom';
import { RoomInfo } from '../types';
import { initRoomData } from '../logic/initRoomInfo';
import { createRoom } from '../logic/createRoom';

type Props = {
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
};

export const Home: VFC<Props> = ({ setRoomInfo }) => {
  const currentUser = useRecoilValue(currentUserState) as firebase.User;
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [disabled, setDisabled] = useState(false);

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
      <button onClick={() => setCheckedValues([])}>数字をリセット</button>
      <br />
      <br />
      <div className='form-wrapper'>
        <table style={{ textAlign: 'left' }}>
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <input
                  placeholder='あなたのニックネーム'
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>RoomID</td>
              <td>
                <input
                  maxLength={10}
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </td>
              <td>
                <button
                  onClick={async () => {
                    setDisabled(true);
                    enterRoom(
                      roomId,
                      name,
                      checkedValues,
                      currentUser.uid,
                      setRoomInfo
                    )
                      .then(() => setDisabled(false))
                      .catch((e) => {
                        setDisabled(false);
                        setRoomInfo(initRoomData);
                        alert(e.message);
                      });
                  }}
                  disabled={disabled}
                >
                  入室
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button
          onClick={() => {
            setDisabled(true);
            createRoom(name, checkedValues, currentUser.uid, setRoomInfo).catch(
              (e) => {
                setDisabled(false);
                setRoomInfo(initRoomData);
                alert(e.message);
              }
            );
          }}
          disabled={disabled}
        >
          部屋を作る
        </button>
      </div>
    </div>
  );
};
