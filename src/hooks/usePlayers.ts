/**
 * プレイヤー管理のカスタムフック
 */

import { useEffect, useRef, useState } from 'react';

import { findCurrentPlayer, findOpponent } from '@/domain/player';
import { RoomService } from '@/services';
import type { PlayerInfo, PlayerList } from '@/types/player';

const roomService = new RoomService();

interface UsePlayersProps {
  roomId: string;
  userUid: string;
  isActive: boolean;
}

export const usePlayers = ({ roomId, userUid, isActive }: UsePlayersProps) => {
  const [players, setPlayers] = useState<PlayerList>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerInfo | null>(null);
  const [opponent, setOpponent] = useState<PlayerInfo | null>(null);
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(true);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isActive || !roomId || !userUid) return;

    const unsubscribe = roomService.subscribeToPlayers(
      roomId,
      (playerList: PlayerList) => {
        setPlayers(playerList);

        const current = findCurrentPlayer(playerList, userUid);
        const opp = findOpponent(playerList, userUid);

        setCurrentPlayer(current);
        setOpponent(opp);
        setIsWaitingForOpponent(!opp);
      }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [roomId, userUid, isActive]);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    players,
    currentPlayer,
    opponent,
    isWaitingForOpponent,
  };
};
