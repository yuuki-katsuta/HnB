import { FC, memo } from 'react';
import { LogData } from '../types';

type Props = {
  player: 'player1' | 'player2' | '';
  opponentSelectNumber: number[];
  log: LogData;
};

let player1HitCount = 0;
let player2HitCount = 0;

export const LogField: FC<Props> = memo(
  ({ player, opponentSelectNumber, log }) => {
    const lastLogData = log[log.length - 1];
    player1HitCount = lastLogData.player1.hit;
    player2HitCount = lastLogData.player2.hit;
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
            <p>相手の数字は、{opponentSelectNumber}です！</p>
          </div>
        ) : player2HitCount === 3 && player === 'player2' ? (
          <p>あなたの勝利です!!</p>
        ) : player2HitCount === 3 && player === 'player1' ? (
          <div>
            <p>あなたの負けです...</p>
            <p>相手の数字は、{opponentSelectNumber}です！</p>
          </div>
        ) : null}

        {log.map((logData, index: number) => (
          <div key={index}>
            {player === 'player1' ? (
              <p className='log'>
                あなた: 選んだ数字: {logData.player1.ownSelect}, hit:
                {logData.player1.hit}, blow:{logData.player1.blow}
                <br />
                あいて: 選んだ数字: {logData.player2.ownSelect}, hit:
                {logData.player2.hit}, blow:{logData.player2.blow}
              </p>
            ) : (
              <p className='log'>
                あなた: 選んだ数字: {logData.player2.ownSelect}, hit:
                {logData.player2.hit}, blow:{logData.player2.blow}
                <br />
                あいて: 選んだ数字: {logData.player1.ownSelect}, hit:
                {logData.player1.hit}, blow:{logData.player1.blow}
              </p>
            )}
            <span style={{ display: 'block' }}>==================</span>
          </div>
        ))}
      </div>
    );
  }
);
