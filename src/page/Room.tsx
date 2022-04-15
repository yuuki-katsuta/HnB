import { VFC, useCallback, useEffect, useState } from 'react';
import { registerGameData } from '../logic/registerGameData';
import { LogField } from '../components/LogField';
import { CheckboxField } from '../components/CheckboxField';
import { resetGame } from '../logic/resetGame';
import { LogData } from '../types';
import { RoomInfo } from '../types';
import { initRoomData } from '../logic/initRoomInfo';
import { gameDataSubscribe } from '../logic/gameDataSubscribe';
import { playerSubscribe } from '../logic/playerSubscribe';
import { removePlayerData } from '../logic/removePlayerdata';

const onUnload = (e: { preventDefault: () => void; returnValue: string }) => {
  e.preventDefault();
  e.returnValue = '';
};

export const Room: VFC<{
  roomInfo: RoomInfo;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
}> = ({
  roomInfo: {
    roomId,
    userUid,
    name,
    player,
    selectNumber,
    opponent,
    opponentSelectNumber,
  },
  setRoomInfo,
}) => {
  const [isGemeSet, setIsGameSet] = useState<boolean>(false);
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [log, setLog] = useState<LogData>([]);

  useEffect(() => {
    let isMounted = true;
    window.addEventListener('beforeunload', onUnload);

    const unGameDataSubscribe = gameDataSubscribe(
      roomId,
      setIsGameSet,
      setDisabled,
      setLog,
      isMounted,
      userUid,
      setRoomInfo
    );
    const unPlayerSubscribe = playerSubscribe(roomId, userUid, setRoomInfo);

    return () => {
      isMounted = false;
      unPlayerSubscribe();
      unGameDataSubscribe();
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [userUid, roomId, setRoomInfo]);

  const reset = useCallback(
    (id: string, uid: string) => {
      setDisabled(true);
      resetGame(checkedValues, id, uid, setDisabled)
        .then(() => {
          setCheckedValues([]);
          setLog([]);
        })
        .catch(function (error) {
          alert(error.message);
        });
    },
    [checkedValues]
  );

  const add = useCallback(
    (id: string) => {
      registerGameData(checkedValues, id, player, setDisabled)
        .then(() => setCheckedValues([]))
        .catch((e) => alert(e.message));
    },
    [checkedValues, player]
  );

  const leave = useCallback(async () => {
    //await removePlayerData(roomId, userUid);
    //ログデータも削除する
    if (!player || !opponent) await removePlayerData(roomId, userUid);
    window.confirm('退出しますか??') && setRoomInfo(initRoomData());
  }, [setRoomInfo, opponent, player, roomId, userUid]);

  const ButtonField: VFC<{
    fresh: boolean;
  }> = ({ fresh }): JSX.Element => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className='button-wrapper'>
        <button onClick={() => leave()}>退出</button>
        <button onClick={() => setCheckedValues([])}>数字をリセット</button>
        <button
          onClick={() => (fresh ? reset(roomId, userUid) : add(roomId))}
          disabled={disabled}
        >
          送信!
        </button>
      </div>
    </div>
  );
  return (
    <div className='container'>
      <h4>Room: {roomId}</h4>
      {!player || !opponent ? (
        <div>
          <p>対戦相手を探しています...</p>
          <button onClick={() => leave()}>退出</button>
        </div>
      ) : (
        <div>
          <div className='roomInfo-field'>
            <p>対戦相手が見つかったよ!!</p>
            <p>
              {name} vs {opponent}
            </p>
            <p>自分の番号: {selectNumber}</p>
          </div>
          <div>
            {!isGemeSet ? (
              <>
                <CheckboxField
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                />
                <br />
                <ButtonField fresh={false} />
                <br />
                {disabled && <span>相手の入力を待ってます...</span>}
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
                {disabled && <p id='text'>相手の入力をまってます...</p>}
              </div>
            )}
            {log.length > 0 && (
              <LogField
                player={player}
                opponentSelectNumber={opponentSelectNumber}
                log={log}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
