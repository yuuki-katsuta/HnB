/**
 * Firebase データ変換のインフラストラクチャ層
 */

import type { DocumentData, QuerySnapshot } from 'firebase/firestore';

import type { PlayerList } from '@/types/player';

/**
 * Firebase QuerySnapshotをPlayerListに変換
 * @param snapshot Firebase QuerySnapshot
 * @returns プレイヤーリスト
 */
export const convertSnapshotToPlayerList = (
  snapshot: QuerySnapshot<DocumentData>
): PlayerList => {
  const playerList: PlayerList = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data) {
      playerList.push({
        id: data.uid,
        name: data.name,
        player: data.player,
        selected: data.selected,
      });
    }
  });

  return playerList;
};
