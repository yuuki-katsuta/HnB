/**
 * 文字列処理ユーティリティ関数
 */

/**
 * 数字配列を表示用文字列に変換
 * @param numbers 数字配列
 * @returns 結合された文字列
 */
export const formatNumbersForDisplay = (numbers: number[]): string => {
  return numbers.join('');
};

/**
 * プレイヤーIDから表示名を生成
 * @param playerId プレイヤーID
 * @returns 表示用の名前
 */
export const formatPlayerDisplayName = (playerId: string): string => {
  return playerId === 'player1' ? 'プレイヤー1' : 'プレイヤー2';
};

/**
 * 文字列を指定の長さで切り詰める
 * @param str 対象の文字列
 * @param maxLength 最大長
 * @param suffix 省略記号（デフォルト: '...'）
 * @returns 切り詰められた文字列
 */
export const truncateString = (
  str: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * 文字列が空または空白のみかチェック
 * @param str 対象の文字列
 * @returns 空または空白のみの場合true
 */
export const isEmptyOrWhitespace = (str: string): boolean => {
  return !str || str.trim() === '';
};
