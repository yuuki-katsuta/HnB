import { FC, useCallback, useEffect, useState } from 'react';

import { CheckboxField } from '@/components/CheckboxField';
import { LogField } from '@/components/LogField';
import { useGame, usePlayers, useRoom } from '@/hooks';
import type { RoomInfo } from '@/types';

const onUnload = (e: { preventDefault: () => void; returnValue: string }) => {
  e.preventDefault();
  e.returnValue = '';
};

export const Room: FC<{
  roomInfo: RoomInfo;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
}> = ({ roomInfo, setRoomInfo }) => {
  const { roomId, userUid, name, player, selectNumber } = roomInfo;
  const [checkedValues, setCheckedValues] = useState<number[]>([]);

  // カスタムフックを使用
  const { currentPlayer, opponent, isWaitingForOpponent } = usePlayers({
    roomId,
    userUid,
    isActive: !!roomId && !!userUid,
  });

  const handleGameReset = useCallback(() => {
    // リセット完了時に数字をクリア
    setCheckedValues([]);
  }, []);

  const { gameLog, isGameSet, isDisabled, error, submitGuess, clearError } =
    useGame({
      roomId,
      userUid,
      isActive: !!roomId && !!userUid && !isWaitingForOpponent,
      onGameReset: handleGameReset,
    });

  const { leaveRoom, resetGame, isLoading, error: roomError } = useRoom();

  useEffect(() => {
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  const reset = useCallback(async () => {
    if (checkedValues.length !== 3) {
      alert('3つの数字を選択してください');
      return;
    }

    try {
      await resetGame(roomId, userUid, checkedValues);

      // リセット成功時にroomInfoの選択数字を更新
      setRoomInfo((prev) => ({
        ...prev,
        selectNumber: checkedValues,
      }));

      // リセット送信後は数字をクリアしない（相手の送信を待つ間は表示維持）
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'ゲームリセットに失敗しました'
      );
    }
  }, [checkedValues, resetGame, roomId, userUid, setRoomInfo]);

  const add = useCallback(async () => {
    if (checkedValues.length !== 3) {
      alert('3つの数字を選択してください');
      return;
    }

    clearError();

    try {
      await submitGuess(checkedValues);
      setCheckedValues([]);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : '推測の送信に失敗しました'
      );
    }
  }, [checkedValues, submitGuess, clearError]);

  const leave = useCallback(async () => {
    if (!window.confirm('退出しますか？')) return;

    try {
      await leaveRoom(roomId, userUid);
      setRoomInfo({
        roomId: '',
        userUid: '',
        name: '',
        player: '',
        selectNumber: [],
        opponent: '',
        opponentSelectNumber: [],
      });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'ルーム退出に失敗しました'
      );
    }
  }, [leaveRoom, setRoomInfo, roomId, userUid]);

  const ButtonField: FC<{
    fresh: boolean;
  }> = ({ fresh }): JSX.Element => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="button-wrapper">
        <button onClick={() => leave()}>退出</button>
        <button onClick={() => setCheckedValues([])}>数字をリセット</button>
        <button
          onClick={() => (fresh ? reset() : add())}
          disabled={isDisabled || isLoading}
        >
          送信!
        </button>
      </div>
    </div>
  );
  return (
    <div className="container">
      <h4>Room: {roomId}</h4>
      {isWaitingForOpponent ? (
        <div>
          <p>対戦相手を探しています...</p>
          <button onClick={() => leave()}>退出</button>
        </div>
      ) : (
        <div>
          <div className="roomInfo-field">
            <p>対戦相手が見つかったよ!!</p>
            <p>
              {name} vs {opponent?.name || '不明'}
            </p>
            <p>自分の番号: {currentPlayer?.selected || selectNumber}</p>
          </div>
          <div>
            {error && (
              <div style={{ color: 'red', marginBottom: '10px' }}>
                エラー: {error}
              </div>
            )}
            {roomError && (
              <div style={{ color: 'red', marginBottom: '10px' }}>
                エラー: {roomError}
              </div>
            )}
            {!isGameSet ? (
              <>
                <CheckboxField
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                />
                <br />
                <ButtonField fresh={false} />
                <br />
                {isDisabled && <span>相手の入力を待ってます...</span>}
                <br />
              </>
            ) : (
              <div>
                <p>ゲーム終了!!</p>
                <p>もう一度遊ぶ場合は、数字を選んでね</p>
                <div>
                  <CheckboxField
                    checkedValues={checkedValues}
                    setCheckedValues={setCheckedValues}
                  />
                  <ButtonField fresh />
                </div>
                {isDisabled && <p id="text">相手の入力をまってます...</p>}
              </div>
            )}
            {gameLog.length > 0 && (
              <LogField
                player={player}
                opponentSelectNumber={opponent?.selected || []}
                log={gameLog}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
