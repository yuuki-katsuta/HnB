/**
 * 数値処理ユーティリティ関数
 */

/**
 * 指定した範囲の整数を生成
 * @param min 最小値（含む）
 * @param max 最大値（含む）
 * @returns 指定範囲内のランダムな整数
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 数値を指定した範囲内にクランプ
 * @param value 対象の数値
 * @param min 最小値
 * @param max 最大値
 * @returns クランプされた数値
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * パーセンテージを計算
 * @param value 現在の値
 * @param total 全体の値
 * @returns パーセンテージ（0-100）
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min((value / total) * 100, 100);
};

/**
 * 数値を指定した桁数で四捨五入
 * @param value 対象の数値
 * @param decimals 小数点以下の桁数
 * @returns 四捨五入された数値
 */
export const roundToDecimals = (value: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
};
