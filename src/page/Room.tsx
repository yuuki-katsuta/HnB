import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { registerGameData } from '../logic/registerGameData';
import { LogField } from '../components/LogField';
import { CheckboxField } from '../components/CheckboxField';
import { Navigate } from 'react-router-dom';

type UserData = {
  name: string;
  player: string;
  selectNumber: number[];
  opponent: string;
};

type LogData = {
  player2: { blow: number; hit: number; ownSelect: number[] };
  player1: { blow: number; hit: number; ownSelect: number[] };
}[];

export const Room: FC = () => {
  const [isGemeSet, setIsGameSet] = useState<boolean>(false);
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [log, setLog] = useState<LogData>([]);
  const [userData, setUserData] = useState<UserData>({
    player: '',
    name: '',
    selectNumber: [],
    opponent: '',
  });

  const location = useLocation();
  const userInfo = location?.state as {
    id: string;
    name: string;
    uid: string;
  } | null;

  useEffect(() => {
    let isMounted = true;

    if (userInfo) {
      const docRef = db.collection('rooms').doc(`room: ${userInfo.id}`);
      //dbのルームにプレイヤーが来たら対戦 playerを監視
      docRef.collection('player').onSnapshot((Snapshot) => {
        const member: { id: string; name: string }[] = [];
        Snapshot.forEach((doc) => {
          if (doc.data()) {
            member.push({ id: doc.data().uid, name: doc.data().name });
          }
        });

        //初期データ（バトルデータ）2人揃ったら
        if (member.length === 2) {
          const opponentData = member.find((user) => user.id !== userInfo.uid);
          docRef
            .collection('player')
            .doc(userInfo.uid)
            .get()
            .then((doc) => {
              if (doc.exists) {
                isMounted &&
                  setUserData({
                    name: doc.data()?.name,
                    player: doc.data()?.player,
                    selectNumber: doc.data()?.selected,
                    opponent: opponentData?.name || '',
                  });
              }
            });
        }
      });

      //ログ情報を取得してmapで表示
      docRef.collection('gameData').onSnapshot((Snapshot) => {
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
    }

    return () => {
      isMounted = false;
    };
  }, [userInfo]);

  return !userInfo ? (
    <Navigate to='/' replace />
  ) : (
    <div className='container'>
      <h4>Room: {userInfo.id}</h4>
      {!userData.player || !userData.opponent ? (
        <p>対戦相手が見つからないよ...</p>
      ) : (
        <div>
          <div className='roomInfo-field'>
            <p>対戦相手が見つかったよ!!</p>
            <p>
              {userData.name} vs {userData.opponent}
            </p>
            <p>自分の番号: {userData.selectNumber}</p>
          </div>
          <div>
            {!isGemeSet && (
              <>
                <CheckboxField
                  checkedValues={checkedValues}
                  setCheckedValues={setCheckedValues}
                />
                <br />
                <button
                  onClick={async () => {
                    await registerGameData(
                      checkedValues,
                      userInfo.id,
                      userData.player,
                      setDisabled
                    );
                    setCheckedValues([]);
                  }}
                  disabled={disabled}
                >
                  送信!
                </button>
                {disabled && <span>相手の入力を待ってます...</span>}
              </>
            )}
            {log.length > 0 && <LogField player={userData.player} log={log} />}
          </div>
        </div>
      )}
    </div>
  );
};
