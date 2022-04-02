import { VFC, useCallback, useEffect, useState } from 'react';
import { registerGameData } from '../logic/registerGameData';
import { LogField } from '../components/LogField';
import { CheckboxField } from '../components/CheckboxField';
import { resetGame } from '../logic/resetGame';
import { LogData } from '../types';
import { RoomInfo } from '../types';
import { initRoomData } from '../logic/initRoomInfo';
import { db } from '../firebase';

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
    window.addEventListener('beforeunload', onUnload);
    const docRef = db.collection('rooms').doc(`room: ${roomId}`);
    const unsubscribe = docRef
      .collection('gameData')
      .orderBy('createdAt', 'asc')
      .onSnapshot((Snapshot) => {
        let log: LogData = [];
        let player1HitCount = 0;
        let player2HitCount = 0;

        Snapshot.forEach((doc) => {
          if (doc.data().player2 && doc.data().player1) {
            log.push({
              player2: doc.data().player2,
              player1: doc.data().player1,
            });
          }
        });

        if (log.length > 0) {
          const lastLogData = log[log.length - 1];
          player1HitCount = lastLogData.player1.hit;
          player2HitCount = lastLogData.player2.hit;
          if (player1HitCount === 3 || player2HitCount === 3) {
            setIsGameSet(true);
          }
        }
        setLog(log);
      });
    return () => {
      window.removeEventListener('beforeunload', onUnload);
      unsubscribe();
    };
  }, [userUid, roomId]);

  const reset = useCallback(
    (id: string, uid: string) => {
      setDisabled(true);
      resetGame(checkedValues, id, uid, setIsGameSet, setDisabled, setRoomInfo)
        .then(() => {
          setCheckedValues([]);
        })
        .catch(function (error) {
          alert(error.message);
        });
    },
    [checkedValues, setRoomInfo]
  );

  const add = useCallback(
    (id: string) => {
      registerGameData(checkedValues, id, player, setDisabled)
        .then(() => setCheckedValues([]))
        .catch((e) => alert(e.message));
    },
    [checkedValues, player]
  );

  const leave = useCallback(() => {
    window.confirm('退出しますか??') && setRoomInfo(initRoomData());
  }, [setRoomInfo]);

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
          <p>対戦相手が見つからないよ...</p>
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
