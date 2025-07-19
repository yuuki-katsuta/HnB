/**
 * ルーム管理のカスタムフック
 */

import { useCallback, useState } from 'react';

import { createInitialRoomInfo } from '@/domain/room/roomLogic';
import { RoomService } from '@/services';
import type { CreateRoomParams, JoinRoomParams, RoomInfo } from '@/types/room';

const roomService = new RoomService();

export const useRoom = () => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>(createInitialRoomInfo());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = useCallback(
    async (params: CreateRoomParams): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const roomId = await roomService.createRoom(params);

        setRoomInfo({
          roomId,
          userUid: params.userUid,
          name: params.name,
          player: 'player1',
          selectNumber: params.numbers,
          opponent: '',
          opponentSelectNumber: [],
        });

        return roomId;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'ルーム作成に失敗しました'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const joinRoom = useCallback(async (params: JoinRoomParams) => {
    setIsLoading(true);
    setError(null);

    try {
      await roomService.joinRoom(params);

      setRoomInfo({
        roomId: params.roomId,
        userUid: params.userUid,
        name: params.name,
        player: 'player2',
        selectNumber: params.numbers,
        opponent: '',
        opponentSelectNumber: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ルーム参加に失敗しました');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveRoom = useCallback(async (roomId: string, userUid: string) => {
    if (!roomId || !userUid) return;

    setIsLoading(true);
    setError(null);

    try {
      await roomService.leaveRoom(roomId, userUid);
      setRoomInfo(createInitialRoomInfo());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ルーム退出に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetGame = useCallback(
    async (roomId: string, userUid: string, newNumbers: number[]) => {
      if (!roomId || !userUid) return;

      setIsLoading(true);
      setError(null);

      try {
        await roomService.resetGame(
          roomId,
          userUid,
          newNumbers as [number, number, number]
        );

        // リセット成功時にroomInfoの選択数字を更新
        setRoomInfo((prev) => ({
          ...prev,
          selectNumber: newNumbers,
        }));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'ゲームリセットに失敗しました'
        );
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    roomInfo,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    resetGame,
    clearError,
    setRoomInfo, // 後方互換性のため残しておく
  };
};
