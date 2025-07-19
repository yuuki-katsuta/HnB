import { FC, memo } from 'react';

import type { GameLog } from '@/types/game';

type Props = {
  player: 'player1' | 'player2' | '';
  opponentSelectNumber: number[];
  log: GameLog;
};

let player1HitCount = 0;
let player2HitCount = 0;

export const LogField: FC<Props> = memo(({ player, log }) => {
  if (!log || log.length === 0) {
    return <div>ログがまだありません</div>;
  }
  const lastLogData = log[log.length - 1];
  player1HitCount = lastLogData?.player1?.hit || 0;
  player2HitCount = lastLogData?.player2?.hit || 0;
  const draw = player1HitCount === 3 && player2HitCount === 3;

  return (
    <div>
      <p style={{ marginBottom: 0, marginTop: 8 }}>---ログ---</p>
      {draw ? (
        <p>引き分けだよ!!</p>
      ) : player1HitCount === 3 && player === 'player1' ? (
        <p>あなたの勝利です!!</p>
      ) : player1HitCount === 3 && player === 'player2' ? (
        <div>
          <p>あなたの負けです...</p>
        </div>
      ) : player2HitCount === 3 && player === 'player2' ? (
        <p>あなたの勝利です!!</p>
      ) : player2HitCount === 3 && player === 'player1' ? (
        <div>
          <p>あなたの負けです...</p>
        </div>
      ) : null}

      {log.map((logData, index: number) => {
        const player1Data = logData.player1;
        const player2Data = logData.player2;

        if (!player1Data || !player2Data) {
          return null;
        }

        return (
          <div key={index}>
            {player === 'player1' ? (
              <p className="log">
                あなた: 選んだ数字: {player1Data.ownSelect}, hit:
                {player1Data.hit}, blow:{player1Data.blow}
                <br />
                あいて: 選んだ数字: {player2Data.ownSelect}, hit:
                {player2Data.hit}, blow:{player2Data.blow}
              </p>
            ) : (
              <p className="log">
                あなた: 選んだ数字: {player2Data.ownSelect}, hit:
                {player2Data.hit}, blow:{player2Data.blow}
                <br />
                あいて: 選んだ数字: {player1Data.ownSelect}, hit:
                {player1Data.hit}, blow:{player1Data.blow}
              </p>
            )}
            <span style={{ display: 'block' }}>==================</span>
          </div>
        );
      })}
    </div>
  );
});
