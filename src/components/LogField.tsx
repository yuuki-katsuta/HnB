import { FC } from 'react';

type Props = {
  player: string;
  log: {
    player2: { blow: number; hit: number; ownSelect: number[] };
    player1: { blow: number; hit: number; ownSelect: number[] };
  }[];
};

let player1HitCount = 0;
let player2HitCount = 0;

export const LogField: FC<Props> = ({ log, player }) => {
  const lastLogData = log[log.length - 1];
  player1HitCount = lastLogData.player1.hit;
  player2HitCount = lastLogData.player2.hit;
  const draw = player1HitCount === 3 && player2HitCount === 3;

  return (
    <div>
      <p>---ログ---</p>
      {draw && <p>引き分けだよ!!</p>}
      {player1HitCount === 3 && player === 'player1' && !draw && (
        <p>あなたの勝利です!!</p>
      )}
      {player1HitCount === 3 && player === 'player2' && !draw && (
        <p>あなたの負けです...</p>
      )}
      {player2HitCount === 3 && player === 'player2' && !draw && (
        <p>あなたの勝利です!!</p>
      )}
      {player2HitCount === 3 && player === 'player1' && !draw && (
        <p>あなたの負けです...</p>
      )}
      {log.map((logData, index: number) => (
        <div key={index}>
          {player === 'player1' ? (
            <p>
              あなた: 選んだ数字: {logData.player1.ownSelect}, hit:
              {logData.player1.hit}, blow:{logData.player1.blow}
              <br />
              あいて: 選んだ数字: {logData.player2.ownSelect}, hit:
              {logData.player2.hit}, blow:{logData.player2.blow}
              <br />
              ==================
            </p>
          ) : (
            <p>
              あなた: 選んだ数字: {logData.player2.ownSelect}, hit:
              {logData.player2.hit}, blow:{logData.player2.blow}
              <br />
              あいて: 選んだ数字: {logData.player1.ownSelect}, hit:
              {logData.player1.hit}, blow:{logData.player1.blow}
              <br />
              ==================
            </p>
          )}
        </div>
      ))}
    </div>
  );
};
