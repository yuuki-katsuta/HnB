import { VFC, useCallback, useEffect, useState } from 'react';
import { db } from '../firebase';
import { registerGameData } from '../logic/registerGameData';
import { LogField } from '../components/LogField';
import { CheckboxField } from '../components/CheckboxField';
import { resetGame } from '../logic/resetGame';
import { LogData, RoomData } from '../types';
import { RoomInfo } from '../types';

const onUnload = (e: { preventDefault: () => void; returnValue: string }) => {
  e.preventDefault();
  e.returnValue = '';
};

export const Room: VFC<{
  roomInfo: RoomInfo;
  setRoomInfo: React.Dispatch<React.SetStateAction<RoomInfo>>;
}> = ({ roomInfo: { roomId, userUid }, setRoomInfo }) => {
  const [isGemeSet, setIsGameSet] = useState<boolean>(false);
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [log, setLog] = useState<LogData>([]);
  const [roomData, setRoomData] = useState<RoomData>({
    player: '',
    name: '',
    selectNumber: [],
    opponent: '',
    opponentSelectNumber: [],
  });

  useEffect(() => {
    let isMounted = true;
    window.addEventListener('beforeunload', onUnload);
    const docRef = db.collection('rooms').doc(`room: ${roomId}`);
    docRef.collection('player').onSnapshot((Snapshot) => {
      const member: { id: string; name: string; selected: number[] }[] = [];
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
        const opponentData = member.find((user) => user.id !== userUid);
        docRef
          .collection('player')
          .doc(userUid)
          .get()
          .then((doc) => {
            if (doc.exists && opponentData && isMounted) {
              setRoomData({
                name: doc.data()?.name,
                player: doc.data()?.player,
                selectNumber: doc.data()?.selected,
                opponent: opponentData.name,
                opponentSelectNumber: opponentData.selected,
              });
            }
          });
      }
    });
    docRef
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
            isMounted && setIsGameSet(true);
          }
        }
        isMounted && setLog(log);
      });

    return () => {
      window.removeEventListener('beforeunload', onUnload);
      isMounted = false;
    };
  }, [userUid, roomId]);

  const reset = useCallback(
    (id: string, uid: string) => {
      setDisabled(true);
      resetGame(checkedValues, `room: ${id}`, uid, setIsGameSet, setDisabled)
        .then(() => {
          setCheckedValues([]);
        })
        .catch(function (error) {
          alert(error.message);
        });
    },
    [checkedValues]
  );

  const add = useCallback(
    (id: string) => {
      registerGameData(checkedValues, id, roomData.player, setDisabled)
        .then(() => setCheckedValues([]))
        .catch((e) => alert(e.message));
    },
    [checkedValues, roomData]
  );

  const leave = useCallback(() => {
    window.confirm('退出しますか??') &&
      setRoomInfo({ roomId: '', userUid: '' });
  }, [setRoomInfo]);

  return (
    <div className='container'>
      <h4>Room: {roomId}</h4>
      {!roomData.player || !roomData.opponent ? (
        <div>
          <p>対戦相手が見つからないよ...</p>
          <button onClick={() => leave()}>退出</button>
        </div>
      ) : (
        <div>
          <div className='roomInfo-field'>
            <p>
              {roomData.name} vs {roomData.opponent}
            </p>
            <p>自分の番号: {roomData.selectNumber}</p>
          </div>
          <div>
            {!isGemeSet ? (
              <>
                <CheckboxField
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className='button-wrapper'>
                    <button onClick={() => leave()}>退出</button>
                    <button onClick={() => add(roomId)} disabled={disabled}>
                      送信!
                    </button>
                  </div>
                  {disabled && <span>相手の入力を待ってます...</span>}
                </div>
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
                  <div style={{ marginTop: '8px' }}>
                    <button onClick={() => leave()} style={{ margin: '0 4px' }}>
                      退出
                    </button>
                    <button
                      style={{ margin: '0 4px' }}
                      onClick={() => reset(roomId, userUid)}
                      disabled={disabled}
                    >
                      もう一度あそぶ
                    </button>
                  </div>
                </div>
                {disabled && <p id='text'>相手の入力をまってます...</p>}
              </div>
            )}
            {log.length > 0 && <LogField roomData={roomData} log={log} />}
          </div>
        </div>
      )}
    </div>
  );
};
