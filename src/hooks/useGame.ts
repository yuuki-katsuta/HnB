/**
 * ゲーム進行管理のカスタムフック
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { checkGameCompletion } from '@/domain';
import { GameService } from '@/services';
import type { GameLog } from '@/types/game';

const gameService = new GameService();

interface UseGameProps {
  roomId: string;
  userUid: string;
  isActive: boolean; // ゲームがアクティブかどうか
  onGameReset?: () => void; // リセット完了時のコールバック
}

export const useGame = ({
  roomId,
  userUid,
  isActive,
  onGameReset,
}: UseGameProps) => {
  const [gameLog, setGameLog] = useState<GameLog>([]);
  const [isGameSet, setIsGameSet] = useState(false);
  const [winner, setWinner] = useState<string | undefined>();
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  // ゲーム状態の監視
  useEffect(() => {
    if (!isActive || !roomId) return;

    const unsubscribe = gameService.subscribeToGameState(roomId, {
      onTurnComplete: (log: GameLog) => {
        setGameLog(log);
        setIsDisabled(false);

        // ゲーム終了判定
        const result = checkGameCompletion(log);
        if (result.isFinished) {
          setIsGameSet(true);
          setWinner(result.winner);
        }
      },
      onGameReset: () => {
        setGameLog([]);
        setIsGameSet(false);
        setWinner(undefined);
        setIsDisabled(false);
        if (onGameReset) {
          onGameReset();
        }
      },
    });

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [roomId, isActive, onGameReset]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const submitGuess = useCallback(
    async (numbers: number[]) => {
      if (!roomId || !userUid) return;

      setIsDisabled(true);
      setError(null);

      try {
        await gameService.registerGameData(roomId, userUid, numbers);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '予期せぬエラー発生しました'
        );
        setIsDisabled(false);
        throw err;
      }
    },
    [roomId, userUid]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    gameLog,
    isGameSet,
    winner,
    isDisabled,
    error,
    submitGuess,
    clearError,
    setIsDisabled, // 後方互換性のため
  };
};
