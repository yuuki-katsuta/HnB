/**
 * 配列操作ユーティリティ関数
 */

/**
 * 数字配列を3桁のタプルに変換（型安全性向上）
 * @param numbers 数字配列
 * @returns 3桁のタプル
 * @throws Error 配列の長さが3でない場合
 */
export const convertToGameNumbers = (
  numbers: number[]
): [number, number, number] => {
  if (numbers.length !== 3) {
    throw new Error('Numbers array must have exactly 3 elements');
  }
  return [numbers[0], numbers[1], numbers[2]];
};

/**
 * 配列から重複を除去
 * @param array 対象の配列
 * @returns 重複が除去された配列
 */
export const removeDuplicates = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

/**
 * 配列をシャッフル（Fisher-Yates アルゴリズム）
 * @param array 対象の配列
 * @returns シャッフルされた新しい配列
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
