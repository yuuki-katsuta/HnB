/**
 * ランダム生成ユーティリティ関数
 */

/**
 * ランダムな数字配列を生成（重複なし）
 * @param count 生成する数字の個数
 * @param min 最小値（含む）
 * @param max 最大値（含む）
 * @returns 重複のないランダムな数字配列
 */
export const generateUniqueRandomNumbers = (
  count: number,
  min: number = 0,
  max: number = 9
): number[] => {
  if (count > max - min + 1) {
    throw new Error('Cannot generate more unique numbers than available range');
  }

  const numbers = new Set<number>();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }

  return Array.from(numbers);
};

/**
 * ランダムなゲーム用数字配列を生成（デバッグ用）
 * @returns 3桁の重複なし数字配列
 */
export const generateRandomGameNumbers = (): [number, number, number] => {
  const numbers = generateUniqueRandomNumbers(3, 0, 9);
  return [numbers[0], numbers[1], numbers[2]];
};

/**
 * ランダムな文字列を生成
 * @param length 文字列の長さ
 * @param charset 使用する文字セット（デフォルト: 英数字）
 * @returns ランダムな文字列
 */
export const generateRandomString = (
  length: number,
  charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
};

/**
 * 配列からランダムな要素を選択
 * @param array 対象の配列
 * @returns ランダムに選択された要素
 */
export const getRandomElement = <T>(array: T[]): T | undefined => {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};
