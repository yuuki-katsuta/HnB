import { User } from 'firebase/auth';
import { FC, useState } from 'react';

import { CheckboxField } from '@/components/CheckboxField';
import { GAME_MESSAGES } from '@/constants';
import { useRoom } from '@/hooks';
import { useAuthStore } from '@/store/authState';
import type { RoomInfo } from '@/types';

type Props = {
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
};

export const Home: FC<Props> = ({ setRoomInfo }) => {
  const currentUser = useAuthStore((state) => state.currentUser) as User;
  const [name, setName] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [checkedValues, setCheckedValues] = useState<number[]>([]);

  const {
    createRoom: createRoomService,
    joinRoom: joinRoomService,
    isLoading,
    error,
    clearError,
  } = useRoom();

  const handleCreateRoom = async () => {
    if (!currentUser?.uid) return;

    clearError();

    try {
      const roomId = await createRoomService({
        name,
        numbers: checkedValues as [number, number, number],
        userUid: currentUser.uid,
      });

      // ルーム作成後のroomInfoを設定
      setRoomInfo({
        roomId,
        userUid: currentUser.uid,
        name,
        player: 'player1',
        selectNumber: checkedValues,
        opponent: '',
        opponentSelectNumber: [],
      });
    } catch (err) {
      // エラーはhook内で管理される
    }
  };

  const handleJoinRoom = async () => {
    if (!currentUser?.uid) return;

    clearError();

    try {
      await joinRoomService({
        roomId,
        name,
        numbers: checkedValues as [number, number, number],
        userUid: currentUser.uid,
      });

      // ルーム参加後のroomInfoを設定
      setRoomInfo({
        roomId,
        userUid: currentUser.uid,
        name,
        player: 'player2',
        selectNumber: checkedValues,
        opponent: '',
        opponentSelectNumber: [],
      });
    } catch (err) {
      // エラーはhook内で管理される
    }
  };

  return (
    <div className="container">
      <h2>Hit and Blow !!</h2>
      <p>
        0から9の数字で3ケタの数字を作り、正解の数字を予測していくゲームです。
        <br />
        正解の3桁の数値に対して、予測した数字が位置も数字も合っている場合は「hit」位置は間違っているが数字は合っているという場合は「blow」と表示されます。
      </p>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          エラー: {error}
        </div>
      )}

      <span>{GAME_MESSAGES.SELECT_NUMBERS}</span>
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
      <div className="form-wrapper">
        <table style={{ textAlign: 'left' }}>
          <tbody>
            <tr>
              <td>Name</td>
              <td>
                <input
                  placeholder="あなたのニックネーム"
                  maxLength={10}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </td>
              <td>
                <button onClick={handleJoinRoom} disabled={isLoading}>
                  入室
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <button onClick={handleCreateRoom} disabled={isLoading}>
          部屋を作る
        </button>
      </div>
    </div>
  );
};
